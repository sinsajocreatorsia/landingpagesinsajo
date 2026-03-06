-- =============================================
-- 019: Hanna Strategic Reminders System
-- Only for Pro/Business users
-- =============================================

-- Reminders table
CREATE TABLE IF NOT EXISTS hanna_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES hanna_sessions(id) ON DELETE SET NULL,
  task TEXT NOT NULL,
  strategic_context TEXT,
  approach_suggestion TEXT,
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
  email_sent BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_hanna_reminders_user_status ON hanna_reminders(user_id, status);
CREATE INDEX idx_hanna_reminders_due ON hanna_reminders(due_at) WHERE status = 'pending';
CREATE INDEX idx_hanna_reminders_email ON hanna_reminders(email_sent) WHERE status = 'pending' AND email_sent = FALSE;

-- RLS
ALTER TABLE hanna_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own reminders"
  ON hanna_reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access reminders"
  ON hanna_reminders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_hanna_reminders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hanna_reminders_updated_at
  BEFORE UPDATE ON hanna_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_hanna_reminders_updated_at();
