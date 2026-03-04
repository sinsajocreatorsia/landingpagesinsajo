-- ============================================
-- ADD SUPERADMIN: ceo.sinsajo.creators@gmail.com
-- Migration: 014_add_superadmin_ceo_gmail.sql
-- ============================================

-- Add CEO Gmail to admin whitelist
INSERT INTO admin_emails (email)
VALUES ('ceo.sinsajo.creators@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- If user already exists in auth.users, promote immediately
INSERT INTO admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'ceo.sinsajo.creators@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. If user hasn't signed up yet, the trigger
--    auto_create_admin_user will promote them
--    automatically when they register
-- 3. Login with ceo.sinsajo.creators@gmail.com
-- 4. Go to /admin to access the panel
-- ============================================
