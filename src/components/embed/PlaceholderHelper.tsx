'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, AtSign, Calendar, User, DollarSign, Code } from 'lucide-react'

interface Placeholder {
  name: string
  value: string
  icon: any
  description: string
}

const defaultPlaceholders: Placeholder[] = [
  { name: 'partner_name', value: '{partner_name}', icon: User, description: 'Partner company name' },
  { name: 'partner_email', value: '{partner_email}', icon: AtSign, description: 'Partner email' },
  { name: 'partner_discount', value: '{partner_discount}', icon: DollarSign, description: 'Discount code' },
  { name: 'firm_name', value: '{firm_name}', icon: Hash, description: 'Your firm name' },
  { name: 'date', value: '{date}', icon: Calendar, description: 'Current date' },
  { name: 'time', value: '{time}', icon: Calendar, description: 'Current time' },
]

interface PlaceholderHelperProps {
  onInsert: (placeholder: string) => void
}

export function PlaceholderHelper({ onInsert }: PlaceholderHelperProps) {
  const [customPlaceholder, setCustomPlaceholder] = useState('')
  const [customValue, setCustomValue] = useState('')

  const handleInsertCustom = () => {
    if (customPlaceholder.trim() && customValue.trim()) {
      onInsert(`{${customPlaceholder}}`)
      setCustomPlaceholder('')
      setCustomValue('')
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Code className="w-4 h-4" />
          Placeholders
        </CardTitle>
        <CardDescription>
          Click to insert, or create custom
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Default Placeholders */}
        <div className="flex flex-wrap gap-1">
          {defaultPlaceholders.map((p) => {
            const Icon = p.icon
            return (
              <Badge
                key={p.name}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onInsert(p.value)}
                title={p.description}
              >
                <Icon className="w-3 h-3 mr-1" />
                {p.value}
              </Badge>
            )
          })}
        </div>

        {/* Custom Placeholder */}
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs">Custom Placeholder</Label>
          <div className="flex gap-2">
            <Input
              placeholder="name"
              value={customPlaceholder}
              onChange={(e) => setCustomPlaceholder(e.target.value.replace(/[{}]/g, ''))}
              className="h-8 text-xs"
            />
            <span className="flex items-center text-muted-foreground">=</span>
            <Input
              placeholder="value"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              size="sm"
              onClick={handleInsertCustom}
              disabled={!customPlaceholder.trim() || !customValue.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
