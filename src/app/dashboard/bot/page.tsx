import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bot, Settings, ExternalLink, Copy, Check, RefreshCw, Power, MessageSquare, Coffee } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ firm?: string }>
}

export default async function BotSettingsPage({ searchParams }: PageProps) {
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

  const { data: botSettings } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('firm_id', currentFirmId || firms[0].id)
    .single()

  const botToken = process.env.DISCORD_BOT_TOKEN
  const botId = process.env.DISCORD_BOT_ID

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Bot className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Discord Bot</h2>
            <p className="text-[#6B4423]">Advanced Discord integration</p>
          </div>
        </div>

        {/* Bot Status */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Bot className="w-5 h-5 text-[#6B4423]" />
              Bot Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${botToken ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="font-medium text-[#1A1A1A]">
                    {botToken ? 'Webhook.cafe Bot' : 'Bot Not Connected'}
                  </p>
                  <p className="text-sm text-[#8B7355]">
                    {botToken ? 'Online and ready' : 'Add your bot token to enable'}
                  </p>
                </div>
              </div>
              <Badge className={botToken ? 'bg-green-500' : 'bg-red-500'}>
                {botToken ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bot Features */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A]">Features</CardTitle>
            <CardDescription className="text-[#8B7355]">
              What you can do with the Discord bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Auto-Post Updates', desc: 'Automatically post updates to Discord', enabled: botSettings?.auto_post || false },
                { name: 'Slash Commands', desc: 'Use /webhook commands', enabled: false },
                { name: 'Role Management', desc: 'Assign roles automatically', enabled: botSettings?.role_management || false },
                { name: 'Analytics', desc: 'Track bot usage', enabled: false },
              ].map((feature) => (
                <Card key={feature.name} className="border-[#6B4423]/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#1A1A1A]">{feature.name}</h4>
                      <Power className={`w-4 h-4 ${feature.enabled ? 'text-green-500' : 'text-[#8B7355]'}`} />
                    </div>
                    <p className="text-sm text-[#8B7355]">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bot Configuration */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="text-[#1A1A1A]">Configuration</CardTitle>
            <CardDescription className="text-[#8B7355]">
              Set up your Discord bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[#6B4423]">Bot Token</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your bot token"
                  defaultValue={botToken || ''}
                  className="font-mono bg-[#F5F0E8]/50 border-[#6B4423]/20"
                />
                <Button variant="outline" size="icon" className="border-[#6B4423] text-[#6B4423]">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-[#8B7355]">
                Get this from Discord Developer Portal → Your Bot → Token
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6B4423]">Bot Invite URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`https://discord.com/oauth2/authorize?client_id=${botId || 'YOUR_BOT_ID'}&permissions=268435456&scope=bot`}
                  className="font-mono text-sm bg-[#F5F0E8]/50 border-[#6B4423]/20"
                />
                <Button variant="outline" size="icon" className="border-[#6B4423] text-[#6B4423]">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commands */}
        <Card className="cafe-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <MessageSquare className="w-5 h-5 text-[#6B4423]" />
              Available Commands
            </CardTitle>
            <CardDescription className="text-[#8B7355]">
              Slash commands available when the bot is in your server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { cmd: '/webhook send', desc: 'Send a webhook message' },
                { cmd: '/webhook preview', desc: 'Preview an embed' },
                { cmd: '/partners list', desc: 'List all partners' },
                { cmd: '/status', desc: 'Check bot status' },
              ].map((command) => (
                <div 
                  key={command.cmd} 
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F5F0E8]/30"
                >
                  <code className="text-sm font-mono text-[#6B4423]">{command.cmd}</code>
                  <span className="text-sm text-[#8B7355]">{command.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
