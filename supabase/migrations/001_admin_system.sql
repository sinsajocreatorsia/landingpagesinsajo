-- ============================================
-- HANNA SAAS - ADMIN SYSTEM MIGRATION  
-- ============================================
-- Version: 1.0
-- Created: 2026-02-01
-- Description: Admin panel, coupons, tracking
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ADMIN TABLES
-- ============================================

-- Admin email whitelist
CREATE TABLE IF NOT EXISTS admin_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users with roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. DISCOUNT COUPONS
-- ============================================

CREATE TABLE IF NOT EXISTS discount_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value >= 0),
  max_uses INTEGER DEFAULT NULL CHECK (max_uses IS NULL OR max_uses > 0),
  times_used INTEGER DEFAULT 0 CHECK (times_used >= 0),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  applicable_plans TEXT[] DEFAULT ARRAY['pro']::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon redemptions tracking
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES discount_coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discount_applied DECIMAL(10,2) NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

-- ============================================
-- 3. SUBSCRIPTIONS (Stripe Sync)
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_plan_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'canceled', 'past_due', 'inactive')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. API USAGE LOGS (Cost Tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  model TEXT NOT NULL,
  client_type TEXT DEFAULT 'saas',
  user_plan TEXT DEFAULT 'free',
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  input_cost DECIMAL(10,6) NOT NULL DEFAULT 0,
  output_cost DECIMAL(10,6) NOT NULL DEFAULT 0,
  total_cost DECIMAL(10,6) NOT NULL DEFAULT 0,
  response_time_ms INTEGER,
  was_successful BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_client_type ON api_usage_logs(client_type);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_code ON discount_coupons(code);
CREATE INDEX IF NOT EXISTS idx_discount_coupons_active ON discount_coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Admin tables: Only service role can access
CREATE POLICY "Service role only" ON admin_emails FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role only" ON admin_users FOR ALL USING (auth.role() = 'service_role');

-- Coupons: Public can read active coupons for validation
CREATE POLICY "Public can read active coupons" ON discount_coupons
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Service role full access" ON discount_coupons
  FOR ALL USING (auth.role() = 'service_role');

-- Coupon redemptions: Users can see their own
CREATE POLICY "Users can see own redemptions" ON coupon_redemptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON coupon_redemptions
  FOR ALL USING (auth.role() = 'service_role');

-- Subscriptions: Users can see their own
CREATE POLICY "Users can see own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- API logs: Service role only
CREATE POLICY "Service role only" ON api_usage_logs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Auto-create admin user when email matches whitelist
CREATE OR REPLACE FUNCTION auto_create_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_emails WHERE email = NEW.email) THEN
    INSERT INTO admin_users (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Run after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_admin_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discount_coupons_updated_at ON discount_coupons;
CREATE TRIGGER update_discount_coupons_updated_at
  BEFORE UPDATE ON discount_coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. VIEWS FOR ANALYTICS
-- ============================================

CREATE OR REPLACE VIEW daily_costs AS
SELECT
  DATE(created_at) as date,
  client_type,
  user_plan,
  COUNT(*) as total_requests,
  SUM(total_cost) as total_cost,
  AVG(total_cost) as avg_cost_per_request,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens
FROM api_usage_logs
WHERE was_successful = TRUE
GROUP BY DATE(created_at), client_type, user_plan
ORDER BY date DESC;

CREATE OR REPLACE VIEW user_costs AS
SELECT
  user_id,
  user_plan,
  COUNT(*) as total_requests,
  SUM(total_cost) as total_cost,
  AVG(total_cost) as avg_cost_per_request,
  MAX(created_at) as last_request_at
FROM api_usage_logs
WHERE user_id IS NOT NULL
GROUP BY user_id, user_plan;

CREATE OR REPLACE VIEW coupon_stats AS
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_active = TRUE) as active,
  COALESCE(SUM(times_used), 0) as total_redemptions,
  COALESCE(SUM(
    CASE
      WHEN discount_type = 'percentage' THEN times_used * (19.99 * discount_value / 100)
      ELSE times_used * discount_value
    END
  ), 0) as total_discount_given
FROM discount_coupons;

-- ============================================
-- 8. ADMIN SETUP: ceo@sinsajocreators.com
-- ============================================

-- Add CEO email to whitelist
INSERT INTO admin_emails (email)
VALUES ('ceo@sinsajocreators.com')
ON CONFLICT (email) DO NOTHING;

-- If user already exists, create admin user immediately
INSERT INTO admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'ceo@sinsajocreators.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Login to Hanna SaaS with: ceo@sinsajocreators.com
-- 2. Go to: /admin
-- 3. Enjoy your admin panel!
