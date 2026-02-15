'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Send, Coffee, Save, Eye, Code2 } from 'lucide-react'
import { SendMessageModal } from '@/components/embed/SendMessageModal'
import { PlaceholderHelper } from '@/components/embed/PlaceholderHelper'

interface EmbedField {
  name: string
  value: string
  inline: boolean
}

interface Embed {
  title?: string
  description?: string
  color?: string
  author?: { name: string; url?: string; icon_url?: string }
  footer?: { text: string; icon_url?: string }
  thumbnail?: { url: string }
  image?: { url: string }
  fields: EmbedField[]
}

interface MessageData {
  content: string
  embeds: Embed[]
}

interface Webhook {
  id: string
  name: string
  webhook_url: string
}

export default function EmbedBuilderPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('content')
  const [viewMode, setViewMode] = useState<'builder' | 'preview' | 'json'>('builder')
  
  const [message, setMessage] = useState<MessageData>({
    content: '',
    embeds: [{
      title: '',
      description: '',
      color: '#6B4423',
      fields: []
    }]
  })

  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [selectedFirm, setSelectedFirm] = useState<string | null>(null)

  useEffect(() => {
    const fetchWebhooks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: firms } = await supabase
        .from('firms')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)

      if (firms && firms.length > 0) {
        setSelectedFirm(firms[0].id)
        const { data: wh } = await supabase
          .from('webhooks')
          .select('*')
          .eq('firm_id', firms[0].id)
        if (wh) setWebhooks(wh)
      }
    }
    fetchWebhooks()
  }, [])

  const addEmbed = () => {
    setMessage({
      ...message,
      embeds: [...message.embeds, {
        title: '',
        description: '',
        color: '#6B4423',
        fields: []
      }]
    })
  }

  const removeEmbed = (index: number) => {
    setMessage({
      ...message,
      embeds: message.embeds.filter((_, i) => i !== index)
    })
  }

  const updateEmbed = (index: number, field: string, value: any) => {
    const newEmbeds = [...message.embeds]
    newEmbeds[index] = { ...newEmbeds[index], [field]: value }
    setMessage({ ...message, embeds: newEmbeds })
  }

  const addField = (embedIndex: number) => {
    const newEmbeds = [...message.embeds]
    newEmbeds[embedIndex].fields = [
      ...newEmbeds[embedIndex].fields,
      { name: 'Field Name', value: 'Field Value', inline: true }
    ]
    setMessage({ ...message, embeds: newEmbeds })
  }

  const updateField = (embedIndex: number, fieldIndex: number, field: string, value: any) => {
    const newEmbeds = [...message.embeds]
    newEmbeds[embedIndex].fields[fieldIndex] = {
      ...newEmbeds[embedIndex].fields[fieldIndex],
      [field]: value
    }
    setMessage({ ...message, embeds: newEmbeds })
  }

  const removeField = (embedIndex: number, fieldIndex: number) => {
    const newEmbeds = [...message.embeds]
    newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields.filter((_, i) => i !== fieldIndex)
    setMessage({ ...message, embeds: newEmbeds })
  }

  const DiscordEmbedPreview = ({ embed }: { embed: Embed }) => {
    const colorInt = parseInt(embed.color?.replace('#', '') || '6B4423', 16)

    return (
      <div className="bg-[#313338] rounded-lg overflow-hidden" style={{ borderLeft: `4px solid #${colorInt.toString(16).padStart(6, '0')}` }}>
        {embed.author && (
          <div className="px-4 py-3 flex items-center gap-2 border-b border-[#41434a]">
            {embed.author.icon_url && (
              <img src={embed.author.icon_url} alt="" className="w-6 h-6 rounded-full" />
            )}
            <span className="text-sm font-medium text-[#00b0f4]">{embed.author.name}</span>
          </div>
        )}
        
        <div className="p-4">
          {embed.title && (
            <h4 className="text-lg font-semibold text-white mb-1">{embed.title}</h4>
          )}
          
          {embed.description && (
            <p className="text-[#dbdee1] text-sm mb-3 whitespace-pre-wrap">{embed.description}</p>
          )}
          
          {embed.fields.length > 0 && (
            <div className="space-y-2">
              {embed.fields.map((field, i) => (
                <div key={i} className={`flex ${field.inline ? 'inline-flex' : 'flex-col'} gap-1`}>
                  {field.name && (
                    <span className="text-xs font-semibold text-[#949ba4] max-w-[150px] break-words">{field.name}</span>
                  )}
                  {field.value && (
                    <span className="text-xs text-[#dbdee1] flex-1 break-words">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {embed.footer && (
            <div className="mt-3 pt-3 border-t border-[#41434a] flex items-center gap-2">
              {embed.footer.icon_url && (
                <img src={embed.footer.icon_url} alt="" className="w-4 h-4 rounded-full" />
              )}
              <span className="text-xs text-[#949ba4]">{embed.footer.text}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background texture-paper">
      {/* Header */}
      <header className="border-b bg-[#F5F0E8] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6B4423] flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-[#F5F0E8]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-[#1A1A1A]">Embed Barista</h1>
              <p className="text-xs text-[#6B4423]">Craft your embed</p>
            </div>
          </div>
          
          {/* Mobile View Toggle */}
          <div className="flex items-center gap-1 bg-[#F5F0E8]/50 rounded-lg p-1">
            <button
              onClick={() => { setViewMode('builder'); setActiveTab('content'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'builder' ? 'bg-[#6B4423] text-white' : 'text-[#6B4423] hover:bg-[#6B4423]/10'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span className="hidden xs:inline">Builder</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'preview' ? 'bg-[#6B4423] text-white' : 'text-[#6B4423] hover:bg-[#6B4423]/10'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden xs:inline">Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1 border-[#6B4423] text-[#6B4423] text-xs"
            >
              <Save className="w-3 h-3" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <SendMessageModal 
              messageData={message}
              webhooks={webhooks}
              onSent={() => {}}
            />
          </div>
        </div>
      </header>

      {/* Mobile Layout */}
      <div className="block md:flex">
        {/* Builder Panel */}
        {viewMode === 'builder' && (
          <div className="w-full md:w-1/2 border-r overflow-y-auto scrollbar-cafe p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full bg-[#F5F0E8] grid grid-cols-3">
                <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                <TabsTrigger value="embeds" className="text-xs">Embeds</TabsTrigger>
                <TabsTrigger value="json" className="text-xs">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                <Card className="cafe-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#1A1A1A] text-base">Message Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Your message here..."
                      value={message.content}
                      onChange={(e) => setMessage({ ...message, content: e.target.value })}
                      rows={3}
                      className="bg-[#F5F0E8]/50 text-sm"
                    />
                    <PlaceholderHelper onInsert={(p) => setMessage({ ...message, content: message.content + ' ' + p })} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="embeds" className="space-y-4 mt-4">
                {message.embeds.map((embed, embedIndex) => (
                  <Card key={embedIndex} className="cafe-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-[#6B4423] text-[#F5F0E8] text-xs flex items-center justify-center">
                            {embedIndex + 1}
                          </div>
                          <span className="text-sm font-medium text-[#1A1A1A]">Embed {embedIndex + 1}</span>
                        </div>
                        {message.embeds.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeEmbed(embedIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Title</Label>
                          <Input
                            placeholder="Title"
                            value={embed.title || ''}
                            onChange={(e) => updateEmbed(embedIndex, 'title', e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Color</Label>
                          <div className="flex gap-1">
                            <input
                              type="color"
                              value={embed.color || '#6B4423'}
                              onChange={(e) => updateEmbed(embedIndex, 'color', e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                            <Input
                              value={embed.color || '#6B4423'}
                              onChange={(e) => updateEmbed(embedIndex, 'color', e.target.value)}
                              className="flex-1 h-8 text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="Description..."
                          value={embed.description || ''}
                          onChange={(e) => updateEmbed(embedIndex, 'description', e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Author</Label>
                          <Input
                            placeholder="Author name"
                            value={embed.author?.name || ''}
                            onChange={(e) => updateEmbed(embedIndex, 'author', { ...embed.author, name: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Footer</Label>
                          <Input
                            placeholder="Footer text"
                            value={embed.footer?.text || ''}
                            onChange={(e) => updateEmbed(embedIndex, 'footer', { ...embed.footer, text: e.target.value })}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Fields</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs gap-1 border-[#6B4423] text-[#6B4423]"
                            onClick={() => addField(embedIndex)}
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        </div>
                        
                        {embed.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="flex gap-2 items-start p-2 bg-[#F5F0E8]/50 rounded-lg">
                            <div className="flex-1 space-y-1">
                              <Input
                                placeholder="Name"
                                value={field.name}
                                onChange={(e) => updateField(embedIndex, fieldIndex, 'name', e.target.value)}
                                className="h-7 text-xs"
                              />
                              <Textarea
                                placeholder="Value"
                                value={field.value}
                                onChange={(e) => updateField(embedIndex, fieldIndex, 'value', e.target.value)}
                                rows={1}
                                className="text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="flex items-center gap-1 text-xs">
                                <input
                                  type="checkbox"
                                  checked={field.inline}
                                  onChange={(e) => updateField(embedIndex, fieldIndex, 'inline', e.target.checked)}
                                  className="rounded"
                                />
                                Inline
                              </label>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500"
                                onClick={() => removeField(embedIndex, fieldIndex)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button onClick={addEmbed} className="w-full gap-2 btn-cafe text-sm">
                  <Plus className="w-4 h-4" />
                  Add Another Embed
                </Button>
              </TabsContent>

              <TabsContent value="json" className="mt-4">
                <Card className="cafe-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#1A1A1A] text-base">JSON Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={JSON.stringify(message, null, 2)}
                      readOnly
                      rows={15}
                      className="font-mono text-xs bg-[#1A1A1A] text-[#F5F0E8]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Preview Panel */}
        {viewMode === 'preview' && (
          <div className="w-full md:w-1/2 bg-[#2b2d31] p-4 overflow-y-auto scrollbar-cafe">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-[#F5F0E8] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#6B4423]" />
                Preview
              </h3>
              <Badge className="bg-[#6B4423] text-[#F5F0E8] text-xs">Discord</Badge>
            </div>
            
            {message.content && (
              <div className="mb-4 text-[#dbdee1] text-sm whitespace-pre-wrap bg-[#313338] p-3 rounded-lg">
                {message.content}
              </div>
            )}

            <div className="space-y-3">
              {message.embeds.map((embed, i) => (
                <DiscordEmbedPreview key={i} embed={embed} />
              ))}
            </div>
            
            {message.embeds.length === 0 && (
              <div className="text-center py-12 text-[#6B4423]">
                <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Add an embed to see preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
