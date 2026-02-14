import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Search, MoreHorizontal, Webhook, Copy, Check, X } from 'lucide-react'
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

export default async function WebhooksPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const resolvedSearchParams = await searchParams
  const currentFirmId = resolvedSearchParams.firm

  // Get user's firms
  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

  // Get webhooks for active firm
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('firm_id', activeFirmId)
    .order('created_at', ascending: false })

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

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
            <h2 className="text-2xl font-bold">Webhooks</h2>
            <p className="text-muted-foreground">
              Manage Discord webhooks for your firm
            </p>
          </div>
          <Link href={`/dashboard/webhooks/new?firm=${activeFirmId}`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Webhook
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search webhooks..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>

        {/* Webhooks Grid */}
        {webhooks && webhooks.length > 0 ? (
          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                      <Webhook className="w-6 h-6 text-[#5865F2]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{webhook.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {webhook.webhook_url.substring(0, 40)}...
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                      {webhook.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(webhook.webhook_url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/webhooks/${webhook.id}?firm=${activeFirmId}`}>
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
              <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Webhooks Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first Discord webhook to start sending messages
              </p>
              <Link href={`/dashboard/webhooks/new?firm=${activeFirmId}`}>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Webhook
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
