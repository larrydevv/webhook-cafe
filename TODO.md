# Webhook.cafe - Implementation Tasks

## Phase 1: Foundation (Woche 1)

### Setup
- [ ] GitHub Repository erstellen (oder lokales Repo behalten)
- [ ] next-shadcn-dashboard-starter clonen
- [ ] Supabase Projekt anlegen
- [ ] Database Schema deployen (aus Plan.md)
- [ ] Environment Variables konfigurieren

### Authentication
- [ ] Discord OAuth implementieren
- [ ] User Type Selection Onboarding (PR/Firm)
- [ ] Profile Creation Flow
- [ ] Login/Logout UI

### Basic UI
- [ ] Responsive Navigation Header
- [ ] Sidebar Navigation
- [ ] Mobile Menu
- [ ] Theme Toggle (Dark/Light)

## Phase 2: Core Features (Woche 2)

### Firms Management (für PRs)
- [ ] Firm List View
- [ ] Firm Create Form
- [ ] Firm Edit/Update
- [ ] Firm Delete mit Confirmation
- [ ] Firm Switcher Component

### Partners Management
- [ ] Partner List View
- [ ] Partner Create Form
- [ ] Partner Edit
- [ ] Partner-Firm Zuordnung
- [ ] Partner Discount Codes

### Dashboard
- [ ] Overview Stats Cards
- [ ] Recent Activity Feed
- [ ] Quick Actions Bar

## Phase 3: Embed Builder (Woche 3-4)

### Builder UI
- [ ] Discohook-Style Layout
- [ ] Split View (Builder + Preview)
- [ ] Real-time Preview
- [ ] Undo/Redo History

### Content Editor
- [ ] Title Input mit Rich Toggle
- [ ] Description Textarea
- [ ] Color Picker
- [ ] Author Fields
- [ ] Footer Fields

### Images
- [ ] Image Upload (Supabase Storage)
- [ ] Thumbnail Support
- [ ] Image Preview
- [ ] Delete Image

### Custom Fields
- [ ] Fields Manager UI
- [ ] Add/Edit/Delete Fields
- [ ] Placeholder Syntax {fieldName}
- [ ] Required Fields
- [ ] Default Values

### Templates
- [ ] Save as Template
- [ ] Load from Template
- [ ] Template Library
- [ ] Delete Template

## Phase 4: Discord Integration (Woche 5)

### Webhook Management
- [ ] Webhook URL Input mit Validation
- [ ] Webhook Test Button
- [ ] Webhook List
- [ ] Delete Webhook

### Channel Picker
- [ ] Discord Channel Selector
- [ ] Channel Type Icons
- [ ] Default Channel Selection
- [ ] Multiple Channels Support

### Send Features
- [ ] Send Embed to Webhook
- [ ] Send Preview to Test Channel
- [ ] Error Handling UI
- [ ] Success Feedback

## Phase 5: Search & Discovery (Woche 6)

### PR Search
- [ ] Search Firms Interface
- [ ] Filters (Industry, Size, etc.)
- [ ] Results Grid/List
- [ ] Firm Detail View

### Firm Search
- [ ] Search PRs Interface
- [ ] Filters
- [ ] Results Display
- [ ] PR Detail View

### Public Profiles
- [ ] Public Profile Page
- [ ] Edit Public Profile
- [ ] Profile Preview

### Featured System
- [ ] Featured Toggle
- [ ] Pricing UI (Modal)
- [ ] Featured Badge on Profile

## Phase 6: Advanced Features (Woche 7-8)

### Discount Codes
- [ ] Partner-specific Discount UI
- [ ] Bulk Discount Management
- [ ] Code Validation

### Placeholder Logic
- [ ] Runtime Placeholder Replacement
- [ ] Partner Override System
- [ ] Preview with Values

### Notifications
- [ ] Email Settings Page
- [ ] Notification Preferences
- [ ] Activity Alerts

### Bulk Actions
- [ ] Bulk Delete
- [ ] Bulk Export
- [ ] Bulk Duplicate

## Ongoing Tasks

### Testing
- [ ] Unit Tests (Jest/Vitest)
- [ ] Integration Tests (Playwright)
- [ ] E2E Tests
- [ ] Accessibility Tests

### Documentation
- [ ] README.md
- [ ] API Documentation
- [ ] User Guide
- [ ] Contributing Guide

### Performance
- [ ] Image Optimization
- [ ] Code Splitting
- [ ] Database Query Optimization
- [ ] Caching Strategy

---

## Priority Order (Recommended)

### Must Have (MVP)
1. Discord OAuth + Profile
2. Firms CRUD
3. Partners CRUD  
4. Basic Embed Builder
5. Webhook Send
6. Search (basic)

### Should Have
1. Templates
2. Custom Fields
3. Partner Discount Codes
4. Public Profiles

### Nice to Have
1. Discord Bot
2. Bulk Actions
3. Email Notifications
4. Featured Listings

---

