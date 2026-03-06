-- ============================================
-- WORKSHOP SURVEYS - Post-workshop feedback
-- Migration: 016_workshop_surveys.sql
-- ============================================

-- Survey responses table
CREATE TABLE IF NOT EXISTS workshop_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Contact info (required)
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,

    -- Section 1: Satisfaction
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    liked_most TEXT[] DEFAULT ARRAY[]::TEXT[],
    improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
    suggestions TEXT,

    -- Section 2: Future Interest
    future_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    future_topics_other TEXT,
    continuing_interest INTEGER NOT NULL CHECK (continuing_interest BETWEEN 1 AND 5),
    nps_score INTEGER NOT NULL CHECK (nps_score BETWEEN 0 AND 10),

    -- Section 3: Community
    community_interest VARCHAR(10) NOT NULL CHECK (community_interest IN ('yes', 'no', 'maybe')),
    community_values TEXT[] DEFAULT ARRAY[]::TEXT[],
    preferred_platform VARCHAR(20) CHECK (preferred_platform IN ('whatsapp', 'discord', 'telegram', 'facebook_group')),

    -- Section 4: Google Review
    google_rating INTEGER CHECK (google_rating BETWEEN 1 AND 5),
    google_review_clicked BOOLEAN DEFAULT FALSE,

    -- Coupon generated
    coupon_code VARCHAR(50),
    coupon_id UUID,

    -- Metadata
    workshop_id VARCHAR(100) DEFAULT 'workshop-2026-03',

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workshop_surveys_email ON workshop_surveys(email);
CREATE INDEX IF NOT EXISTS idx_workshop_surveys_created_at ON workshop_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workshop_surveys_rating ON workshop_surveys(overall_rating);

-- RLS
ALTER TABLE workshop_surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on surveys"
    ON workshop_surveys FOR ALL
    USING (auth.role() = 'service_role');

-- Add source and linked_email columns to discount_coupons
ALTER TABLE discount_coupons ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'admin';
ALTER TABLE discount_coupons ADD COLUMN IF NOT EXISTS linked_email VARCHAR(255);

-- Add free_months support to discount_coupons if not exists
DO $$
BEGIN
    -- Add free_months column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'discount_coupons' AND column_name = 'free_months'
    ) THEN
        ALTER TABLE discount_coupons ADD COLUMN free_months INTEGER DEFAULT NULL;
    END IF;

    -- Update check constraint to allow 'free_months' as discount_type
    ALTER TABLE discount_coupons DROP CONSTRAINT IF EXISTS discount_coupons_discount_type_check;
    ALTER TABLE discount_coupons ADD CONSTRAINT discount_coupons_discount_type_check
        CHECK (discount_type IN ('percentage', 'fixed', 'free_months'));
END $$;

-- View for aggregated survey stats
CREATE OR REPLACE VIEW v_survey_stats AS
SELECT
    COUNT(*) as total_responses,
    ROUND(AVG(overall_rating)::numeric, 2) as avg_rating,
    ROUND(AVG(nps_score)::numeric, 2) as avg_nps,
    COUNT(*) FILTER (WHERE nps_score >= 9) as promoters,
    COUNT(*) FILTER (WHERE nps_score BETWEEN 7 AND 8) as passives,
    COUNT(*) FILTER (WHERE nps_score <= 6) as detractors,
    ROUND(
        ((COUNT(*) FILTER (WHERE nps_score >= 9)::numeric -
          COUNT(*) FILTER (WHERE nps_score <= 6)::numeric) /
         NULLIF(COUNT(*)::numeric, 0)) * 100, 1
    ) as nps_calculated,
    COUNT(*) FILTER (WHERE community_interest = 'yes') as community_yes,
    COUNT(*) FILTER (WHERE community_interest = 'maybe') as community_maybe,
    COUNT(*) FILTER (WHERE google_review_clicked = true) as google_reviews_sent,
    ROUND(AVG(continuing_interest)::numeric, 2) as avg_continuing_interest
FROM workshop_surveys;

-- Grant permissions
GRANT ALL ON workshop_surveys TO service_role;
GRANT SELECT ON v_survey_stats TO service_role;

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify: SELECT * FROM workshop_surveys LIMIT 1;
-- 3. Verify: SELECT * FROM v_survey_stats;
-- ============================================
