import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Download, Filter, CheckCircle, XCircle, Clock, Send, Coffee } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ firm?: string }>
}

export default async function ActivityPage({ searchParams }: PageProps) {
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

  const { data: messages } = await supabase
    .from('sent_messages')
    .select('*, webhooks(name)')
    .eq('firm_id', activeFirmId)
    .order('sent_at', ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Activity</h2>
            <p className="text-[#6B4423]">Your recent activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]" />
        <input
          type="text"
          placeholder="Search activity..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F5F0E8]/50 border-[#6B4423]/20 focus:border-[#6B4423]"
        />
      </div>

      {/* Activity List */}
      {messages && messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card key={message.id} className="cafe-card hover:border-[#6B4423]/50 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {message.status === 'sent' ? (
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : message.status === 'failed' ? (
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#6B4423]/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#6B4423]" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#1A1A1A]">
                      Message via {message.webhooks?.name || 'Webhook'}
                    </p>
                    <p className="text-sm text-[#8B7355]">
                      {message.sent_at ? new Date(message.sent_at).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={message.status === 'sent' ? 'bg-green-500' : message.status === 'failed' ? 'bg-red-500' : 'bg-[#6B4423]'}
                >
                  {message.status || 'pending'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto cafe-card">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-[#6B4423]" />
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">No Activity Yet</h3>
            <p className="text-[#6B4423] mb-4">Sent messages will appear here</p>
            <Link href="/dashboard/embed">
              <Button className="gap-2 btn-cafe">
                <Coffee className="w-4 h-4" />
                Craft Your First Embed
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
