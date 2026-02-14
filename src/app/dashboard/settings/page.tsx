import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Mail, MessageSquare, Globe, Clock, Save, Coffee } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-background texture-paper p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
            <Coffee className="w-6 h-6 text-[#F5F0E8]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Settings</h2>
            <p className="text-[#6B4423]">Configure your preferences</p>
          </div>
        </div>

        {/* Notifications */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Bell className="w-5 h-5 text-[#6B4423]" />
              Notifications
            </CardTitle>
            <CardDescription className="text-[#8B7355]">
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6B4423]" />
                <div>
                  <p className="font-medium text-[#1A1A1A]">Email Notifications</p>
                  <p className="text-sm text-[#8B7355]">
                    Receive updates via email
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#6B4423]" />
                <div>
                  <p className="font-medium text-[#1A1A1A]">Discord Notifications</p>
                  <p className="text-sm text-[#8B7355]">
                    Get notified in Discord
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card className="cafe-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1A1A1A]">
              <Globe className="w-5 h-5 text-[#6B4423]" />
              Display
            </CardTitle>
            <CardDescription className="text-[#8B7355]">
              Customize your display preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#6B4423]">Timezone</Label>
                <select className="w-full p-2 rounded-lg border bg-[#F5F0E8]/50 border-[#6B4423]/20">
                  <option>UTC</option>
                  <option>Europe/Berlin</option>
                  <option>America/New_York</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#6B4423]">Date Format</Label>
                <select className="w-full p-2 rounded-lg border bg-[#F5F0E8]/50 border-[#6B4423]/20">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2 btn-cafe">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
