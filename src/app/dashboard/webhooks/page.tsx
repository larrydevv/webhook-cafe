import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Search, MoreHorizontal, Webhook, Copy, Coffee, MessageSquare } from 'lucide-react'
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

  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('firm_id', activeFirmId)
    .order('created_at', ascending: false })

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Coffee className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Webhooks</h2>
            <p className="text-[#6B4423]">Manage Discord connections</p>
          </div>
        </div>
        <Link href={`/dashboard/webhooks/new?firm=${activeFirmId}`}>
          <Button className="gap-2 btn-cafe">
            <Plus className="w-4 h-4" />
            Add Webhook
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]" />
        <input
          type="text"
          placeholder="Search webhooks..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F5F0E8]/50 border-[#6B4423]/20 focus:border-[#6B4423] focus:ring-2 focus:ring-[#6B4423]/20"
        />
      </div>

      {/* Webhooks Grid */}
      {webhooks && webhooks.length > 0 ? (
        <div className="grid gap-3">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className="cafe-card hover:border-[#6B4423]/50 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6B4423]/10 flex items-center justify-center">
                    <Webhook className="w-6 h-6 text-[#6B4423]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{webhook.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#8B7355]">
                      <code className="text-xs bg-[#F5F0E8] px-2 py-0.5 rounded">
                        {webhook.webhook_url.substring(0, 35)}...
                      </code>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={webhook.is_active ? 'default' : 'secondary'}
                    className={webhook.is_active ? 'bg-green-500' : ''}
                  >
                    {webhook.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#6B4423]"
                    onClick={() => copyToClipboard(webhook.webhook_url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#6B4423]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/webhooks/${webhook.id}?firm=${activeFirmId}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
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
        <Card className="max-w-md mx-auto cafe-card">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#6B4423]" />
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">No Webhooks Yet</h3>
            <p className="text-[#6B4423] mb-4">Add your first Discord webhook</p>
            <Link href={`/dashboard/webhooks/new?firm=${activeFirmId}`}>
              <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white">
                <Plus className="w-4 h-4" />
                Add Webhook
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
