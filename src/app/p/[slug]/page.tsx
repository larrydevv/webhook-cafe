import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Users, MessageSquare, Globe, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicFirmPage({ params }: PageProps) {
  const supabase = await createClient()
  const resolvedParams = await params
  const { slug } = resolvedParams

  // Get firm by slug
  const { data: firm } = await supabase
    .from('firms')
    .select('*, users(discord_username, avatar_url)')
    .eq('slug', slug)
    .single()

  if (!firm) {
    notFound()
  }

  // Get partner count
  const { count: partnerCount } = await supabase
    .from('partners')
    .select('*', { count: 'exact', head: true })
    .eq('firm_id', firm.id)
    .eq('status', 'active')

  // Get recent partners
  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .eq('firm_id', firm.id)
    .eq('status', 'active')
    .limit(6)
    .order('created_at', ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="font-bold">Webhook.cafe</span>
          </Link>
          <Link href="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Firm Info */}
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={firm.logo_url} alt={firm.name} />
                  <AvatarFallback className="text-2xl">
                    {firm.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{firm.name}</h1>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  {firm.description && (
                    <p className="text-muted-foreground mb-4">{firm.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {firm.website && (
                      <a
                        href={firm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {partnerCount || 0} Partners
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Since {new Date(firm.created_at).getFullYear()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button>Contact</Button>
                  <Button variant="outline">Share</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">{partnerCount || 0}</p>
                <p className="text-muted-foreground">Active Partners</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">0</p>
                <p className="text-muted-foreground">Messages Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-muted-foreground">Delivery Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Partners Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Partners</CardTitle>
              <CardDescription>
                Companies working with {firm.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {partners && partners.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm">
                            {partner.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{partner.name}</p>
                          {partner.discount_code && (
                            <Badge variant="outline" className="text-xs">
                              {partner.discount_code}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No partners yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by Webhook.cafe</p>
        </div>
      </footer>
    </div>
  )
}
