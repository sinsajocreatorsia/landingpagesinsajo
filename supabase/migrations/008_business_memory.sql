-- ============================================
-- Migration: 008_business_memory.sql
-- Description: Business Memory System for Hanna Pro
-- Creates tables for long-term memory and session summaries
-- ============================================

-- ============================================
-- 1. Business Memory (long-term facts)
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_user_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'business_info', 'goal', 'decision', 'metric',
        'insight', 'action_item', 'preference', 'challenge'
    )),
    content TEXT NOT NULL,
    source_session_id UUID REFERENCES hanna_sessions(id) ON DELETE SET NULL,
    confidence REAL DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
    is_active BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_hanna_user_memory_user_id
    ON hanna_user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_hanna_user_memory_category
    ON hanna_user_memory(user_id, category);
CREATE INDEX IF NOT EXISTS idx_hanna_user_memory_active
    ON hanna_user_memory(user_id, is_active) WHERE is_active = true;

-- ============================================
-- 2. Session Summaries (medium-term context)
-- ============================================
CREATE TABLE IF NOT EXISTS hanna_session_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES hanna_sessions(id) ON DELETE CASCADE UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    key_topics TEXT[] DEFAULT '{}',
    action_items TEXT[] DEFAULT '{}',
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_hanna_session_summaries_user_id
    ON hanna_session_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_hanna_session_summaries_created_at
    ON hanna_session_summaries(user_id, created_at DESC);

-- ============================================
-- 3. RLS Policies
-- ============================================
ALTER TABLE hanna_user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE hanna_session_summaries ENABLE ROW LEVEL SECURITY;

-- Memory: Users can only access their own memory
CREATE POLICY "Users can view own memory" ON hanna_user_memory
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own memory" ON hanna_user_memory
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memory" ON hanna_user_memory
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memory" ON hanna_user_memory
    FOR DELETE USING (auth.uid() = user_id);

-- Session Summaries: Users can only access their own summaries
CREATE POLICY "Users can view own summaries" ON hanna_session_summaries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own summaries" ON hanna_session_summaries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. Trigger for updated_at on memory
-- ============================================
DROP TRIGGER IF EXISTS update_hanna_user_memory_updated_at ON hanna_user_memory;
CREATE TRIGGER update_hanna_user_memory_updated_at
    BEFORE UPDATE ON hanna_user_memory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Grants for service role
-- ============================================
GRANT ALL ON hanna_user_memory TO service_role;
GRANT ALL ON hanna_session_summaries TO service_role;
