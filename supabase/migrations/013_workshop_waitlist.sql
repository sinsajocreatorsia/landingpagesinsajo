-- ============================================
-- SINSAJO WORKSHOP WAITLIST
-- Migration: 013_workshop_waitlist.sql
-- ============================================

-- Tabla para lista de espera del workshop
CREATE TABLE IF NOT EXISTS workshop_waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    workshop_edition VARCHAR(100) DEFAULT 'next',
    status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'converted', 'cancelled')),
    profile_data JSONB DEFAULT NULL,
    profile_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, workshop_edition)
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON workshop_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON workshop_waitlist(status);

-- RLS
ALTER TABLE workshop_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access" ON workshop_waitlist
    FOR ALL USING (auth.role() = 'service_role');

-- Trigger updated_at (reutiliza función existente)
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON workshop_waitlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
