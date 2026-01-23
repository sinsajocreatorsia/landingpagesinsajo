-- ============================================
-- SINSAJO WORKSHOP DATABASE SCHEMA
-- Migration: 001_workshop_schema.sql
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA 1: workshop_registrations
-- Datos básicos del registro de workshop
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    timezone VARCHAR(100),

    -- Payment info
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('stripe', 'paypal')),
    payment_id VARCHAR(255),
    amount_paid DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',

    -- Registration status
    registration_status VARCHAR(50) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'confirmed', 'attended', 'no_show', 'cancelled')),

    -- Source tracking
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referral_code VARCHAR(50),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    attended_at TIMESTAMP WITH TIME ZONE
);

-- Index for email lookups
CREATE INDEX idx_registrations_email ON workshop_registrations(email);
CREATE INDEX idx_registrations_status ON workshop_registrations(payment_status);

-- ============================================
-- TABLA 2: workshop_profiles
-- Datos del formulario de perfilamiento
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,

    -- Business info
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    industry VARCHAR(100),
    years_in_business INTEGER,
    monthly_revenue VARCHAR(50),
    team_size VARCHAR(50),

    -- Current challenges (multi-select)
    challenges JSONB DEFAULT '[]'::jsonb,
    -- Example: ["time_management", "lead_generation", "customer_service"]

    -- Goals for workshop
    primary_goal TEXT,
    expected_outcome TEXT,

    -- Tech readiness
    current_tools JSONB DEFAULT '[]'::jsonb,
    ai_experience VARCHAR(50) CHECK (ai_experience IN ('none', 'basic', 'intermediate', 'advanced')),

    -- Preferences
    communication_preference VARCHAR(50) CHECK (communication_preference IN ('email', 'whatsapp', 'both')),
    best_contact_time VARCHAR(50),

    -- Profile completion
    profile_completed BOOLEAN DEFAULT FALSE,
    profile_completion_percentage INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for registration lookups
CREATE INDEX idx_profiles_registration ON workshop_profiles(registration_id);

-- ============================================
-- TABLA 3: hanna_conversations
-- Historial de conversaciones con Hanna
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES workshop_registrations(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,

    -- Conversation data
    messages JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]

    -- Analytics
    message_count INTEGER DEFAULT 0,
    total_tokens_used INTEGER DEFAULT 0,

    -- Context
    page_url VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    ended_reason VARCHAR(50),

    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Index for session lookups
CREATE INDEX idx_conversations_session ON hanna_conversations(session_id);
CREATE INDEX idx_conversations_registration ON hanna_conversations(registration_id);

-- ============================================
-- TABLA 4: hanna_analysis
-- Análisis de Hanna sobre prospectos
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES workshop_registrations(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES hanna_conversations(id) ON DELETE SET NULL,

    -- AI Analysis scores (1-10)
    purchase_intent_score INTEGER CHECK (purchase_intent_score BETWEEN 1 AND 10),
    engagement_level INTEGER CHECK (engagement_level BETWEEN 1 AND 10),
    urgency_indicator INTEGER CHECK (urgency_indicator BETWEEN 1 AND 10),
    fit_score INTEGER CHECK (fit_score BETWEEN 1 AND 10),

    -- Sentiment analysis
    overall_sentiment VARCHAR(50) CHECK (overall_sentiment IN ('very_positive', 'positive', 'neutral', 'negative', 'very_negative')),

    -- Key insights
    detected_pain_points JSONB DEFAULT '[]'::jsonb,
    detected_objections JSONB DEFAULT '[]'::jsonb,
    detected_interests JSONB DEFAULT '[]'::jsonb,

    -- Recommendations
    follow_up_priority VARCHAR(20) CHECK (follow_up_priority IN ('high', 'medium', 'low')),
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    personalized_notes TEXT,

    -- Summary
    analysis_summary TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for registration lookups
CREATE INDEX idx_analysis_registration ON hanna_analysis(registration_id);
CREATE INDEX idx_analysis_priority ON hanna_analysis(follow_up_priority);

-- ============================================
-- TABLA 5: email_logs
-- Historial de emails enviados
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID REFERENCES workshop_registrations(id) ON DELETE SET NULL,

    -- Email details
    email_type VARCHAR(100) NOT NULL,
    -- Types: 'confirmation', 'reminder_24h', 'reminder_1h', 'access_link', 'recording', 'follow_up'
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),

    -- Delivery status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),

    -- Provider info
    provider VARCHAR(50) DEFAULT 'resend',
    provider_message_id VARCHAR(255),

    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Timestamps
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_emails_registration ON email_logs(registration_id);
CREATE INDEX idx_emails_type ON email_logs(email_type);
CREATE INDEX idx_emails_status ON email_logs(status);

-- ============================================
-- TABLA 6: admin_users
-- Usuarios del panel de administración
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'viewer')),

    -- Auth (using Supabase Auth, this is for additional permissions)
    supabase_user_id UUID,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA 7: workshop_settings
-- Configuración global del workshop
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO workshop_settings (key, value, description) VALUES
    ('workshop_date', '"2026-03-07T09:00:00-05:00"', 'Workshop date and time'),
    ('max_spots', '12', 'Maximum number of spots available'),
    ('price_usd', '100', 'Workshop price in USD'),
    ('original_price_usd', '197', 'Original price before discount'),
    ('registration_open', 'true', 'Whether registration is currently open'),
    ('zoom_link', '""', 'Zoom meeting link for workshop'),
    ('reminder_hours', '[24, 1]', 'Hours before workshop to send reminders')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- TABLA 8: analytics_events
-- Eventos de analytics del landing
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255),
    registration_id UUID REFERENCES workshop_registrations(id) ON DELETE SET NULL,

    -- Event details
    event_type VARCHAR(100) NOT NULL,
    -- Types: 'page_view', 'scroll_depth', 'cta_click', 'video_play', 'form_start', 'form_complete', etc.
    event_data JSONB DEFAULT '{}'::jsonb,

    -- Context
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    device_type VARCHAR(50),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role has full access" ON workshop_registrations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON workshop_profiles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON hanna_conversations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON hanna_analysis
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON email_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON workshop_settings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access" ON analytics_events
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for settings (anonymous users)
CREATE POLICY "Public can read workshop settings" ON workshop_settings
    FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers for updated_at
CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON workshop_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON workshop_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_updated_at
    BEFORE UPDATE ON hanna_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON workshop_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create profile when registration is created
CREATE OR REPLACE FUNCTION create_profile_for_registration()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workshop_profiles (registration_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_profile
    AFTER INSERT ON workshop_registrations
    FOR EACH ROW EXECUTE FUNCTION create_profile_for_registration();

-- ============================================
-- VIEWS FOR ADMIN DASHBOARD
-- ============================================

-- View for registration overview
CREATE OR REPLACE VIEW v_registration_overview AS
SELECT
    r.id,
    r.email,
    r.full_name,
    r.phone,
    r.country,
    r.payment_status,
    r.payment_method,
    r.amount_paid,
    r.registration_status,
    r.created_at,
    p.business_name,
    p.industry,
    p.profile_completed,
    a.purchase_intent_score,
    a.follow_up_priority,
    (SELECT COUNT(*) FROM hanna_conversations c WHERE c.registration_id = r.id) as conversation_count
FROM workshop_registrations r
LEFT JOIN workshop_profiles p ON p.registration_id = r.id
LEFT JOIN hanna_analysis a ON a.registration_id = r.id;

-- View for daily stats
CREATE OR REPLACE VIEW v_daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_registrations,
    COUNT(*) FILTER (WHERE payment_status = 'completed') as paid_registrations,
    SUM(CASE WHEN payment_status = 'completed' THEN amount_paid ELSE 0 END) as total_revenue
FROM workshop_registrations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- DONE
-- ============================================
