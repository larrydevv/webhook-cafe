'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Copy, Check, Loader2, Trash2, Plus, Send, Coffee } from 'lucide-react'

export default function InviteMembersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const firmId = searchParams.get('firm')
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [invites, setInvites] = useState<any[]>([])
  const [newInviteLink, setNewInviteLink] = useState('')

  const generateInviteLink = async () => {
    if (!email.trim() || !firmId) return

    setLoading(true)
    const token = Math.random().toString(36).substring(2, 15)
    
    const { data, error } = await supabase
      .from('invites')
      .insert({
        firm_id: firmId,
        email: email,
        token: token,
        status: 'pending',
        role: 'member'
      })
      .select()
      .single()

    if (!error && data) {
      const link = `${window.location.origin}/join/${token}`
      setNewInviteLink(link)
      setInvites([...invites, data])
      setEmail('')
    }
    setLoading(false)
  }

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteInvite = async (id: string) => {
    await supabase.from('invites').delete().eq('id', id)
    setInvites(invites.filter(i => i.id !== id))
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Send className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Invite Members</h2>
            <p className="text-[#6B4423]">Send invitations to join your team</p>
          </div>
        </div>

        {/* Send Invite */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#6B4423]" />
              Send New Invite
            </CardTitle>
            <CardDescription className="text-[#8B7355]">
              Enter an email address to send an invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-[#6B4423]">Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4423]" />
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-[#F5F0E8]/50 border-[#6B4423]/20"
                      onKeyDown={(e) => e.key === 'Enter' && generateInviteLink()}
                    />
                  </div>
                  <Button 
                    onClick={generateInviteLink} 
                    disabled={!email.trim() || loading}
                    className="btn-cafe"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {newInviteLink && (
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Invite created!</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={newInviteLink}
                    className="flex-1 bg-white/50 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyLink(newInviteLink)}
                    className="gap-2 border-[#6B4423] text-[#6B4423]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Invites */}
        <Card className="cafe-card">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#6B4423]" />
              Pending Invites
            </CardTitle>
            <CardDescription className="text-[#8B7355]">
              Invites that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invites.length > 0 ? (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div 
                    key={invite.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0E8]/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#6B4423]/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#6B4423]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{invite.email}</p>
                        <p className="text-sm text-[#8B7355]">
                          Sent {new Date(invite.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-600">
                        {invite.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteInvite(invite.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Coffee className="w-12 h-12 text-[#6B4423] mx-auto mb-4 opacity-50" />
                <p className="text-[#8B7355]">No pending invites</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
