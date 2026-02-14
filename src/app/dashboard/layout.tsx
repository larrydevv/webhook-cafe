import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <main className="md:pl-[250px] transition-all duration-300">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
