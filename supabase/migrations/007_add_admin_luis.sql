-- ============================================
-- Migration 007: Add Super Admin - luis.somarriba.r@gmail.com
-- ============================================
-- This migration adds luis.somarriba.r@gmail.com as super_admin.
-- The auto_create_admin_user trigger (from 001_admin_system.sql) will
-- automatically promote this user to super_admin when they sign up.
-- If they already exist, we promote immediately.

-- 1. Add email to admin whitelist
INSERT INTO admin_emails (email)
VALUES ('luis.somarriba.r@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. If user already exists in auth.users, create admin_users entry
INSERT INTO admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'luis.somarriba.r@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- 3. Give Pro plan to this admin (if profile exists)
UPDATE profiles
SET plan = 'pro',
    subscription_status = 'active',
    plan_started_at = NOW()
WHERE id = (SELECT id FROM auth.users WHERE email = 'luis.somarriba.r@gmail.com');

-- ============================================
-- NOTES:
-- If luis.somarriba.r@gmail.com has NOT signed up yet:
--   - Steps 2 and 3 will affect 0 rows (no user found)
--   - The trigger auto_create_admin_user will fire on signup
--     and automatically promote to super_admin
--   - After signup, run step 3 manually or the auth callback
--     will create a free profile that can be upgraded via admin panel
-- ============================================
