-- ============================================
-- WORKSHOP SURVEYS V2 - New feedback columns
-- Migration: 017_workshop_surveys_v2.sql
-- Adds: learning impact, logistics, expectations, willingness to pay
-- ============================================

-- Section: Learning Impact
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS learned_skills TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS knowledge_before INTEGER CHECK (knowledge_before BETWEEN 1 AND 5);
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS knowledge_after INTEGER CHECK (knowledge_after BETWEEN 1 AND 5);
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS first_implementation VARCHAR(50);
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS implementation_barriers TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Section: Logistics & Expectations
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS expectations_met INTEGER CHECK (expectations_met BETWEEN 1 AND 5);
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS duration_feedback VARCHAR(20) CHECK (duration_feedback IN ('too_short', 'just_right', 'too_long'));
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS schedule_feedback VARCHAR(30) CHECK (schedule_feedback IN ('perfect', 'prefer_morning', 'prefer_afternoon', 'prefer_evening', 'prefer_weekend'));
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS preferred_format VARCHAR(20) CHECK (preferred_format IN ('in_person', 'virtual', 'hybrid', 'series_weekly'));

-- Section: Willingness to pay
ALTER TABLE workshop_surveys ADD COLUMN IF NOT EXISTS willingness_to_pay VARCHAR(20) CHECK (willingness_to_pay IN ('free_only', 'up_to_50', 'up_to_100', 'up_to_200', 'more_than_200'));

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify: SELECT column_name FROM information_schema.columns WHERE table_name = 'workshop_surveys' ORDER BY ordinal_position;
-- ============================================
