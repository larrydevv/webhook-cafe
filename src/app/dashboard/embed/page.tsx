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
import { Plus, Trash2, ArrowRight, Send, Eye } from 'lucide-react'

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

export default function EmbedBuilderPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(false)
  
  const [message, setMessage] = useState<MessageData>({
    content: '',
    embeds: [{
      title: '',
      description: '',
      color: '#5865F2',
      fields: []
    }]
  })

  const [previewMode, setPreviewMode] = useState<'split' | 'full'>('split')

  const addEmbed = () => {
    setMessage({
      ...message,
      embeds: [...message.embeds, {
        title: '',
        description: '',
        color: '#5865F2',
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

  const DiscordEmbedPreview = ({ embed, index }: { embed: Embed; index: number }) => {
    const colorInt = parseInt(embed.color?.replace('#', '') || '5865F2', 16)

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Embed Builder</h1>
            <p className="text-xs text-muted-foreground">Create Discord webhook messages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button size="sm" className="gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Builder Panel */}
        <div className="w-1/2 border-r overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="embeds">Embeds</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Message Content</CardTitle>
                  <CardDescription>
                    The text above the embed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Message content..."
                    value={message.content}
                    onChange={(e) => setMessage({ ...message, content: e.target.value })}
                    rows={4}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="embeds" className="space-y-4">
              {message.embeds.map((embed, embedIndex) => (
                <Card key={embedIndex} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Embed {embedIndex + 1}</CardTitle>
                      {message.embeds.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeEmbed(embedIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Embed Title"
                          value={embed.title || ''}
                          onChange={(e) => updateEmbed(embedIndex, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={embed.color || '#5865F2'}
                            onChange={(e) => updateEmbed(embedIndex, 'color', e.target.value)}
                            className="w-10 h-10 rounded border cursor-pointer"
                          />
                          <Input
                            value={embed.color || '#5865F2'}
                            onChange={(e) => updateEmbed(embedIndex, 'color', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Embed description..."
                        value={embed.description || ''}
                        onChange={(e) => updateEmbed(embedIndex, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Author & Footer */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Author Name</Label>
                        <Input
                          placeholder="Author"
                          value={embed.author?.name || ''}
                          onChange={(e) => updateEmbed(embedIndex, 'author', { ...embed.author, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Footer Text</Label>
                        <Input
                          placeholder="Footer"
                          value={embed.footer?.text || ''}
                          onChange={(e) => updateEmbed(embedIndex, 'footer', { ...embed.footer, text: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Fields</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => addField(embedIndex)}
                        >
                          <Plus className="w-3 h-3" />
                          Add Field
                        </Button>
                      </div>
                      
                      {embed.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex gap-2 items-start p-3 bg-muted rounded-lg">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Name"
                              value={field.name}
                              onChange={(e) => updateField(embedIndex, fieldIndex, 'name', e.target.value)}
                            />
                            <Textarea
                              placeholder="Value"
                              value={field.value}
                              onChange={(e) => updateField(embedIndex, fieldIndex, 'value', e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-xs">
                              <input
                                type="checkbox"
                                checked={field.inline}
                                onChange={(e) => updateField(embedIndex, fieldIndex, 'inline', e.target.checked)}
                              />
                              Inline
                            </label>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
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

              <Button onClick={addEmbed} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Add Another Embed
              </Button>
            </TabsContent>

            <TabsContent value="json">
              <Card>
                <CardHeader>
                  <CardTitle>JSON Output</CardTitle>
                  <CardDescription>
                    Copy this JSON to use in your webhook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={JSON.stringify(message, null, 2)}
                    readOnly
                    rows={20}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 bg-[#2b2d31] p-4 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-white">Preview</h3>
            <Badge variant="secondary">Discord Style</Badge>
          </div>
          
          {/* Message Content Preview */}
          {message.content && (
            <div className="mb-4 text-[#dbdee1] text-sm whitespace-pre-wrap">
              {message.content}
            </div>
          )}

          {/* Embeds Preview */}
          <div className="space-y-2">
            {message.embeds.map((embed, i) => (
              <DiscordEmbedPreview key={i} embed={embed} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
