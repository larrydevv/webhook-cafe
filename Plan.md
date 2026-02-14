# Webhook.cafe - Plan

## 🌐 Projekt Übersicht

**Webhook.cafe** ist ein Discord-Tool für Reseller und Marketing-Teams im Partner-Management-Bereich.

### Zielgruppen
1. **PR (Partner Relations)** - Manage multiple firms, partners, and campaigns
2. **Firms** - Single company managing their PR relationships

---

## 🛠 Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Base**: https://github.com/Kiranism/next-shadcn-dashboard-starter

### Database & Auth
- **Database**: Supabase (PostgreSQL)
- **Auth**: Discord OAuth2
- **Real-time**: Supabase Realtime

### Discord Integration
- **Embed Builder**: Custom React component (discohook-style)
- **Webhooks**: Discord Webhook API
- **Bot**: Optional - Discord Bot für erweiterte Features

### Infrastructure
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel + Supabase

---

## 📊 Database Schema

### Users
```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  discord_id TEXT UNIQUE,
  discord_username TEXT,
  discord_avatar TEXT,
  user_type TEXT CHECK (user_type IN ('pr', 'firm', 'admin')),
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Firms (für PRs - mehrere Firms pro PR)
```sql
firms (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  discord_guild_id TEXT,
  webhook_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Firms (für Firms - eine Firma pro User)
```sql
company_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  firm_id UUID REFERENCES firms(id), -- Reference to own firm
  contact_email TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  bio TEXT,
  is_searchable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Partners
```sql
partners (
  id UUID PRIMARY KEY,
  firm_id UUID REFERENCES firms(id),
  name TEXT NOT NULL,
  discord_id TEXT,
  discord_username TEXT,
  discount_codes JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Partner Access (Firm gibt PR Access auf Partner)
```sql
partner_access (
  id UUID PRIMARY KEY,
  firm_id UUID REFERENCES firms(id), -- Die Firma die Access gibt
  pr_id UUID REFERENCES profiles(id), -- PR der Access bekommt
  partner_id UUID REFERENCES partners(id),
  permissions JSONB DEFAULT '{"view": true, "edit": false, "delete": false}',
  granted_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Embeds
```sql
embeds (
  id UUID PRIMARY KEY,
  firm_id UUID REFERENCES firms(id),
  partner_id UUID REFERENCES partners(id), -- Optional: specific partner
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  image_url TEXT,
  thumbnail_url TEXT,
  author_name TEXT,
  author_url TEXT,
  author_icon_url TEXT,
  footer_text TEXT,
  footer_icon_url TEXT,
  fields JSONB DEFAULT '[]', -- Array of custom fields
  custom_placeholders JSONB DEFAULT '{}', -- {fieldName: defaultValue}
  is_template BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Discord Channels (für Webhook-Auswahl)
```sql
discord_channels (
  id UUID PRIMARY KEY,
  firm_id UUID REFERENCES firms(id),
  channel_id TEXT NOT NULL,
  channel_name TEXT,
  webhook_url TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Activity/Logs
```sql
activity_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

---

## 🎨 Design System (shadcn/ui basierend)

### Colors
```typescript
const colors = {
  primary: {
    DEFAULT: '#6366f1', // Indigo
    foreground: '#ffffff',
    hover: '#4f46e5',
  },
  secondary: {
    DEFAULT: 'rgba(255,255,255,0.08)',
    foreground: '#ffffff',
  },
  accent: {
    DEFAULT: '#a855f7', // Purple
    foreground: '#ffffff',
  },
  background: '#0a0a0f',
  surface: 'rgba(255,255,255,0.03)',
  glass: 'rgba(255,255,255,0.05)',
}
```

### Components to Build/Extend
1. **EmbedBuilder** - Custom Discohook-ähnlicher Builder
2. **FieldEditor** - Custom Fields mit Preview
3. **PartnerSelector** - Dropdown mit Suche
4. **FirmSwitcher** - PR kann zwischen Firms wechseln
5. **DiscordChannelPicker** - Channel mit Webhook-Status
6. **TemplateCard** - Embed-Vorlagen
7. **ActivityTimeline** - Logs anzeigen

---

## 🔧 Feature Phasen

### Phase 1: Foundation (Woche 1)
- [ ] Next.js + shadcn Setup von Starter
- [ ] Supabase Schema erstellen
- [ ] Discord OAuth implementieren
- [ ] Basic Layout mit Navigation
- [ ] Profile Page mit User Type Auswahl (PR/Firm)

### Phase 2: PR Features - Firms & Partners (Woche 2)
- [ ] Firms CRUD (Create, Read, Update, Delete)
- [ ] Firm Switcher im Header
- [ ] Partners CRUD
- [ ] Partner-Firm Zuordnung
- [ ] Basic Dashboard Stats

### Phase 3: Embed Builder (Woche 3-4)
- [ ] Discohook-Style Embed Builder
- [ ] Live Preview
- [ ] Image Upload (Supabase Storage)
- [ ] Fields System (Custom Placeholders)
- [ ] Template Speicherung

### Phase 4: Discord Integration (Woche 5)
- [ ] Webhook URL Management
- [ ] Discord Channel Picker
- [ ] Preview in Discord (Send Test)
- [ ] Discord Button im Embed
- [ ] Rich Presence Features

### Phase 5: Search & Discovery (Woche 6)
- [ ] PR Search (Firms suchen)
- [ ] Firm Search (PRs suchen)
- [ ] Public Profiles
- [ ] Featured Listings (Paid)

### Phase 6: Advanced Features (Woche 7-8)
- [ ] Partner Discount Codes System
- [ ] {placeholder} Replacement Logic
- [ ] Bulk Actions
- [ ] Activity Logs
- [ ] Email Notifications

---

## 🎯 Discord Embed Builder Details

### Layout
```
┌─────────────────────────────────────────────┐
│  Preview Panel                              │
│  ┌─────────────────────────────────────┐   │
│  │ Discord Embed Vorschau               │   │
│  │                                     │   │
│  │ [Image]                             │   │
│  │ Title                                │   │
│  │ Description                          │   │
│  │ {field1} {field2}                   │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Builder Tabs:                              │
│  [Content] [Fields] [Images] [Settings]    │
├─────────────────────────────────────────────┤
│  Content Fields                            │
│  ┌─────────────────────────────────────┐   │
│  │ Title _______________ [] Rich Embed  │   │
│  │ Description _______________________  │   │
│  │ Color _______________ [#]           │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Custom Fields                             │
│  ┌───────┬──────────────┬─────────────┐   │
│  │ Name  │ Default      │ Required    │   │
│  ├───────┼──────────────┼─────────────┤   │
│  │ {code}│ CODE2024     │ [x]        │   │
│  │ {link}│ https://...  │ [ ]        │   │
│  └───────┴──────────────┴─────────────┘   │
│  [+ Add Field]                             │
└─────────────────────────────────────────────┘
```

### Custom Placeholders System
```typescript
// Schema für Placeholder
interface Placeholder {
  name: string;        // "{discountCode}"
  label: string;       // "Discount Code"
  defaultValue: string;
  required: boolean;
  partnerSpecific?: boolean; // Partner-spezifische Werte
}

// Beispiel: Partner-spezifische Codes
interface PartnerDiscount {
  partnerId: UUID;
  discountCode: string;
  isActive: boolean;
}

// Usage im Embed
const embed = {
  title: "Special Offer from {partnerName}",
  description: "Use code {discountCode} for 10% off!",
  placeholders: {
    discountCode: {
      default: "SAVE10",
      overrides: {
        "partner-uuid-1": "PARTNER20",
        "partner-uuid-2": "WELCOME25"
      }
    }
  }
};
```

---

## 📱 Dashboard Navigation

### PR Dashboard
```
┌────────────────────────────────────────┐
│  🏢 Firm Switcher: [Acme Corp ▼]       │
├────────────────────────────────────────┤
│  📊 Overview                            │
│  ┌──────────┬──────────┬──────────┐   │
│  │ Partners │ Embeds   │ Sent     │   │
│  │    12    │    28    │   156    │   │
│  └──────────┴──────────┴──────────┘   │
│                                         │
│  🏢 Firms      👥 Partners    📝 Embeds │
│                                         │
│  🔍 Search Firms looking for PRs        │
│                                         │
│  📈 Recent Activity                      │
└────────────────────────────────────────┘
```

### Firm Dashboard
```
┌────────────────────────────────────────┐
│  🏢 Company Profile: [MyFirma]          │
├────────────────────────────────────────┤
│  📊 Overview                            │
│  ┌──────────┬──────────┬──────────┐   │
│  │ PRs      │ Embeds   │ Partners │   │
│  │     5    │    15    │     8    │   │
│  └──────────┴──────────┴──────────┘   │
│                                         │
│  👥 My PRs      📝 My Embeds           │
│                                         │
│  🔍 Search PRs looking for firms       │
│                                         │
│  ⭐ Upgrade to Featured                │
└────────────────────────────────────────┘
```

---

## 🔐 Security & Permissions

### RLS Policies (Supabase)
```sql
-- Profiles: Users can only edit own profile
CREATE POLICY "Users can edit own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Firms: PR can only see/edit own firms
CREATE POLICY "PR can manage own firms"
ON firms FOR ALL
USING (owner_id IN (
  SELECT id FROM profiles WHERE user_type = 'pr'
  AND auth.uid() = id
));

-- Partners: Based on firm access
CREATE POLICY "Partners visible to authorized firms"
ON partners FOR SELECT
USING (firm_id IN (
  SELECT firm_id FROM partner_access WHERE pr_id = auth.uid()
));
```

### Discord OAuth Scopes
```typescript
const discordOAuthConfig = {
  scopes: [
    'identify',
    'guilds',
    'guilds.members.read',
    // Optional für Bot Features:
    // 'bot',
    // 'applications.commands'
  ]
}
```

---

## 🚀 Deployment Plan

### 1. GitHub Setup
- Repository: `webhook-cafe/webhook-cafe`
- Branch Protection: main requires PR reviews
- CI/CD: GitHub Actions für Tests + Deploy

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=...
```

### 3. Database Migrations
```
/supabase/migrations/
  ├── 001_initial_schema.sql
  ├── 002_add_partner_access.sql
  ├── 003_add_embed_templates.sql
  └── 004_add_featured_system.sql
```

---

## 📋 Implementation Checklist

### Woche 1: Setup
- [ ] GitHub Repo erstellen
- [ ] Starter template clonen
- [ ] Supabase Projekt anlegen
- [ ] Database Schema deployen
- [ ] Discord OAuth konfigurieren
- [ ] Basic Layout mit shadcn

### Woche 2: Core Features
- [ ] Firms CRUD
- [ ] Partners CRUD
- [ ] Dashboard Stats
- [ ] User Onboarding Flow

### Woche 3-4: Embed Builder
- [ ] Basic Builder UI
- [ ] JSON Preview
- [ ] Image Upload
- [ ] Fields System
- [ ] Template Save/Load

### Woche 5: Discord Integration
- [ ] Webhook Management
- [ ] Channel Picker
- [ ] Test Send
- [ ] Error Handling

### Woche 6: Search
- [ ] Search Index
- [ ] Results UI
- [ ] Featured System

---

## 💰 Monetization (Optional)

### Featured Listings
- `featured_until` Timestamp in profiles
- Payment Integration (Stripe)
- Pricing Tiers:
  - 24h Featured: 5€
  - 7d Featured: 25€
  - 30d Featured: 75€

---

## 🎨 Design References

### Inspiration
- https://discohook.app - Embed Builder
- https://shopify.com - Dashboard UX
- https://discord.com - UI Patterns

### Font
- Inter (wie shadcn)
- JetBrains Mono für Code/Embeds

---

## 📝 Commit Strategy

### Commit Message Format
```
[TYPE]: Short description

- Detailed changes
- More details

[TYPE] can be: feat, fix, refactor, style, docs, test, chore
```

### Beispiel Commits
```
feat: Add Discord OAuth login
- Implement Discord OAuth flow
- Add user type selection (PR/Firm)
- Create profile on first login

fix: Correct webhook URL validation
- Add regex validation for Discord webhooks
- Show error message for invalid URLs

refactor: Improve Embed Builder state management
- Move to Zustand for global state
- Add undo/redo functionality
```

---

## 🔗 Useful Resources

### Libraries
- https://ui.shadcn.com - UI Components
- https://zustand.dev - State Management
- https://tanstack.com/query - Data Fetching
- https://zod.dev - Validation

### Discord
- https://discord.js.org - Bot SDK
- https://discord.com/developers/docs - API Docs
- https://discohook.dev - Embed Guide

### Supabase
- https://supabase.com/docs
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/realtime

---

## ✅ Review & Feedback

Nach jedem Meilenstein:
- [ ] Code Review
- [ ] Testing
- [ ] User Feedback sammeln
- [ ] Prioritäten für nächsten Sprint anpassen

---

*Last Updated: 2026-02-14*
*Version: 1.0*
