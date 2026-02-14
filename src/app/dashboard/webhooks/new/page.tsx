'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Webhook, Copy, Check } from 'lucide-react'
import Link from 'next/link'

export default function NewWebhookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const firmId = searchParams.get('firm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    webhook_url: ''
  })

  const validateWebhookUrl = (url: string): boolean => {
    // Discord webhook URL format:
    // https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
    const regex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+$/
    return regex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firmId) {
      setError('No firm selected')
      return
    }

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.webhook_url.trim()) {
      setError('Webhook URL is required')
      return
    }

    if (!validateWebhookUrl(formData.webhook_url)) {
      setError('Invalid Discord webhook URL format')
      return
    }

    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('webhooks').insert({
      firm_id: firmId,
      name: formData.name,
      webhook_url: formData.webhook_url,
      is_active: true
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      router.push(`/dashboard/webhooks?firm=${firmId}`)
    }
    setLoading(false)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(formData.webhook_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/dashboard/webhooks?firm=${firmId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Webhooks
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                <Webhook className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div>
                <CardTitle>Add Discord Webhook</CardTitle>
                <CardDescription>
                  Connect a Discord webhook to send messages
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Webhook Name *</Label>
                <Input
                  id="name"
                  placeholder="My Discord Webhook"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A friendly name to identify this webhook
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL *</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook_url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    disabled={!formData.webhook_url}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get this from Discord: Server Settings → Integrations → Webhooks
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Webhook'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
