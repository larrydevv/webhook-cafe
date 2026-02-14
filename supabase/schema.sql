-- Webhook.cafe Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  discord_id TEXT UNIQUE,
  discord_username TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'user', -- 'user', 'pr', 'firm'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Firms table (PR agencies)
CREATE TABLE firms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  discord_server_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners table
CREATE TABLE partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  discord_id TEXT,
  email TEXT,
  discount_code TEXT,
  discount_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'blocked'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-Firm associations (for multi-firm access)
CREATE TABLE user_firms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, firm_id)
);

-- Webhooks table
CREATE TABLE webhooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  channel_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Embed templates
CREATE TABLE embed_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sent messages log
CREATE TABLE sent_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  firm_id UUID REFERENCES firms(id) ON DELETE CASCADE NOT NULL,
  webhook_id UUID REFERENCES webhooks(id) ON DELETE SET NULL,
  content JSONB,
  status TEXT, -- 'sent', 'failed'
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE embed_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_messages ENABLE ROW LEVEL SECURITY;

-- Users: Users can read own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Firms: Users can read firms they belong to
CREATE POLICY "Users can read own firms" ON firms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_firms 
      WHERE user_firms.firm_id = firms.id 
      AND user_firms.user_id = auth.uid()
    )
  );

-- Firms: Owners can create firms
CREATE POLICY "Users can create firms" ON firms
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Firms: Owners can update own firms
CREATE POLICY "Users can update own firms" ON firms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_firms 
      WHERE user_firms.firm_id = firms.id 
      AND user_firms.user_id = auth.uid()
      AND user_firms.role IN ('owner', 'admin')
    )
  );

-- Partners: Users can read partners of their firms
CREATE POLICY "Users can read own partners" ON partners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_firms 
      WHERE user_firms.firm_id = partners.firm_id 
      AND user_firms.user_id = auth.uid()
    )
  );

-- Partners: Admins can CRUD partners
CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_firms 
      WHERE user_firms.firm_id = partners.firm_id 
      AND user_firms.user_id = auth.uid()
      AND user_firms.role IN ('owner', 'admin')
    )
  );

-- Auto-create user on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, discord_username, discord_id, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'sub',
    NEW.raw_user_meta_data->>'avatar'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_firms_owner ON firms(owner_id);
CREATE INDEX idx_partners_firm ON partners(firm_id);
CREATE INDEX idx_user_firms_user ON user_firms(user_id);
CREATE INDEX idx_user_firms_firm ON user_firms(firm_id);
CREATE INDEX idx_webhooks_firm ON webhooks(firm_id);
CREATE INDEX idx_sent_messages_firm ON sent_messages(firm_id);
