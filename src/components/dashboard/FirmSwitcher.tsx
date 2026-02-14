'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Building2, Check } from 'lucide-react'

interface Firm {
  id: string
  name: string
  slug: string
  logo_url?: string
}

interface FirmSwitcherProps {
  firms: Firm[]
  currentFirmId?: string
}

export function FirmSwitcher({ firms, currentFirmId }: FirmSwitcherProps) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newFirmName, setNewFirmName] = useState('')

  const currentFirm = firms.find(f => f.id === currentFirmId) || firms[0]

  const handleCreateFirm = async () => {
    if (!newFirmName.trim()) return
    
    setLoading(true)
    const slug = newFirmName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const { data: firm, error } = await supabase
      .from('firms')
      .insert({
        name: newFirmName,
        slug,
        owner_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single()

    if (!error && firm) {
      // Add user as owner to user_firms
      await supabase.from('user_firms').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        firm_id: firm.id,
        role: 'owner'
      })
      
      setOpen(false)
      setNewFirmName('')
      router.refresh()
    }
    setLoading(false)
  }

  const handleSwitchFirm = (firmId: string) => {
    // Store current firm in localStorage for switching
    localStorage.setItem('current_firm_id', firmId)
    router.refresh()
  }

  if (!currentFirm && firms.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Firm
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your First Firm</DialogTitle>
            <DialogDescription>
              Get started by creating your first firm/agency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Firm Name</Label>
              <Input
                id="name"
                placeholder="My PR Agency"
                value={newFirmName}
                onChange={(e) => setNewFirmName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFirm} disabled={loading}>
              {loading ? 'Creating...' : 'Create Firm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{currentFirm?.name || 'Select Firm'}</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Firms</DialogTitle>
          <DialogDescription>
            Switch between your firms or create a new one
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          {firms.map((firm) => (
            <Card
              key={firm.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                firm.id === currentFirmId ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleSwitchFirm(firm.id)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{firm.name}</p>
                  <p className="text-xs text-muted-foreground">/firms/{firm.slug}</p>
                </div>
                {firm.id === currentFirmId && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <div className="w-full space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or create a new firm
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New firm name"
                value={newFirmName}
                onChange={(e) => setNewFirmName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFirm()}
              />
              <Button onClick={handleCreateFirm} disabled={loading || !newFirmName.trim()}>
                {loading ? '...' : <Plus className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
