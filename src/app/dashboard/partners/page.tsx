import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Search, MoreHorizontal, Users, Building2 } from 'lucide-react'
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

export default async function PartnersPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const resolvedSearchParams = await searchParams
  const currentFirmId = resolvedSearchParams.firm

  // Get user's firms for switcher
  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id
  const activeFirm = firms.find(f => f.id === activeFirmId) || firms[0]

  // Get partners for active firm
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .eq('firm_id', activeFirmId)
    .order('created_at', ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Webhook.cafe</h1>
            <FirmSwitcher firms={firms} currentFirmId={activeFirmId} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Partners</h2>
            <p className="text-muted-foreground">
              Manage your partners and discount codes
            </p>
          </div>
          <Link href={`/dashboard/partners/new?firm=${activeFirmId}`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Partner
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search partners..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>

        {/* Partners Grid */}
        {partners && partners.length > 0 ? (
          <div className="grid gap-4">
            {partners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {partner.discount_code && (
                          <Badge variant="secondary">{partner.discount_code}</Badge>
                        )}
                        {partner.discount_percentage > 0 && (
                          <span>{partner.discount_percentage}% off</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                      {partner.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/partners/${partner.id}?firm=${activeFirmId}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Partners Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by adding your first partner
              </p>
              <Link href={`/dashboard/partners/new?firm=${activeFirmId}`}>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Partner
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
