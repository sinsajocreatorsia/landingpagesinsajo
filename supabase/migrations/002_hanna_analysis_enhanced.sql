-- ============================================
-- SINSAJO WORKSHOP DATABASE SCHEMA
-- Migration: 002_hanna_analysis_enhanced.sql
-- Enhancement for Hanna's profile analysis
-- ============================================

-- Add new columns to hanna_analysis for profile analysis
ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS analysis_type VARCHAR(50) DEFAULT 'conversation'
    CHECK (analysis_type IN ('conversation', 'profile', 'combined'));

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS summary TEXT;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS readiness_score INTEGER
    CHECK (readiness_score BETWEEN 1 AND 10);

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS key_insights JSONB DEFAULT '[]'::jsonb;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS challenges_prioritized JSONB DEFAULT '[]'::jsonb;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS recommended_focus TEXT;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS potential_quick_wins JSONB DEFAULT '[]'::jsonb;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS customized_tips JSONB DEFAULT '[]'::jsonb;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS engagement_level_text VARCHAR(20)
    CHECK (engagement_level_text IN ('high', 'medium', 'low'));

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS follow_up_suggestions JSONB DEFAULT '[]'::jsonb;

ALTER TABLE hanna_analysis ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE;

-- Create unique index for registration_id + analysis_type to allow one analysis per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_analysis_registration_type
    ON hanna_analysis(registration_id, analysis_type);

-- Update the view for registration overview to include new analysis data
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
    p.profile_completion_percentage,
    a.readiness_score,
    a.engagement_level_text as ai_engagement_level,
    a.summary as ai_summary,
    a.recommended_focus as ai_recommended_focus,
    a.follow_up_priority,
    (SELECT COUNT(*) FROM hanna_conversations c WHERE c.registration_id = r.id) as conversation_count
FROM workshop_registrations r
LEFT JOIN workshop_profiles p ON p.registration_id = r.id
LEFT JOIN hanna_analysis a ON a.registration_id = r.id AND a.analysis_type = 'profile';

-- Create a view for detailed analysis
CREATE OR REPLACE VIEW v_participant_analysis AS
SELECT
    r.id as registration_id,
    r.email,
    r.full_name,
    p.business_name,
    p.industry,
    p.years_in_business,
    p.team_size,
    p.challenges,
    p.primary_goal,
    p.ai_experience,
    a.analysis_type,
    a.summary,
    a.readiness_score,
    a.key_insights,
    a.challenges_prioritized,
    a.recommended_focus,
    a.potential_quick_wins,
    a.customized_tips,
    a.engagement_level_text,
    a.follow_up_suggestions,
    a.follow_up_priority,
    a.analyzed_at
FROM workshop_registrations r
JOIN workshop_profiles p ON p.registration_id = r.id
LEFT JOIN hanna_analysis a ON a.registration_id = r.id
WHERE r.payment_status = 'completed';

-- Create a summary statistics view
CREATE OR REPLACE VIEW v_analysis_stats AS
SELECT
    COUNT(*) as total_participants,
    COUNT(CASE WHEN a.analysis_type = 'profile' THEN 1 END) as analyzed_profiles,
    AVG(a.readiness_score)::DECIMAL(3,1) as avg_readiness_score,
    COUNT(CASE WHEN a.engagement_level_text = 'high' THEN 1 END) as high_engagement_count,
    COUNT(CASE WHEN a.engagement_level_text = 'medium' THEN 1 END) as medium_engagement_count,
    COUNT(CASE WHEN a.engagement_level_text = 'low' THEN 1 END) as low_engagement_count,
    COUNT(CASE WHEN a.follow_up_priority = 'high' THEN 1 END) as high_priority_followups
FROM workshop_registrations r
LEFT JOIN hanna_analysis a ON a.registration_id = r.id AND a.analysis_type = 'profile'
WHERE r.payment_status = 'completed';
