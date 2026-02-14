import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Users, MessageSquare, Settings, Building2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Get user's firms
  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  // Get current firm from localStorage (client-side in FirmSwitcher)
  const currentFirmId = firms?.[0]?.id

  // Get stats for current firm
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Webhook.cafe</h1>
            <FirmSwitcher firms={firms || []} currentFirmId={currentFirmId} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email || user.user_metadata?.full_name || 'User'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {currentFirmId ? 'Dashboard' : 'Welcome!'}
          </h2>
          <p className="text-muted-foreground">
            {currentFirmId
              ? `Manage your firm and partners`
              : 'Create your first firm to get started'}
          </p>
        </div>

        {currentFirmId ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Partners</p>
                      <p className="text-2xl font-bold">{partnersCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Webhooks</p>
                      <p className="text-2xl font-bold">{webhooksCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Messages Sent</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/dashboard/partners/new">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Add Partner</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a new partner
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/webhooks/new">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Add Webhook</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect Discord webhook
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/dashboard/firms/${currentFirmId}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Firm Settings</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage firm details
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </>
        ) : (
          /* No Firms State */
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Create Your First Firm</CardTitle>
              <CardDescription>
                Firms represent your PR agency or business. Create one to start managing partners and webhooks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FirmSwitcher firms={firms || []} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
