'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Webhook,
  Building2,
  FolderOpen,
  User,
  Settings,
  Activity,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Activity', href: '/dashboard/activity', icon: Activity },
  { title: 'Team', href: '/dashboard/team', icon: UserPlus },
  { title: 'Partners', href: '/dashboard/partners', icon: Users },
  { title: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
  { title: 'Embed Builder', href: '/dashboard/embed', icon: Building2 },
  { title: 'Templates', href: '/dashboard/templates', icon: FolderOpen },
  { title: 'Profile', href: '/dashboard/profile', icon: User },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden text-[#6B4423]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300",
          collapsed ? "w-[80px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ 
          background: 'linear-gradient(180deg, #F5F0E8 0%, #EBE5DA 100%)',
          borderRight: '1px solid rgba(107, 68, 35, 0.1)'
        }}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-20 border-b transition-all duration-300",
          collapsed ? "justify-center px-4" : "px-6 gap-3"
        )}
        style={{ borderColor: 'rgba(107, 68, 35, 0.1)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center flex-shrink-0">
            <Coffee className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-[#1A1A1A]">Webhook.café</h1>
              <p className="text-xs text-[#6B4423]">Premium Service</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-cafe">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-[#6B4423] text-white shadow-lg shadow-[#6B4423]/20"
                    : "text-[#6B4423] hover:bg-[#6B4423]/10",
                  collapsed && "justify-center"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
                {!collapsed && <span className={cn("font-medium", isActive && "text-white")}>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(107, 68, 35, 0.1)' }}>
          {/* User Info */}
          {user && (
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-[#6B4423]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#6B4423] flex items-center justify-center">
                  <span className="text-[#F5F0E8] font-medium">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-[#6B4423] truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}

          {/* Sign Out */}
          <Button
            variant="ghost"
            className={cn(
              "w-full text-[#6B4423] hover:bg-[#6B4423]/10 hover:text-[#6B4423]",
              collapsed && "px-0"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>

        {/* Collapse Toggle (Desktop) */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-24 w-8 h-8 rounded-full bg-[#F5F0E8] border-2 border-[#6B4423]/20 shadow-md hidden md:flex text-[#6B4423]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
