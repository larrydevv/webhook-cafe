'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Discord } from 'lucide-react'
import { Coffee, Sparkles } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'identify guilds',
      },
    })
    
    if (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center texture-latte p-4">
      {/* Coffee Steam Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-8 bg-[#6B4423]/20 rounded-full animate-steam"
            style={{
              left: `${15 + i * 20}%`,
              bottom: '20%',
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md relative bg-[#F5F0E8] border-[#6B4423]/20 shadow-2xl shadow-[#6B4423]/10">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-[#6B4423] mx-auto flex items-center justify-center mb-4 shadow-lg shadow-[#6B4423]/30">
            <Coffee className="w-10 h-10 text-[#F5F0E8]" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-[#1A1A1A] flex items-center justify-center gap-2">
            Webhook<span className="text-[#6B4423]">.café</span>
          </CardTitle>
          <CardDescription className="text-[#6B4423]">
            Discord Marketing, Served Fresh
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { icon: '☕', label: 'Craft Embeds' },
              { icon: '🎯', label: 'Target Partners' },
              { icon: '🚀', label: 'Send Fast' }
            ].map((feature) => (
              <div 
                key={feature.label}
                className="p-3 rounded-lg bg-[#1A1A1A]/5 hover:bg-[#6B4423]/10 transition-colors"
              >
                <span className="text-2xl">{feature.icon}</span>
                <p className="text-xs text-[#6B4423] mt-1">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Discord Login */}
          <Button 
            onClick={handleLogin} 
            className="w-full gap-3 py-6 text-lg font-medium bg-[#5865F2] hover:bg-[#4752C4] transition-all shadow-lg shadow-[#5865F2]/30"
            disabled={loading}
          >
            <Discord className="w-6 h-6" />
            {loading ? (
              <>
                <span className="animate-spin">☕</span>
                Brewing...
              </>
            ) : (
              <>
                Continue with Discord
                <Sparkles className="w-5 h-5" />
              </>
            )}
          </Button>
          
          {/* Terms */}
          <p className="text-xs text-center text-[#8B7355]">
            By signing in, you agree to our{' '}
            <a href="#" className="text-[#6B4423] hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#6B4423] hover:underline">Privacy Policy</a>
          </p>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-[#6B4423]/10">
            <p className="text-sm text-[#8B7355]">
              Powered by ☕ and ❤️
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
