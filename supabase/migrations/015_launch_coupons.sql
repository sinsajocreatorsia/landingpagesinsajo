-- ============================================
-- Migration: Launch promotion coupons
-- Promo: First 50 users get discounted first month
-- Pro: $19.99 -> $9.99 (50% off)
-- Business: $49 -> $19.99 (59% off)
-- ============================================

-- Public coupon code that users enter
-- Backend maps to the correct Stripe coupon based on selected plan
INSERT INTO discount_coupons (
  id, code, discount_type, discount_value, max_uses, times_used,
  valid_from, valid_until, is_active, applicable_plans
)
VALUES (
  gen_random_uuid(),
  'FUNDADOR',
  'percentage',
  50,
  50,
  0,
  NOW(),
  '2026-04-30 23:59:59+00',
  true,
  ARRAY['pro', 'business']
);
