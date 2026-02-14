'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Send, Loader2, CheckCircle, AlertCircle, Hash } from 'lucide-react'

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
  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSend = async () => {
    if (!selectedWebhook) return

    const webhook = webhooks.find(w => w.id === selectedWebhook)
    if (!webhook) return

    setSending(true)
    setResult(null)
    setErrorMessage('')

    try {
      const response = await fetch(webhook.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Log to sent_messages
      await supabase.from('sent_messages').insert({
        firm_id: (await supabase.auth.getUser()).data.user?.id, // This should be actual firm_id
        webhook_id: webhook.id,
        content: messageData,
        status: 'sent'
      })

      setResult('success')
      setTimeout(() => {
        setOpen(false)
        setResult(null)
        onSent()
      }, 2000)
    } catch (error: any) {
      setResult('error')
      setErrorMessage(error.message)
      
      // Log failed attempt
      await supabase.from('sent_messages').insert({
        firm_id: (await supabase.auth.getUser()).data.user?.id,
        webhook_id: webhook.id,
        content: messageData,
        status: 'failed',
        error_message: error.message
      })
    }

    setSending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Send className="w-4 h-4" />
          Send Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Embed</DialogTitle>
          <DialogDescription>
            Choose a webhook to send this embed to Discord
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Webhook Selector */}
          <div className="space-y-2">
            <Label>Select Webhook</Label>
            <div className="grid gap-2">
              {webhooks.length > 0 ? (
                webhooks.map((webhook) => (
                  <Card
                    key={webhook.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedWebhook === webhook.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedWebhook(webhook.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                        <Hash className="w-5 h-5 text-[#5865F2]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{webhook.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {webhook.webhook_url.substring(0, 50)}...
                        </p>
                      </div>
                      {selectedWebhook === webhook.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No webhooks configured. Add one first.
                </p>
              )}
            </div>
          </div>

          {/* Preview Summary */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Message Summary</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{messageData.content ? '1 content message' : 'No content'}</p>
              <p>{messageData.embeds.length} embed(s)</p>
            </div>
          </div>

          {/* Result */}
          {result && (
            <Card className={result === 'success' ? 'border-green-500' : 'border-red-500'}>
              <CardContent className="p-3 flex items-center gap-3">
                {result === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-500">Message sent successfully!</p>
                      <p className="text-sm text-muted-foreground">
                        Your embed has been sent to Discord
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-500">Failed to send message</p>
                      <p className="text-sm text-muted-foreground">{errorMessage}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedWebhook || sending || result === 'success'}
            className="gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
