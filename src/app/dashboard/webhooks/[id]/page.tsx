'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Webhook, Trash2, Send } from 'lucide-react'
import Link from 'next/link'

export default function EditWebhookPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const webhookId = params.id as string
  const firmId = searchParams.get('firm')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    webhook_url: '',
    is_active: true
  })

  useEffect(() => {
    const fetchWebhook = async () => {
      if (!webhookId) return
      
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('id', webhookId)
        .single()

      if (data) {
        setFormData({
          name: data.name || '',
          webhook_url: data.webhook_url || '',
          is_active: data.is_active ?? true
        })
      }
      setLoading(false)
    }

    fetchWebhook()
  }, [webhookId])

  const validateWebhookUrl = (url: string): boolean => {
    const regex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+$/
    return regex.test(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!webhookId || !firmId) {
      setError('Missing required fields')
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

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('webhooks')
      .update({
        name: formData.name,
        webhook_url: formData.webhook_url,
        is_active: formData.is_active
      })
      .eq('id', webhookId)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.push(`/dashboard/webhooks?firm=${firmId}`)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this webhook?')) return
    if (!webhookId || !firmId) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', webhookId)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push(`/dashboard/webhooks?firm=${firmId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href={`/dashboard/webhooks?firm=${firmId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Webhooks
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Webhook</CardTitle>
            <CardDescription>
              Update webhook configuration
            </CardDescription>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL *</Label>
                <Input
                  id="webhook_url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-input"
                  />
                  <span className="text-sm">Webhook is active</span>
                </label>
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
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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
