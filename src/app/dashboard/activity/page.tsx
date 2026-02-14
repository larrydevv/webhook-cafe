import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Search, Download, Filter, CheckCircle, XCircle, Clock, Send } from 'lucide-react'

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

  // Get sent messages for active firm
  const { data: messages } = await supabase
    .from('sent_messages')
    .select('*, webhooks(name)')
    .eq('firm_id', activeFirmId)
    .order('sent_at', ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-muted-foreground">
            Track all sent messages and activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activity..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Activity List */}
      {messages && messages.length > 0 ? (
        <div className="space-y-2">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {message.status === 'sent' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : message.status === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      Message sent via {message.webhooks?.name || 'Webhook'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {message.sent_at ? new Date(message.sent_at).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
                <Badge variant={message.status === 'sent' ? 'default' : 'destructive'}>
                  {message.status || 'pending'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Send className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Activity Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sent messages will appear here
            </p>
            <Button variant="outline" className="gap-2">
              <Send className="w-4 h-4" />
              Send Your First Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
