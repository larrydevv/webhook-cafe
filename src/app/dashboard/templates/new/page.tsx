'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Star } from 'lucide-react'
import Link from 'next/link'

export default function NewTemplatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const firmId = searchParams.get('firm')
  const templateId = searchParams.get('template') // Optional: duplicate from existing template
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    is_default: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firmId) {
      setError('No firm selected')
      return
    }

    if (!formData.name.trim()) {
      setError('Template name is required')
      return
    }

    setLoading(true)
    setError('')

    // If duplicating from existing template, fetch its content
    let content = null
    if (templateId) {
      const { data: template } = await supabase
        .from('embed_templates')
        .select('content')
        .eq('id', templateId)
        .single()
      content = template?.content
    }

    const { error: insertError } = await supabase.from('embed_templates').insert({
      firm_id: firmId,
      name: formData.name,
      content: content || {},
      is_default: formData.is_default
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      router.push(`/dashboard/templates?firm=${firmId}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-6">
        <Link 
          href={`/dashboard/templates?firm=${firmId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Link>
      </div>

      {/* Form */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
          <CardDescription>
            Save your current embed as a template for quick reuse
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
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                placeholder="Product Launch Embed"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                A descriptive name to identify this template
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="rounded border-input"
                />
                <Star className="w-4 h-4" />
                <span className="text-sm">Set as default template</span>
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
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Template'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
