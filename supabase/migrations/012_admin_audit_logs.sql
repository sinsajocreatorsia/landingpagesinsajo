-- Admin Audit Logs - Track all admin actions for accountability
-- Created as part of security hardening

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_admin_user ON admin_audit_logs(admin_user_id);
CREATE INDEX idx_audit_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_target ON admin_audit_logs(target_type, target_id);

-- RLS: Only admins can read, only service_role can write
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- No INSERT/UPDATE/DELETE policies for regular users
-- All writes go through service_role (supabaseAdmin) from the API
