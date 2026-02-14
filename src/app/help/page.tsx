import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  FileText,
  Discord,
  Github,
  Mail,
  ChevronRight,
  Search,
  Coffee
} from 'lucide-react'

const guides = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Webhook.cafe',
    icon: Book,
    color: 'bg-[#6B4423]',
    articles: [
      { title: 'Quick Start Guide', href: '#' },
      { title: 'Creating Your First Firm', href: '#' },
      { title: 'Setting Up Webhooks', href: '#' },
    ]
  },
  {
    title: 'Embed Builder',
    description: 'Create beautiful Discord embeds',
    icon: FileText,
    color: 'bg-[#1A1A1A]',
    articles: [
      { title: 'Embed Anatomy', href: '#' },
      { title: 'Using Templates', href: '#' },
      { title: 'Placeholder Guide', href: '#' },
    ]
  },
  {
    title: 'Partners',
    description: 'Manage your partner network',
    icon: Users,
    color: 'bg-[#D4C4B0]',
    articles: [
      { title: 'Adding Partners', href: '#' },
      { title: 'Discount Codes', href: '#' },
      { title: 'Partner Analytics', href: '#' },
    ]
  },
]

const faqs = [
  {
    question: 'How do I create a Discord webhook?',
    answer: 'Go to your Discord server → Server Settings → Integrations → Webhooks → New Webhook. Copy the webhook URL and add it in Webhook.cafe.'
  },
  {
    question: 'Can I use multiple webhooks?',
    answer: 'Yes! You can create multiple webhooks for different channels or purposes. Each webhook can have its own name and settings.'
  },
  {
    question: 'Are there limits on embeds?',
    answer: 'Discord allows up to 10 embeds per message. Each embed can have up to 25 fields.'
  },
  {
    question: 'How do placeholders work?',
    answer: 'Placeholders like {partner_name} or {date} are replaced when sending. You can also create custom placeholders.'
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen texture-paper">
      {/* Header */}
      <header className="bg-[#6B4423] text-[#F5F0E8]">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] mx-auto flex items-center justify-center mb-4">
            <Coffee className="w-8 h-8 text-[#6B4423]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-[#D4C4B0] mb-6">
            Search our guides or browse by topic below
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B4423]" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#F5F0E8] text-[#1A1A1A]"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="cafe-card hover:border-[#6B4423]/50 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/10 mx-auto flex items-center justify-center mb-3">
                <Discord className="w-7 h-7 text-[#5865F2]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-1">Join our Discord</h3>
              <p className="text-sm text-[#6B4423]">
                Get help from the community
              </p>
            </CardContent>
          </Card>
          <Card className="cafe-card hover:border-[#6B4423]/50 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 mx-auto flex items-center justify-center mb-3">
                <Video className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-1">Video Tutorials</h3>
              <p className="text-sm text-[#6B4423]">
                Watch step-by-step guides
              </p>
            </CardContent>
          </Card>
          <Card className="cafe-card hover:border-[#6B4423]/50 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#6B4423]/10 mx-auto flex items-center justify-center mb-3">
                <Mail className="w-7 h-7 text-[#6B4423]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-1">Contact Support</h3>
              <p className="text-sm text-[#6B4423]">
                Get help from our team
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guides */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
          <Book className="w-6 h-6 text-[#6B4423]" />
          Guides & Tutorials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card key={guide.title} className="cafe-card hover:border-[#6B4423]/50 transition-all">
                <CardHeader>
                  <div className={`w-10 h-10 rounded-xl ${guide.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-[#1A1A1A]">{guide.title}</CardTitle>
                  <CardDescription className="text-[#8B7355]">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {guide.articles.map((article) => (
                    <Link
                      key={article.title}
                      href={article.href}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F0E8]/50 transition-colors"
                    >
                      <span className="text-sm text-[#1A1A1A]">{article.title}</span>
                      <ChevronRight className="w-4 h-4 text-[#6B4423]" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQs */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#6B4423]" />
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4 max-w-3xl">
          {faqs.map((faq, i) => (
            <Card key={i} className="cafe-card">
              <CardHeader>
                <CardTitle className="text-lg text-[#1A1A1A]">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B4423]">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#6B4423]/20 text-center">
          <p className="text-[#6B4423] mb-4">
            Can't find what you're looking for?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
              <Discord className="w-4 h-4" />
              Join Discord
            </Button>
            <Button variant="outline" className="gap-2 border-[#6B4423] text-[#6B4423]">
              <Mail className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
          <p className="text-sm text-[#8B7355] mt-6">
            Made with ☕ and ❤️ by Webhook.cafe
          </p>
        </div>
      </main>
    </div>
  )
}
