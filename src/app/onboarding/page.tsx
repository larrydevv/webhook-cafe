'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Check, ArrowRight, ArrowLeft } from 'lucide-react'

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'create-firm', title: 'Create Your Firm' },
  { id: 'add-webhook', title: 'Add Webhook' },
  { id: 'invite-team', title: 'Invite Team' },
  { id: 'complete', title: 'Complete' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [firmData, setFirmData] = useState({ name: '', slug: '' })
  const [webhookUrl, setWebhookUrl] = useState('')

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const createFirm = async () => {
    if (!firmData.name.trim()) return
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const slug = firmData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const { data: firm, error } = await supabase
      .from('firms')
      .insert({
        name: firmData.name,
        slug,
        owner_id: user.id
      })
      .select()
      .single()

    if (!error && firm) {
      await supabase.from('user_firms').insert({
        user_id: user.id,
        firm_id: firm.id,
        role: 'owner'
      })
      handleNext()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm
                ${i < currentStep ? 'bg-primary text-primary-foreground' : 
                  i === currentStep ? 'bg-primary text-primary-foreground' : 
                  'bg-muted text-muted-foreground'}
              `}>
                {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-1 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="text-center">
            <Badge variant="secondary" className="w-fit mx-auto mb-2">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <CardTitle className="text-2xl">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Welcome Step */}
            {currentStep === 0 && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Welcome to Webhook.cafe! Let's set up your firm so you can start sending beautiful Discord embeds.
                </p>
                <Button onClick={handleNext} className="w-full gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Create Firm Step */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firm-name">Firm Name</Label>
                  <Input
                    id="firm-name"
                    placeholder="My PR Agency"
                    value={firmData.name}
                    onChange={(e) => setFirmData({ 
                      ...firmData, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your public profile: webhook.cafe/p/{firmData.slug || 'your-firm'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={createFirm} disabled={!firmData.name.trim() || loading} className="flex-1">
                    {loading ? 'Creating...' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}

            {/* Add Webhook Step */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook">Discord Webhook URL</Label>
                  <Input
                    id="webhook"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Server Settings → Integrations → Webhooks
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Skip
                  </Button>
                  <Button onClick={handleNext} className="flex-1 gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Invite Team Step */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Invite your team members to collaborate on campaigns.
                </p>
                <Input placeholder="Enter email addresses (comma separated)" />
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Skip
                  </Button>
                  <Button onClick={handleNext} className="flex-1 gap-2">
                    Invite & Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Complete Step */}
            {currentStep === 4 && (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-green-500/10 mx-auto flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">You're All Set!</h3>
                <p className="text-muted-foreground">
                  Your firm is ready. Start creating amazing Discord embeds!
                </p>
                <Button onClick={() => router.push('/dashboard')} className="w-full gap-2">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
