'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee, Users, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function JoinPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [invite, setInvite] = useState<any>(null)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    const checkInvite = async () => {
      if (!token) return

      const { data, error } = await supabase
        .from('invites')
        .select('*, firms(*)')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (data) {
        setInvite(data)
      } else {
        setError('Invalid or expired invite')
      }
      setLoading(false)
    }

    checkInvite()
  }, [token])

  const handleJoin = async () => {
    if (!invite || !token) return

    setJoining(true)
    setError('')

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Store the invite token and redirect to auth
        localStorage.setItem('pending_invite', token)
        router.push('/auth')
        return
      }

      // Accept invite
      const { error: acceptError } = await supabase
        .from('user_firms')
        .insert({
          user_id: user.id,
          firm_id: invite.firm_id,
          role: 'member'
        })

      if (acceptError) {
        setError(acceptError.message)
      } else {
        // Update invite status
        await supabase
          .from('invites')
          .update({ status: 'accepted' })
          .eq('id', invite.id)

        setJoined(true)
      }
    } catch (err: any) {
      setError(err.message)
    }

    setJoining(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen texture-latte flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B4423]" />
          <span className="text-[#6B4423]">Loading invite...</span>
        </div>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen texture-latte flex items-center justify-center p-4">
        <Card className="max-w-md cafe-card">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 mx-auto flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Invalid Invite</h2>
            <p className="text-[#6B4423] mb-6">{error}</p>
            <Link href="/auth">
              <Button className="btn-cafe">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (joined) {
    return (
      <div className="min-h-screen texture-latte flex items-center justify-center p-4">
        <Card className="max-w-md cafe-card">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Welcome Aboard!</h2>
            <p className="text-[#6B4423] mb-6">
              You've joined {invite?.firms?.name}. Redirecting to dashboard...
            </p>
            <Button 
              className="btn-cafe"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen texture-latte flex items-center justify-center p-4">
      <Card className="max-w-md cafe-card">
        <CardContent className="pt-8 pb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#6B4423]" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">You're Invited!</h2>
            <p className="text-[#6B4423]">
              You've been invited to join <span className="font-semibold text-[#6B4423]">{invite?.firms?.name}</span>
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm mb-4">
              {error}
            </div>
          )}

          <Button
            className="w-full gap-2 btn-cafe"
            onClick={handleJoin}
            disabled={joining}
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                Join Team
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#8B7355] mt-4">
            By joining, you agree to the terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
