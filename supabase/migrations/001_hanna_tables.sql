-- ============================================
-- HANNA SaaS Product - Database Schema
-- Migration: 001_hanna_tables.sql
-- Description: Creates all tables for HANNA chatbot SaaS
-- ============================================

-- ============================================
-- 1. Extend profiles table for HANNA plans
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS messages_today INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_message_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- ============================================
-- 2. HANNA Sessions table
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Nueva conversación',
    business_context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_hanna_sessions_user_id ON hanna_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hanna_sessions_updated_at ON hanna_sessions(updated_at DESC);

-- ============================================
-- 3. HANNA Messages table
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES hanna_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster message retrieval
CREATE INDEX IF NOT EXISTS idx_hanna_messages_session_id ON hanna_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_hanna_messages_created_at ON hanna_messages(created_at);

-- ============================================
-- 4. HANNA Business Profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT,
    business_type TEXT,
    target_audience TEXT,
    brand_voice TEXT,
    products_services TEXT,
    unique_value_proposition TEXT,
    common_questions JSONB DEFAULT '[]',
    custom_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_hanna_business_profiles_user_id ON hanna_business_profiles(user_id);

-- ============================================
-- 5. HANNA Coupons table
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('workshop', 'promo', 'referral')),
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_months')),
    discount_value DECIMAL(10,2) NOT NULL,
    free_months INTEGER DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for coupon lookup
CREATE INDEX IF NOT EXISTS idx_hanna_coupons_code ON hanna_coupons(code);
CREATE INDEX IF NOT EXISTS idx_hanna_coupons_active ON hanna_coupons(is_active) WHERE is_active = true;

-- ============================================
-- 6. HANNA Coupon Redemptions table
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES hanna_coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, user_id)
);

-- Index for redemption lookup
CREATE INDEX IF NOT EXISTS idx_hanna_coupon_redemptions_user ON hanna_coupon_redemptions(user_id);

-- ============================================
-- 7. Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all HANNA tables
ALTER TABLE hanna_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON hanna_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON hanna_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON hanna_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON hanna_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Messages: Users can only access messages from their sessions
CREATE POLICY "Users can view messages from own sessions" ON hanna_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM hanna_sessions
            WHERE hanna_sessions.id = hanna_messages.session_id
            AND hanna_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in own sessions" ON hanna_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM hanna_sessions
            WHERE hanna_sessions.id = hanna_messages.session_id
            AND hanna_sessions.user_id = auth.uid()
        )
    );

-- Business Profiles: Users can only access their own profile
CREATE POLICY "Users can view own business profile" ON hanna_business_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own business profile" ON hanna_business_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile" ON hanna_business_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Coupons: Everyone can view active coupons (for validation)
CREATE POLICY "Anyone can view active coupons" ON hanna_coupons
    FOR SELECT USING (is_active = true);

-- Coupon Redemptions: Users can only see their own redemptions
CREATE POLICY "Users can view own redemptions" ON hanna_coupon_redemptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions" ON hanna_coupon_redemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for hanna_sessions
DROP TRIGGER IF EXISTS update_hanna_sessions_updated_at ON hanna_sessions;
CREATE TRIGGER update_hanna_sessions_updated_at
    BEFORE UPDATE ON hanna_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for hanna_business_profiles
DROP TRIGGER IF EXISTS update_hanna_business_profiles_updated_at ON hanna_business_profiles;
CREATE TRIGGER update_hanna_business_profiles_updated_at
    BEFORE UPDATE ON hanna_business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. Function to reset daily message count
-- ============================================
CREATE OR REPLACE FUNCTION reset_daily_messages()
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET messages_today = 0, last_message_date = CURRENT_DATE
    WHERE last_message_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. Function to increment message count
-- ============================================
CREATE OR REPLACE FUNCTION increment_message_count(p_user_id UUID)
RETURNS TABLE(can_send BOOLEAN, messages_remaining INTEGER) AS $$
DECLARE
    v_plan TEXT;
    v_messages_today INTEGER;
    v_last_message_date DATE;
    v_limit INTEGER;
BEGIN
    -- Get user's plan and message count
    SELECT plan, messages_today, last_message_date
    INTO v_plan, v_messages_today, v_last_message_date
    FROM profiles
    WHERE id = p_user_id;

    -- Reset count if new day
    IF v_last_message_date < CURRENT_DATE THEN
        v_messages_today := 0;
    END IF;

    -- Set limit based on plan
    v_limit := CASE WHEN v_plan = 'pro' THEN 999999 ELSE 5 END;

    -- Check if user can send
    IF v_messages_today >= v_limit THEN
        RETURN QUERY SELECT false, 0;
        RETURN;
    END IF;

    -- Increment count
    UPDATE profiles
    SET messages_today = v_messages_today + 1,
        last_message_date = CURRENT_DATE
    WHERE id = p_user_id;

    RETURN QUERY SELECT true, (v_limit - v_messages_today - 1)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. Create default workshop coupon
-- ============================================
INSERT INTO hanna_coupons (code, type, discount_type, discount_value, free_months, valid_until, is_active)
VALUES ('WORKSHOP2026', 'workshop', 'free_months', 0, 3, '2026-06-07', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 12. Grant permissions for service role
-- ============================================
GRANT ALL ON hanna_sessions TO service_role;
GRANT ALL ON hanna_messages TO service_role;
GRANT ALL ON hanna_business_profiles TO service_role;
GRANT ALL ON hanna_coupons TO service_role;
GRANT ALL ON hanna_coupon_redemptions TO service_role;
