'use client'

import { Button } from '@/components/ui/button'
import { Discord } from 'lucide-react'

interface DiscordLoginButtonProps {
  redirectTo?: string
}

export function DiscordLoginButton({ redirectTo = '/dashboard' }: DiscordLoginButtonProps) {
  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
        scopes: 'identify guilds',
      },
    })
    
    if (error) {
      console.error('Discord login error:', error)
    }
  }

  return (
    <Button onClick={handleLogin} className="w-full gap-2">
      <Discord className="w-5 h-5" />
      Continue with Discord
    </Button>
  )
}
