'use client'

import { useState } from 'react'
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
import { Hash, Volume2, Lock, Globe, Plus, Check } from 'lucide-react'

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice' | 'category'
  isPrivate: boolean
}

interface ChannelPickerProps {
  channels: Channel[]
  selectedChannel?: string
  onSelect: (channelId: string, channelName: string) => void
  trigger?: React.ReactNode
}

export function ChannelPicker({
  channels,
  selectedChannel,
  onSelect,
  trigger
}: ChannelPickerProps) {
  const [open, setOpen] = useState(false)
  const [newChannelId, setNewChannelId] = useState('')

  const handleSelect = (channel: Channel) => {
    onSelect(channel.id, channel.name)
    setOpen(false)
  }

  const handleManualAdd = () => {
    if (newChannelId.trim()) {
      onSelect(newChannelId, `#${newChannelId}`)
      setNewChannelId('')
    }
  }

  const selectedChannelData = channels.find(c => c.id === selectedChannel)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="justify-start gap-2">
            {selectedChannelData ? (
              <>
                {selectedChannelData.type === 'voice' ? (
                  <Volume2 className="w-4 h-4 text-green-500" />
                ) : selectedChannelData.isPrivate ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Hash className="w-4 h-4 text-[#5865F2]" />
                )}
                <span>#{selectedChannelData.name}</span>
              </>
            ) : (
              <>
                <Hash className="w-4 h-4" />
                <span>Select Channel</span>
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Discord Channel</DialogTitle>
          <DialogDescription>
            Choose a channel to send your webhook message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Manual Channel ID Input */}
          <div className="space-y-2">
            <Label>Add Channel by ID</Label>
            <div className="flex gap-2">
              <Input
                placeholder="123456789012345678"
                value={newChannelId}
                onChange={(e) => setNewChannelId(e.target.value)}
              />
              <Button size="sm" onClick={handleManualAdd} disabled={!newChannelId.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Channel List */}
          <div className="space-y-2">
            <Label>Available Channels</Label>
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {channels.length > 0 ? (
                channels.map((channel) => {
                  const ChannelIcon = channel.type === 'voice' ? Volume2 : channel.isPrivate ? Lock : Hash
                  const iconColor = channel.type === 'voice' ? 'text-green-500' : channel.isPrivate ? 'text-muted-foreground' : 'text-[#5865F2]'
                  
                  return (
                    <button
                      key={channel.id}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        selectedChannel === channel.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleSelect(channel)}
                    >
                      <ChannelIcon className={`w-5 h-5 ${iconColor}`} />
                      <span className="flex-1 text-left">{channel.name}</span>
                      {channel.isPrivate && (
                        <Lock className="w-3 h-3" />
                      )}
                      {selectedChannel === channel.id && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No channels found. Add a webhook first to sync channels.
                </p>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tip: You can also manually enter a channel ID. Find it by enabling Developer Mode in Discord settings.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Mock channels for demo
export const mockChannels: Channel[] = [
  { id: '1', name: 'announcements', type: 'text', isPrivate: false },
  { id: '2', name: 'general', type: 'text', isPrivate: false },
  { id: '3', name: 'partners', type: 'text', isPrivate: false },
  { id: '4', name: 'support', type: 'text', isPrivate: false },
  { id: '5', name: 'Voice Lounge', type: 'voice', isPrivate: false },
  { id: '6', name: 'VIP', type: 'text', isPrivate: true },
]
