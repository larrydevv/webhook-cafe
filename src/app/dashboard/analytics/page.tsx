import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { ArrowUp, ArrowDown, Users, Webhook, MessageSquare, Send, Coffee, TrendingUp } from 'lucide-react'
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

  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

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
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Coffee className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Analytics</h2>
            <p className="text-[#6B4423]">Track your performance</p>
          </div>
        </div>
        <select className="p-2 rounded-lg border bg-[#F5F0E8] text-[#1A1A1A]">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="cafe-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B4423]">Partners</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{partnersCount || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#6B4423]/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-[#6B4423]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cafe-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B4423]">Webhooks</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{webhooksCount || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#1A1A1A]/10 flex items-center justify-center">
                <Webhook className="w-7 h-7 text-[#1A1A1A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cafe-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B4423]">Sent</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{messagesSent || 0}</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+23%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Send className="w-7 h-7 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cafe-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B4423]">Failed</p>
                <p className="text-3xl font-bold text-[#1A1A1A]">{messagesFailed || 0}</p>
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <ArrowDown className="w-3 h-3" />
                  <span>-8%</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="cafe-card">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A]">Weekly Activity</CardTitle>
            <CardDescription className="text-[#8B7355]">Messages sent per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#6B4423] rounded-t"
                      style={{ height: `${(day.sent / maxSent) * 150}px` }}
                    />
                    <div
                      className="w-full bg-red-500 rounded-b"
                      style={{ height: `${(day.failed / maxSent) * 150}px`, marginTop: '-2px' }}
                    />
                  </div>
                  <span className="text-xs text-[#8B7355]">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#6B4423]" />
                <span className="text-sm text-[#6B4423]">Sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm text-red-500">Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cafe-card">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A]">Delivery Rate</CardTitle>
            <CardDescription className="text-[#8B7355]">Overall success rate</CardDescription>
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
                    stroke="#D4C4B0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="#6B4423"
                    strokeWidth="12"
                    strokeDasharray={`${((messagesSent || 1) / ((messagesSent || 1) + (messagesFailed || 0))) * 554} 554`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-[#1A1A1A]">
                    {Math.round(((messagesSent || 1) / ((messagesSent || 1) + (messagesFailed || 0))) * 100)}%
                  </p>
                  <p className="text-sm text-[#8B7355]">Success</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="cafe-card">
        <CardHeader>
          <CardTitle className="text-[#1A1A1A]">Recent Activity</CardTitle>
          <CardDescription className="text-[#8B7355]">Your latest actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Message sent to #announcements', time: '2 min ago', status: 'success' },
              { action: 'Partner "TechCorp" added', time: '1 hour ago', status: 'info' },
              { action: 'Webhook "Marketing" created', time: '3 hours ago', status: 'info' },
              { action: 'Template "Launch" saved', time: 'Yesterday', status: 'info' },
              { action: 'Message failed to send', time: 'Yesterday', status: 'error' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'rgba(107, 68, 35, 0.1)' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-[#6B4423]'
                  }`} />
                  <span className="text-[#1A1A1A]">{activity.action}</span>
                </div>
                <span className="text-sm text-[#8B7355]">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
