import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Mail, User, Shield, Calendar, Coffee } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <User className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Profile</h2>
            <p className="text-[#6B4423]">Manage your account</p>
          </div>
        </div>

        {/* Avatar & Basic Info */}
        <Card className="cafe-card mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-24 h-24 rounded-2xl border-2 border-[#6B4423]"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#6B4423] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#F5F0E8]">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#1A1A1A]">
                  {user.user_metadata?.full_name || profile?.discord_username || 'User'}
                </h3>
                <p className="text-[#6B4423]">{user.email}</p>
                <Badge className="mt-2 bg-[#6B4423]">{profile?.user_type || 'Free'} Plan</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <User className="w-5 h-5 text-[#6B4423]" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#6B4423]">Discord ID</label>
                <p className="font-medium text-[#1A1A1A]">{profile?.discord_id || 'Not connected'}</p>
              </div>
              <div>
                <label className="text-sm text-[#6B4423]">Username</label>
                <p className="font-medium text-[#1A1A1A]">{profile?.discord_username || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-[#6B4423]">Email</label>
                <p className="font-medium text-[#1A1A1A]">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-[#6B4423]">Created</label>
                <p className="font-medium text-[#1A1A1A]">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Calendar className="w-5 h-5 text-[#6B4423]" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#6B4423]/10">
                <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
                <p className="text-sm text-[#6B4423]">Firms</p>
              </div>
              <div className="p-4 rounded-xl bg-[#1A1A1A]/10">
                <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
                <p className="text-sm text-[#6B4423]">Partners</p>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10">
                <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
                <p className="text-sm text-[#6B4423]">Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="cafe-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Shield className="w-5 h-5 text-[#6B4423]" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#6B4423] mb-4">
              Your account is secured with Discord OAuth.
            </p>
            <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
              <Settings className="w-4 h-4" />
              Discord Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
