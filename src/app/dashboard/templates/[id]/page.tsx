'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const templateId = params.id as string
  const firmId = searchParams.get('firm')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    is_default: false
  })

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) return
      
      const { data, error } = await supabase
        .from('embed_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (data) {
        setFormData({
          name: data.name || '',
          is_default: data.is_default || false
        })
      }
      setLoading(false)
    }

    fetchTemplate()
  }, [templateId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateId || !firmId) {
      setError('Missing required fields')
      return
    }

    if (!formData.name.trim()) {
      setError('Template name is required')
      return
    }

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('embed_templates')
      .update({
        name: formData.name,
        is_default: formData.is_default
      })
      .eq('id', templateId)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.push(`/dashboard/templates?firm=${firmId}`)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) return
    if (!templateId || !firmId) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('embed_templates')
      .delete()
      .eq('id', templateId)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push(`/dashboard/templates?firm=${firmId}`)
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
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-6 flex items-center justify-between">
        <Link 
          href={`/dashboard/templates?firm=${firmId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
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

      {/* Form */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Template</CardTitle>
          <CardDescription>
            Update template settings
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
    </div>
  )
}
