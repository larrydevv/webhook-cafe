import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FirmSwitcher } from '@/components/dashboard/FirmSwitcher'
import { Plus, Search, MoreHorizontal, Users, Coffee, UserPlus, Trash2 } from 'lucide-react'
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

export default async function PartnersPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  const resolvedSearchParams = await searchParams
  const currentFirmId = resolvedSearchParams.firm

  const { data: firms } = await supabase
    .from('firms')
    .select('id, name, slug, logo_url')
    .eq('owner_id', user.id)
    .order('created_at', ascending: false })

  if (!firms || firms.length === 0) {
    redirect('/dashboard')
  }

  const activeFirmId = currentFirmId || firms[0].id

  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .eq('firm_id', activeFirmId)
    .order('created_at', ascending: false })

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Coffee className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Partners</h2>
            <p className="text-[#6B4423]">Manage your partner network</p>
          </div>
        </div>
        <Link href={`/dashboard/partners/new?firm=${activeFirmId}`}>
          <Button className="gap-2 btn-cafe">
            <UserPlus className="w-4 h-4" />
            Add Partner
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]" />
        <input
          type="text"
          placeholder="Search partners..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border bg-[#F5F0E8]/50 border-[#6B4423]/20 focus:border-[#6B4423] focus:ring-2 focus:ring-[#6B4423]/20"
        />
      </div>

      {/* Partners Grid */}
      {partners && partners.length > 0 ? (
        <div className="grid gap-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="cafe-card hover:border-[#6B4423]/50 transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6B4423]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#6B4423]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{partner.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      {partner.discount_code && (
                        <Badge className="bg-[#6B4423] text-[#F5F0E8]">{partner.discount_code}</Badge>
                      )}
                      {partner.discount_percentage > 0 && (
                        <span className="text-[#6B4423]">{partner.discount_percentage}% off</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={partner.status === 'active' ? 'default' : 'secondary'}
                    className={partner.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {partner.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#6B4423]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/partners/${partner.id}?firm=${activeFirmId}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto cafe-card">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[#6B4423]" />
            </div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">No Partners Yet</h3>
            <p className="text-[#6B4423] mb-4">Start by adding your first partner</p>
            <Link href={`/dashboard/partners/new?firm=${activeFirmId}`}>
              <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423] hover:bg-[#6B4423] hover:text-white">
                <Plus className="w-4 h-4" />
                Add Partner
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
