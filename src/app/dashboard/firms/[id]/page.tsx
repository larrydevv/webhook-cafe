'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Trash2, Globe, Hash, Users, Save, Coffee } from 'lucide-react'
import Link from 'next/link'

export default function FirmSettingsPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const firmId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    logo_url: ''
  })

  useEffect(() => {
    const fetchFirm = async () => {
      if (!firmId) return
      
      const { data, error } = await supabase
        .from('firms')
        .select('*')
        .eq('id', firmId)
        .single()

      if (data) {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          website: data.website || '',
          logo_url: data.logo_url || ''
        })
      }
      setLoading(false)
    }

    fetchFirm()
  }, [firmId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firmId) {
      setError('Missing firm ID')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const { error: updateError } = await supabase
      .from('firms')
      .update({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        website: formData.website || null,
        logo_url: formData.logo_url || null
      })
      .eq('id', firmId)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Settings saved successfully!')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this firm? This action cannot be undone.')) return
    if (!firmId) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('firms')
      .delete()
      .eq('id', firmId)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push('/dashboard')
    }
  }

  const updateSlug = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setFormData({ ...formData, name, slug })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center texture-paper">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B4423]" />
          <span className="text-[#6B4423]">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-[#6B4423] hover:text-[#1A1A1A] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto cafe-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#F5F0E8]" />
            </div>
            <div>
              <CardTitle className="text-[#1A1A1A]">Firm Settings</CardTitle>
              <CardDescription className="text-[#8B7355]">
                Manage your firm's profile and settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 rounded-lg bg-green-500/10 text-green-500 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[#6B4423]">Firm Name *</Label>
              <Input
                placeholder="My PR Agency"
                value={formData.name}
                onChange={(e) => updateSlug(e.target.value)}
                className="bg-[#F5F0E8]/50 border-[#6B4423]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B4423] flex items-center gap-2">
                <Hash className="w-4 h-4" />
                URL Slug
              </Label>
              <Input
                value={formData.slug}
                readOnly
                className="font-mono bg-[#F5F0E8]/30 border-[#6B4423]/20"
              />
              <p className="text-xs text-[#8B7355]">
                webhook.cafe/p/{formData.slug || 'your-firm'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B4423]">Description</Label>
              <textarea
                placeholder="Tell us about your firm..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[100px] p-3 rounded-lg border bg-[#F5F0E8]/50 border-[#6B4423]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B4423] flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                placeholder="https://your-agency.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-[#F5F0E8]/50 border-[#6B4423]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B4423]">Logo URL</Label>
              <Input
                placeholder="https://example.com/logo.png"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="bg-[#F5F0E8]/50 border-[#6B4423]/20"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 btn-cafe"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            {/* Delete Section */}
            <div className="pt-6 border-t border-[#6B4423]/20">
              <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
              <p className="text-sm text-[#8B7355] mb-4">
                Once you delete a firm, there is no going back.
              </p>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Firm
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
