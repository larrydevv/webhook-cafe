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
  ExternalLink,
  Discord,
  Github,
  Mail,
  ChevronRight,
  Search
} from 'lucide-react'

const guides = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of Webhook.cafe',
    icon: Book,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-12 text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-muted-foreground mb-6">
            Search our guides or browse by topic below
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border bg-background"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Discord className="w-8 h-8 mx-auto mb-3 text-[#5865F2]" />
              <h3 className="font-semibold mb-1">Join our Discord</h3>
              <p className="text-sm text-muted-foreground">
                Get help from the community
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Video className="w-8 h-8 mx-auto mb-3 text-red-500" />
              <h3 className="font-semibold mb-1">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Watch step-by-step guides
              </p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-1">Contact Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help from our team
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Guides */}
        <h2 className="text-2xl font-bold mb-6">Guides & Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card key={guide.title}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {guide.articles.map((article) => (
                    <Link
                      key={article.title}
                      href={article.href}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-sm">{article.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQs */}
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4 max-w-3xl">
          {faqs.map((faq, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for?
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Discord className="w-4 h-4" />
              Join Discord
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
