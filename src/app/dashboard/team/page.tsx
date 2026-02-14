import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Mail, Shield, UserPlus, Copy, Coffee } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PageProps {
  searchParams: Promise<{ firm?: string }>
}

export default async function TeamPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const resolvedSearchParams = await searchParams
  const currentFirmId = resolvedSearchParams.firm

  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

  const { data: teamMembers } = await supabase
    .from('user_firms')
    .select('*, users(*)')
    .eq('firm_id', activeFirmId)

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Team</h2>
            <p className="text-[#6B4423]">Manage your team members</p>
          </div>
        </div>
        <Button className="gap-2 btn-cafe">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Invite Link */}
      <Card className="cafe-card mb-6">
        <CardHeader>
          <CardTitle className="text-base text-[#1A1A1A]">Invite Link</CardTitle>
          <CardDescription className="text-[#8B7355]">
            Share this link to invite team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`https:// webhook.cafe/join/${activeFirmId}`}
              className="flex-1 p-3 rounded-lg border bg-[#F5F0E8]/50 border-[#6B4423]/20 font-mono text-sm"
            />
            <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="cafe-card mb-6">
        <CardHeader>
          <CardTitle className="text-[#1A1A1A]">Team Members</CardTitle>
          <CardDescription className="text-[#8B7355]">
            {teamMembers?.length || 0} members in this firm
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-[#F5F0E8]/30"
                  style={{ borderColor: 'rgba(107, 68, 35, 0.1)' }}
                >
                  <div className="flex items-center gap-3">
                    {member.users?.avatar_url ? (
                      <img
                        src={member.users.avatar_url}
                        alt=""
                        className="w-12 h-12 rounded-xl border-2 border-[#6B4423]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#6B4423] flex items-center justify-center">
                        <span className="font-medium text-[#F5F0E8]">
                          {member.users?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {member.users?.discord_username || member.users?.email || 'Unknown'}
                      </p>
                      <p className="text-sm text-[#8B7355]">{member.users?.email}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={member.role === 'owner' ? 'default' : 'secondary'}
                    className={member.role === 'owner' ? 'bg-[#6B4423]' : ''}
                  >
                    {member.role === 'owner' && <Shield className="w-3 h-3 mr-1" />}
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-[#6B4423] mx-auto mb-4 opacity-50" />
              <p className="text-[#8B7355]">No team members yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
