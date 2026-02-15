import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Coffee, MessageSquare, Users, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen texture-latte">
      {/* Header */}
      <header className="border-b bg-[#F5F0E8]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6B4423] flex items-center justify-center flex-shrink-0">
              <Coffee className="w-5 h-5 text-[#F5F0E8]" />
            </div>
            <span className="font-bold text-lg text-[#1A1A1A] hidden sm:block">Webhook.café</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/help">
              <Button variant="ghost" className="text-[#6B4423] text-sm">Help</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-[#6B4423] hover:bg-[#5A3A1D] text-white text-sm px-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6B4423]/10 text-[#6B4423] mb-4 md:mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs md:text-sm font-medium">Craft Beautiful Discord Embeds</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4 leading-tight">
            Discord Marketing,
            <br />
            <span className="text-[#6B4423]">Served Fresh</span>
          </h1>
          
          <p className="text-base md:text-lg text-[#6B4423] mb-6 max-w-xl mx-auto">
            Create stunning Discord embeds, manage your PR partners, and send 
            beautiful messages with our café-inspired tool.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-[#6B4423] hover:bg-[#5A3A1D] text-white px-6 md:px-8 gap-2 w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/help">
              <Button size="lg" variant="outline" className="border-[#6B4423] text-[#6B4423] px-6 md:px-8 w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1A1A1A] mb-8">
          Everything You Need
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: MessageSquare,
              title: 'Embed Builder',
              description: 'Create beautiful Discord embeds',
              color: 'bg-[#5865F2]/10 text-[#5865F2]'
            },
            {
              icon: Users,
              title: 'Partner Management',
              description: 'Track and manage partners',
              color: 'bg-[#6B4423]/10 text-[#6B4423]'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Send embeds instantly',
              color: 'bg-yellow-500/10 text-yellow-500'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Enterprise-grade security',
              color: 'bg-green-500/10 text-green-500'
            }
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="cafe-card hover:border-[#6B4423]/50 transition-all">
                <CardContent className="pt-5 px-5">
                  <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#6B4423]">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Preview */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1A1A1A] mb-8">
          Beautiful Embeds Made Easy
        </h2>
        
        <div className="max-w-2xl mx-auto bg-[#313338] rounded-xl p-4 md:p-6 shadow-xl">
          <p className="text-[#dbdee1] text-sm mb-4">Check out our latest partnership!</p>
          
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
            <p className="text-white font-semibold text-lg mb-2">🚀 New Partnership!</p>
            <p className="text-[#dbdee1] text-sm">
              We're excited to announce our partnership with TechCorp. 
              Use code <span className="text-[#00b0f4]">TECH25</span> for 25% off!
            </p>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 bg-[#5865F2]/20 text-[#00b0f4] text-xs rounded">#announcements</span>
              <span className="px-2 py-1 bg-[#5865F2]/20 text-[#00b0f4] text-xs rounded">#partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto cafe-card bg-[#6B4423] border-none">
          <CardContent className="pt-8 pb-8 text-center px-6">
            <Coffee className="w-10 h-10 text-[#F5F0E8] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F0E8] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-[#D4C4B0] mb-6 max-w-md mx-auto text-sm md:text-base">
              Join thousands of PR professionals who trust Webhook.café 
              for their Discord marketing needs.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-[#F5F0E8] text-[#6B4423] hover:bg-white px-6 md:px-8 gap-2 w-full sm:w-auto">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[#F5F0E8]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#6B4423]" />
              <span className="font-semibold text-[#1A1A1A]">Webhook.café</span>
            </div>
            <p className="text-xs text-[#6B4423]">
              Made with ☕ and ❤️
            </p>
            <div className="flex items-center gap-4">
              <Link href="/help" className="text-xs text-[#6B4423] hover:text-[#1A1A1A]">
                Help
              </Link>
              <Link href="#" className="text-xs text-[#6B4423] hover:text-[#1A1A1A]">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-[#6B4423] hover:text-[#1A1A1A]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
