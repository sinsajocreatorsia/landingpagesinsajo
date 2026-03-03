-- ============================================
-- Migration: Add 'business' plan support
-- ============================================

-- Add index on plan column for admin dashboard stats queries
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles (plan);

-- Update the increment_message_count_v2 function to support business plan
-- Business users (like Pro) get unlimited messages
CREATE OR REPLACE FUNCTION increment_message_count_v2(p_user_id UUID)
RETURNS TABLE(can_send BOOLEAN, messages_remaining INTEGER, user_plan TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan TEXT;
  v_messages_today INTEGER;
  v_last_message_date DATE;
  v_today DATE := CURRENT_DATE;
  v_limit INTEGER := 15;
BEGIN
  -- Lock the row to prevent race conditions
  SELECT plan, messages_today, last_message_date::date
  INTO v_plan, v_messages_today, v_last_message_date
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- If user not found, allow with free defaults
  IF NOT FOUND THEN
    RETURN QUERY SELECT true, 15, 'free'::TEXT;
    RETURN;
  END IF;

  -- Pro and Business users have unlimited messages
  IF v_plan = 'pro' OR v_plan = 'business' THEN
    RETURN QUERY SELECT true, 999, v_plan;
    RETURN;
  END IF;

  -- Reset count if new day
  IF v_last_message_date IS NULL OR v_last_message_date < v_today THEN
    v_messages_today := 0;
  END IF;

  -- Check limit
  IF v_messages_today >= v_limit THEN
    RETURN QUERY SELECT false, 0, v_plan;
    RETURN;
  END IF;

  -- Increment count
  UPDATE profiles
  SET messages_today = v_messages_today + 1,
      last_message_date = v_today::text
  WHERE id = p_user_id;

  RETURN QUERY SELECT true, (v_limit - v_messages_today - 1)::INTEGER, v_plan;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION increment_message_count_v2 IS 'Atomic message counter supporting free (15/day), pro (unlimited), and business (unlimited) plans';
