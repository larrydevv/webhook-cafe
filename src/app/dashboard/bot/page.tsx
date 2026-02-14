import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Bot, Settings, ExternalLink, Copy, Check, RefreshCw, Power, MessageSquare } from 'lucide-react'

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

  // Get bot settings
  const { data: botSettings } = await supabase
    .from('bot_settings')
    .select('*')
    .eq('firm_id', activeFirmId)
    .single()

  const botToken = process.env.DISCORD_BOT_TOKEN
  const botId = process.env.DISCORD_BOT_ID

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Discord Bot</h2>
          <p className="text-muted-foreground">
            Connect a Discord bot for advanced features
          </p>
        </div>

        {/* Bot Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Bot Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${botToken ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="font-medium">
                    {botToken ? 'Webhook.cafe Bot' : 'Bot Not Connected'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {botToken ? 'Online and ready' : 'Add your bot token to enable'}
                  </p>
                </div>
              </div>
              <Badge variant={botToken ? 'default' : 'secondary'}>
                {botToken ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bot Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>
              What you can do with the Discord bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Auto-Post Updates', desc: 'Automatically post partner updates to Discord', enabled: botSettings?.auto_post || false },
                { name: 'Slash Commands', desc: 'Use /webhook commands in your server', enabled: false },
                { name: 'Role Management', desc: 'Assign roles based on partner status', enabled: botSettings?.role_management || false },
                { name: 'Analytics', desc: 'Track bot usage and engagement', enabled: false },
              ].map((feature) => (
                <Card key={feature.name} className="border-muted">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      <Power className={`w-4 h-4 ${feature.enabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bot Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Set up your Discord bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bot Token</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your bot token"
                  defaultValue={botToken || ''}
                  className="font-mono"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get this from Discord Developer Portal → Your Bot → Token
              </p>
            </div>

            <div className="space-y-2">
              <Label>Bot Invite URL</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`https://discord.com/oauth2/authorize?client_id=${botId || 'YOUR_BOT_ID'}&permissions=268435456&scope=bot`}
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" asChild>
                  <a href={`https://discord.com/oauth2/authorize?client_id=${botId || 'YOUR_BOT_ID'}&permissions=268435456&scope=bot`} target="_blank">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Available Commands
            </CardTitle>
            <CardDescription>
              Slash commands available when the bot is in your server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { cmd: '/webhook send', desc: 'Send a webhook message' },
                { cmd: '/webhook preview', desc: 'Preview an embed without sending' },
                { cmd: '/webhook template', desc: 'Load a saved template' },
                { cmd: '/partners list', desc: 'List all partners' },
                { cmd: '/partners add', desc: 'Add a new partner' },
                { cmd: '/status', desc: 'Check bot status' },
              ].map((command) => (
                <div key={command.cmd} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <code className="text-sm font-mono">{command.cmd}</code>
                  <span className="text-sm text-muted-foreground">{command.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
