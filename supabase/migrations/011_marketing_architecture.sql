-- ============================================
-- Marketing Architecture Tables
-- Stores the 7 pillars of the marketing architecture
-- that power Hanna's deep business knowledge
-- ============================================

-- Main architecture table: one row per user, JSONB columns per section
CREATE TABLE IF NOT EXISTS hanna_marketing_architecture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- The 6 pillar sections (07-agente is the output, not stored)
    avatar JSONB DEFAULT '{}'::jsonb,
    offer JSONB DEFAULT '{}'::jsonb,
    communication JSONB DEFAULT '{}'::jsonb,
    content_strategy JSONB DEFAULT '{}'::jsonb,
    branding JSONB DEFAULT '{}'::jsonb,
    funnel JSONB DEFAULT '{}'::jsonb,

    -- Progress tracking
    completion_percentage INTEGER DEFAULT 0,
    last_section_edited TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- One architecture per user
    CONSTRAINT unique_user_architecture UNIQUE (user_id)
);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_marketing_architecture_user_id
ON hanna_marketing_architecture(user_id);

-- RLS policies
ALTER TABLE hanna_marketing_architecture ENABLE ROW LEVEL SECURITY;

-- Users can read their own architecture
CREATE POLICY "Users can read own architecture"
ON hanna_marketing_architecture FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own architecture
CREATE POLICY "Users can insert own architecture"
ON hanna_marketing_architecture FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own architecture
CREATE POLICY "Users can update own architecture"
ON hanna_marketing_architecture FOR UPDATE
USING (auth.uid() = user_id);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access"
ON hanna_marketing_architecture FOR ALL
USING (auth.role() = 'service_role');

-- Testimonials table for future real testimonial collection
CREATE TABLE IF NOT EXISTS hanna_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quote TEXT NOT NULL,
    business_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hanna_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own testimonials"
ON hanna_testimonials FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read approved testimonials"
ON hanna_testimonials FOR SELECT
USING (approved = true);

CREATE POLICY "Service role full access testimonials"
ON hanna_testimonials FOR ALL
USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE hanna_marketing_architecture IS 'Stores the 6 marketing architecture pillars per user: avatar, offer, communication, content strategy, branding, and funnel. JSONB allows flexible schema per section.';
COMMENT ON TABLE hanna_testimonials IS 'Real user testimonials collected in-app. Only approved ones are publicly visible.';
