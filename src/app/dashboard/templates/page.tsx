import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Search, MoreHorizontal, Copy, Trash2, Star, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PageProps {
  searchParams: Promise<{ firm?: string }>
}

export default async function TemplatesPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const resolvedSearchParams = await searchParams
  const currentFirmId = resolvedSearchParams.firm

  // Get user's firms
  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

  // Get templates for active firm
  const { data: templates } = await supabase
    .from('embed_templates')
    .select('*')
    .eq('firm_id', activeFirmId)
    .order('created_at', ascending: false })

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Embed Templates</h2>
          <p className="text-muted-foreground">
            Save and reuse your embed designs
          </p>
        </div>
        <Link href={`/dashboard/templates/new?firm=${activeFirmId}`}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
        />
      </div>

      {/* Templates Grid */}
      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {template.is_default && (
                      <Star className="w-4 h-4 text-yellow-500" />
                    )}
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/templates/${template.id}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  Created {new Date(template.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Preview */}
                <div className="bg-[#313338] rounded-lg p-3 mb-4">
                  {template.content?.title && (
                    <p className="text-white font-semibold text-sm mb-1">
                      {template.content.title}
                    </p>
                  )}
                  {template.content?.description && (
                    <p className="text-[#dbdee1] text-xs line-clamp-2">
                      {template.content.description}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/dashboard/embed?template=${template.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Copy className="w-3 h-3" />
                      Use
                    </Button>
                  </Link>
                  {template.is_default ? (
                    <Button variant="ghost" size="sm" disabled>
                      <Star className="w-3 h-3 text-yellow-500" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm">
                      <Star className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Templates Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save your embed designs as templates for quick reuse
            </p>
            <Link href={`/dashboard/templates/new?firm=${activeFirmId}`}>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
