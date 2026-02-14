import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Users, MessageSquare, Settings, Building2, ChevronRight, Coffee, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  const currentFirmId = firms?.[0]?.id

  let partnersCount = 0
  let webhooksCount = 0
  
  if (currentFirmId) {
    const [{ count: partners }, { count: webhooks }] = await Promise.all([
      supabase.from('partners').select('*', { count: 'exact', head: true }).eq('firm_id', currentFirmId),
      supabase.from('webhooks').select('*', { count: 'exact', head: true }).eq('firm_id', currentFirmId)
    ])
    partnersCount = partners || 0
    webhooksCount = webhooks || 0
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Coffee className="w-7 h-7 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
              {currentFirmId ? 'Welcome Back!' : 'Welcome!'}
            </h2>
            <p className="text-[#6B4423]">
              {currentFirmId
                ? `Ready to brew some messages for ${firms?.[0]?.name}?`
                : 'Create your first firm to get started'}
            </p>
          </div>
        </div>
      </div>

      {currentFirmId ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="cafe-card cafe-card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#6B4423]/10 flex items-center justify-center">
                    <Users className="w-7 h-7 text-[#6B4423]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4423]">Partners</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">{partnersCount}</p>
                    <p className="text-xs text-[#8B7355] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12% this week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cafe-card cafe-card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#1A1A1A]/10 flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4423]">Webhooks</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">{webhooksCount}</p>
                    <p className="text-xs text-[#8B7355] flex items-center gap-1">
                      <Coffee className="w-3 h-3" />
                      Ready to serve
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cafe-card cafe-card-hover">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B4423]">Messages Sent</p>
                    <p className="text-3xl font-bold text-[#1A1A1A]">0</p>
                    <p className="text-xs text-[#8B7355]">
                      Start brewing!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#6B4423]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/partners/new">
              <Card className="cafe-card cafe-card-hover cursor-pointer h-full group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#6B4423]/10 group-hover:bg-[#6B4423] transition-colors">
                      <Plus className="w-6 h-6 text-[#6B4423] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1A1A]">Add Partner</h3>
                      <p className="text-sm text-[#8B7355]">New collaboration</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8B7355] group-hover:text-[#6B4423] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/webhooks/new">
              <Card className="cafe-card cafe-card-hover cursor-pointer h-full group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#1A1A1A]/10 group-hover:bg-[#1A1A1A] transition-colors">
                      <MessageSquare className="w-6 h-6 text-[#1A1A1A] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1A1A]">Add Webhook</h3>
                      <p className="text-sm text-[#8B7355]">Connect Discord</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8B7355] group-hover:text-[#1A1A1A] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/embed">
              <Card className="cafe-card cafe-card-hover cursor-pointer h-full group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#D4C4B0]/50 group-hover:bg-[#6B4423] transition-colors">
                      <Coffee className="w-6 h-6 text-[#6B4423] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1A1A]">Craft Embed</h3>
                      <p className="text-sm text-[#8B7355]">Design your message</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8B7355] group-hover:text-[#6B4423] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href={`/dashboard/firms/${currentFirmId}`}>
              <Card className="cafe-card cafe-card-hover cursor-pointer h-full group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#8B7355]/20 group-hover:bg-[#8B7355] transition-colors">
                      <Building2 className="w-6 h-6 text-[#8B7355] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1A1A]">Firm Settings</h3>
                      <p className="text-sm text-[#8B7355]">Manage details</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#8B7355] group-hover:text-[#8B7355] transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      ) : (
        /* No Firms State */
        <Card className="max-w-md mx-auto cafe-card">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-4">
              <Coffee className="w-10 h-10 text-[#6B4423]" />
            </div>
            <CardTitle className="text-2xl text-[#1A1A1A]">Create Your First Firm</CardTitle>
            <CardDescription className="text-[#6B4423]">
              Firms represent your PR agency or business. Create one to start managing partners and webhooks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FirmSwitcher firms={firms || []} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
