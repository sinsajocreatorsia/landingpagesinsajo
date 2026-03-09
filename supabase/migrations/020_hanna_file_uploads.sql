-- File uploads table for Hanna (Pro/Business plans)
CREATE TABLE IF NOT EXISTS hanna_file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES hanna_sessions(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for daily limit check
CREATE INDEX idx_file_uploads_user_date ON hanna_file_uploads(user_id, created_at);

-- RLS
ALTER TABLE hanna_file_uploads ENABLE ROW LEVEL SECURITY;

-- Users can view their own uploads
CREATE POLICY "Users can view own uploads" ON hanna_file_uploads
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert (API route uses supabaseAdmin)
CREATE POLICY "Service role can insert uploads" ON hanna_file_uploads
    FOR INSERT WITH CHECK (true);

-- Add attachment columns to hanna_messages for linking files to messages
ALTER TABLE hanna_messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE hanna_messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;
ALTER TABLE hanna_messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;

-- Storage bucket (run in Supabase Dashboard > Storage if this doesn't work via migration)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('hanna-uploads', 'hanna-uploads', true)
-- ON CONFLICT DO NOTHING;
