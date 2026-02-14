import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { ArrowUp, ArrowDown, Users, Webhook, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ firm?: string }>
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
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

  // Get analytics data
  const [
    { count: partnersCount },
    { count: webhooksCount },
    { count: messagesSent },
    { count: messagesFailed }
  ] = await Promise.all([
    supabase.from('partners').select('*', { count: 'exact', head: true }).eq('firm_id', activeFirmId),
    supabase.from('webhooks').select('*', { count: 'exact', head: true }).eq('firm_id', activeFirmId),
    supabase.from('sent_messages').select('*', { count: 'exact', head: true }).eq('firm_id', activeFirmId).eq('status', 'sent'),
    supabase.from('sent_messages').select('*', { count: 'exact', head: true }).eq('firm_id', activeFirmId).eq('status', 'failed')
  ])

  // Mock chart data
  const weeklyData = [
    { day: 'Mon', sent: 12, failed: 1 },
    { day: 'Tue', sent: 19, failed: 2 },
    { day: 'Wed', sent: 8, failed: 0 },
    { day: 'Thu', sent: 25, failed: 3 },
    { day: 'Fri', sent: 31, failed: 1 },
    { day: 'Sat', sent: 15, failed: 0 },
    { day: 'Sun', sent: 9, failed: 1 },
  ]

  const maxSent = Math.max(...weeklyData.map(d => d.sent))

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">
            Track your firm's performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="p-2 rounded-lg border bg-background text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Partners</p>
                <p className="text-3xl font-bold">{partnersCount || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-3xl font-bold">{webhooksCount || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-[#5865F2]/10">
                <Webhook className="w-6 h-6 text-[#5865F2]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Messages Sent</p>
                <p className="text-3xl font-bold">{messagesSent || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUp className="w-3 h-3" />
                  <span>+23%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Send className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold">{messagesFailed || 0}</p>
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <ArrowDown className="w-3 h-3" />
                  <span>-8%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-red-500/10">
                <MessageSquare className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Messages sent per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(day.sent / maxSent) * 150}px` }}
                    />
                    <div
                      className="w-full bg-red-500 rounded-b"
                      style={{ height: `${(day.failed / maxSent) * 150}px`, marginTop: '-2px' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm">Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Rate</CardTitle>
            <CardDescription>Overall message success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="12"
                    strokeDasharray={`${((messagesSent || 1) / ((messagesSent || 1) + (messagesFailed || 0))) * 554} 554`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold">
                    {Math.round(((messagesSent || 1) / ((messagesSent || 1) + (messagesFailed || 0))) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Message sent to #announcements', time: '2 minutes ago', status: 'success' },
              { action: 'Partner "TechCorp" added', time: '1 hour ago', status: 'info' },
              { action: 'Webhook "Marketing" created', time: '3 hours ago', status: 'info' },
              { action: 'Template "Launch" saved', time: 'Yesterday', status: 'info' },
              { action: 'Message failed to send', time: 'Yesterday', status: 'error' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <span>{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
