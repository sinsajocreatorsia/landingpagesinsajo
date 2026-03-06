-- ============================================
-- Replace FUNDADOR with real coupon codes
-- HannaPro: 50% off first month (any plan)
-- CHICASPRO2026: 100% off first month (workshop)
-- ============================================

-- Rename FUNDADOR to HannaPro (50% off promo general)
UPDATE discount_coupons
SET code = 'HannaPro',
    discount_value = 50,
    applicable_plans = ARRAY['pro', 'business'],
    updated_at = NOW()
WHERE code = 'FUNDADOR';

-- Create CHICASPRO2026 coupon (100% off for workshop participants)
-- This matches the Stripe coupon CHICASPRO2026
INSERT INTO discount_coupons (
  code, discount_type, discount_value, max_uses, times_used,
  valid_from, valid_until, is_active, applicable_plans, source
)
VALUES (
  'CHICASPRO2026',
  'percentage',
  100,
  20,
  0,
  NOW(),
  '2026-12-31 23:59:59+00',
  true,
  ARRAY['pro'],
  'workshop'
)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- INSTRUCTIONS:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify Stripe has matching coupons:
--    - HannaPro (50% off, once)
--    - CHICASPRO2026 (100% off, once)
-- 3. Test: /hanna/upgrade should show HannaPro promo
-- 4. Test: /academy/workshop/feedback sends CHICASPRO2026
-- ============================================
