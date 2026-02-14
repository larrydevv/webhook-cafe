import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Coffee, MessageSquare, Users, Zap, Shield, Globe, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen texture-latte">
      {/* Header */}
      <header className="border-b bg-[#F5F0E8]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#6B4423] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#F5F0E8]" />
            </div>
            <span className="font-bold text-xl text-[#1A1A1A]">Webhook.café</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/help">
              <Button variant="ghost" className="text-[#6B4423]">Help</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-[#6B4423] hover:bg-[#5A3A1D] text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B4423]/10 text-[#6B4423] mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Craft Beautiful Discord Embeds</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            Discord Marketing,
            <br />
            <span className="text-[#6B4423]">Served Fresh</span>
          </h1>
          
          <p className="text-xl text-[#6B4423] mb-8 max-w-2xl mx-auto">
            Create stunning Discord embeds, manage your PR partners, and send 
            beautiful messages with our café-inspired tool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-[#6B4423] hover:bg-[#5A3A1D] text-white px-8 gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-[#6B4423] text-[#6B4423] px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-[#1A1A1A] mb-12">
          Everything You Need
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: 'Embed Builder',
              description: 'Create beautiful Discord embeds with our intuitive builder',
              color: 'bg-[#5865F2]/10 text-[#5865F2]'
            },
            {
              icon: Users,
              title: 'Partner Management',
              description: 'Track and manage your PR partners and discount codes',
              color: 'bg-[#6B4423]/10 text-[#6B4423]'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Send embeds instantly with our optimized delivery system',
              color: 'bg-yellow-500/10 text-yellow-500'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your data is protected with enterprise-grade security',
              color: 'bg-green-500/10 text-green-500'
            }
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="cafe-card hover:border-[#6B4423]/50 transition-all">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{feature.title}</h3>
                  <p className="text-[#6B4423]">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1A1A1A] mb-12">
            Beautiful Embeds Made Easy
          </h2>
          
          <div className="bg-[#313338] rounded-xl p-6 shadow-2xl">
            <div className="space-y-4">
              <p className="text-[#dbdee1]">Check out our latest partnership!</p>
              
              <div className="border-l-4 border-[#6B4423] bg-[#2b2d31] rounded-r-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#6B4423] flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-[#F5F0E8]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Webhook.café</p>
                    <p className="text-xs text-[#949ba4]">Today at 3:42 PM</p>
                  </div>
                </div>
                <p className="text-white font-semibold text-lg mb-2">🚀 New Partnership Announcement!</p>
                <p className="text-[#dbdee1]">
                  We're excited to announce our partnership with TechCorp. 
                  Use code <span className="text-[#00b0f4]">TECH25</span> for 25% off!
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="px-2 py-1 bg-[#5865F2]/20 text-[#00b0f4] text-xs rounded">
                    #announcements
                  </span>
                  <span className="px-2 py-1 bg-[#5865F2]/20 text-[#00b0f4] text-xs rounded">
                    #partners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-3xl mx-auto cafe-card bg-[#6B4423] border-none">
          <CardContent className="pt-8 pb-8 text-center">
            <Coffee className="w-12 h-12 text-[#F5F0E8] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#F5F0E8] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#D4C4B0] mb-6 max-w-md mx-auto">
              Join thousands of PR professionals who trust Webhook.café 
              for their Discord marketing needs.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-[#F5F0E8] text-[#6B4423] hover:bg-white px-8 gap-2">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[#F5F0E8]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#6B4423]" />
              <span className="font-semibold text-[#1A1A1A]">Webhook.café</span>
            </div>
            <p className="text-sm text-[#6B4423]">
              Made with ☕ and ❤️
            </p>
            <div className="flex items-center gap-4">
              <Link href="/help" className="text-sm text-[#6B4423] hover:text-[#1A1A1A]">
                Help
              </Link>
              <Link href="#" className="text-sm text-[#6B4423] hover:text-[#1A1A1A]">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-[#6B4423] hover:text-[#1A1A1A]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
