'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Send, Loader2, CheckCircle, AlertCircle, Coffee, Droplets } from 'lucide-react'

interface Webhook {
  id: string
  name: string
  webhook_url: string
  channel_id?: string
}

interface SendMessageModalProps {
  messageData: {
    content: string
    embeds: any[]
  }
  webhooks: Webhook[]
  onSent: () => void
}

export function SendMessageModal({ messageData, webhooks, onSent }: SendMessageModalProps) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<string>('')
  const [sending, setSending] = useState(false)
  const [fillLevel, setFillLevel] = useState(0)
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [pouring, setPouring] = useState(false)

  useEffect(() => {
    if (sending && fillLevel < 100) {
      const interval = setInterval(() => {
        setFillLevel((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 150)
      return () => clearInterval(interval)
    }
  }, [sending, fillLevel])

  const handleSend = async () => {
    if (!selectedWebhook) return

    const webhook = webhooks.find(w => w.id === selectedWebhook)
    if (!webhook) return

    setSending(true)
    setPouring(true)
    setFillLevel(0)
    setResult(null)
    setErrorMessage('')

    try {
      const response = await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      await supabase.from('sent_messages').insert({
        firm_id: (await supabase.auth.getUser()).data.user?.id,
        webhook_id: webhook.id,
        content: messageData,
        status: 'sent'
      })

      setResult('success')
      setTimeout(() => {
        setOpen(false)
        setResult(null)
        setFillLevel(0)
        setPouring(false)
        onSent()
      }, 2500)
    } catch (error: any) {
      setResult('error')
      setErrorMessage(error.message)
      await supabase.from('sent_messages').insert({
        firm_id: (await supabase.auth.getUser()).data.user?.id,
        webhook_id: webhook.id,
        content: messageData,
        status: 'failed',
        error_message: error.message
      })
    }

    setSending(false)
    setPouring(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#6B4423] hover:bg-[#5A3A1D] text-white">
          <Send className="w-4 h-4" />
          Serve to Discord
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#F5F0E8] border-[#6B4423]">
        
        {/* Coffee Pouring Animation */}
        <div className="relative">
          {/* Coffee Machine Top */}
          <div className="bg-[#1A1A1A] rounded-t-xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                <Coffee className="w-6 h-6 text-[#6B4423]" />
              </div>
              <div>
                <h3 className="text-[#F5F0E8] font-bold">Webhook.café</h3>
                <p className="text-xs text-[#8B7355]">Premium Discord Service</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${sending ? 'bg-green-400 animate-pulse' : 'bg-[#6B4423]'}`} />
              <span className="text-xs text-[#8B7355]">{sending ? 'Brewing...' : 'Ready'}</span>
            </div>
          </div>

          {/* Coffee Stream */}
          <div className="relative bg-[#1A1A1A] mx-6">
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-0.5 h-3 bg-[#6B4423]">
              {pouring && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#6B4423] to-transparent animate-pulse" />
              )}
            </div>
            
            {/* Cup/Mug */}
            <div className="mx-auto w-32 h-20 bg-[#F5F0E8] rounded-b-xl relative overflow-hidden border-4 border-[#1A1A1A]">
              {/* Coffee Fill Animation */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#6B4423] via-[#8B6914] to-[#A67C52] transition-all duration-300"
                style={{ height: `${fillLevel}%` }}
              >
                {/* Foam */}
                <div className="absolute -top-2 left-0 right-0 h-4 bg-[#F5F0E8] rounded-full opacity-90">
                  <div className="absolute inset-0 flex items-center justify-center gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#F5F0E8]" />
                    ))}
                  </div>
                </div>
                
                {/* Steam */}
                {sending && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-4 bg-[#8B7355] rounded-full opacity-40 animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spout */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-4 h-3 bg-[#1A1A1A]" />
        </div>

        <DialogHeader className="text-center">
          <DialogTitle className="text-[#1A1A1A] text-xl font-serif">
            {sending ? 'Brewing Your Message...' : result === 'success' ? 'Bon Appétit! 🍰' : 'Select Your Server'}
          </DialogTitle>
          <DialogDescription className="text-[#6B4423]">
            {sending ? 'Pouring your embed into Discord...' : 'Choose a webhook to serve your message'}
          </DialogDescription>
        </DialogHeader>

        {/* Webhook List - Filling Up */}
        <div className="py-4">
          <Label className="text-[#1A1A1A] font-medium mb-2 block">Available Webhooks</Label>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {webhooks.length > 0 ? (
              webhooks.map((webhook) => {
                const isSelected = selectedWebhook === webhook.id
                const isFilled = fillLevel >= 100
                
                return (
                  <Card
                    key={webhook.id}
                    className={`
                      cursor-pointer transition-all duration-300 border-2
                      ${isSelected 
                        ? 'border-[#6B4423] bg-[#6B4423]/10' 
                        : 'border-[#D4C4B0] hover:border-[#6B4423]'
                      }
                      ${isFilled && isSelected ? 'bg-green-50 border-green-500' : ''}
                    `}
                    onClick={() => !sending && setSelectedWebhook(webhook.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      {/* Cup Icon */}
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-[#6B4423]' : 'bg-[#D4C4B0]'}
                      `}>
                        <Coffee className={`w-5 h-5 ${isSelected ? 'text-[#F5F0E8]' : 'text-[#1A1A1A]'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isSelected ? 'text-[#6B4423]' : 'text-[#1A1A1A]'}`}>
                          {webhook.name}
                        </p>
                        <p className="text-xs text-[#8B7355] truncate">
                          {webhook.webhook_url.substring(0, 35)}...
                        </p>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          {sending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#6B4423]" />
                          ) : result === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-[#6B4423]" />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="text-center py-8 text-[#8B7355]">
                <Coffee className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No webhooks served yet</p>
                <p className="text-xs">Add a webhook in your dashboard first</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Summary */}
        <div className="bg-[#1A1A1A] rounded-lg p-3 text-center">
          <p className="text-[#F5F0E8] text-sm">
            {messageData.embeds.length} embed{messageData.embeds.length !== 1 ? 's' : ''} ready to serve
          </p>
        </div>

        {/* Result */}
        {result && (
          <Card className={`
            ${result === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}
          `}>
            <CardContent className="p-3 flex items-center gap-3">
              {result === 'success' ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-700">Message served successfully!</p>
                    <p className="text-sm text-green-600">Your embed is now in Discord</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-medium text-red-700">Serving failed</p>
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={sending}
            className="border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white"
          >
            {result === 'success' ? 'Close' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedWebhook || sending || result === 'success'}
            className={`
              gap-2 transition-all duration-300
              ${result === 'success' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-[#6B4423] hover:bg-[#5A3A1D]'
              }
            `}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Brewing...
              </>
            ) : result === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Served!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Serve
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
