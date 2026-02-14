'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  accept?: string
}

export function ImageUploader({ value, onChange, onRemove, accept = 'image/*' }: ImageUploaderProps) {
  const supabase = createClient()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      setIsUploading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    onChange(publicUrl)
    setIsUploading(false)
    setUploadProgress(100)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
      setShowUrlInput(false)
    }
  }

  if (value) {
    return (
      <Card className="relative">
        <CardContent className="p-2">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={value}
              alt="Uploaded image"
              className="object-cover w-full h-full"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-8 h-8"
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or use URL
          </span>
        </div>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.png"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Button onClick={handleUrlSubmit}>Add</Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowUrlInput(true)}
        >
          <LinkIcon className="w-4 h-4" />
          Use Image URL
        </Button>
      )}
    </div>
  )
}
