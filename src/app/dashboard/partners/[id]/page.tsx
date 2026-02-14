'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditPartnerPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const partnerId = params.id as string
  const firmId = searchParams.get('firm')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    discord_id: '',
    email: '',
    discount_code: '',
    discount_percentage: '',
    notes: '',
    status: 'active'
  })

  useEffect(() => {
    const fetchPartner = async () => {
      if (!partnerId) return
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .single()

      if (data) {
        setFormData({
          name: data.name || '',
          discord_id: data.discord_id || '',
          email: data.email || '',
          discount_code: data.discount_code || '',
          discount_percentage: data.discount_percentage?.toString() || '',
          notes: data.notes || '',
          status: data.status || 'active'
        })
      }
      setLoading(false)
    }

    fetchPartner()
  }, [partnerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partnerId || !firmId) {
      setError('Missing required fields')
      return
    }

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('partners')
      .update({
        name: formData.name,
        discord_id: formData.discord_id || null,
        email: formData.email || null,
        discount_code: formData.discount_code || null,
        discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : 0,
        notes: formData.notes || null,
        status: formData.status
      })
      .eq('id', partnerId)

    if (updateError) {
      setError(updateError.message)
    } else {
      router.push(`/dashboard/partners?firm=${firmId}`)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this partner?')) return
    if (!partnerId || !firmId) return

    setDeleting(true)
    const { error: deleteError } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId)

    if (deleteError) {
      setError(deleteError.message)
      setDeleting(false)
    } else {
      router.push(`/dashboard/partners?firm=${firmId}`)
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
            href={`/dashboard/partners?firm=${firmId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Partners
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
            <CardTitle>Edit Partner</CardTitle>
            <CardDescription>
              Update partner information
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
                <Label htmlFor="name">Partner Name *</Label>
                <Input
                  id="name"
                  placeholder="Partner Company Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discord_id">Discord ID</Label>
                  <Input
                    id="discord_id"
                    placeholder="123456789"
                    value={formData.discord_id}
                    onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="partner@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_code">Discount Code</Label>
                  <Input
                    id="discount_code"
                    placeholder="SUMMER25"
                    value={formData.discount_code}
                    onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Discount %</Label>
                  <Input
                    id="discount_percentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="25"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full p-2 rounded-lg border bg-background"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
                  placeholder="Additional notes about this partner..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
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
