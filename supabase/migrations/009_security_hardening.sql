-- ============================================
-- Security Hardening Migration
-- Fixes: coupon race condition, atomic message limits
-- ============================================

-- ============================================
-- 1. Atomic coupon redemption function
-- Replaces non-atomic check-update-record-increment
-- with a single transactional operation using SELECT FOR UPDATE
-- ============================================

CREATE OR REPLACE FUNCTION redeem_coupon(
    p_coupon_code TEXT,
    p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_coupon RECORD;
    v_existing_redemption UUID;
    v_plan_expires_at TIMESTAMPTZ;
BEGIN
    -- Lock the coupon row to prevent concurrent redemptions
    SELECT * INTO v_coupon
    FROM hanna_coupons
    WHERE code = UPPER(p_coupon_code)
      AND is_active = true
    FOR UPDATE;

    IF v_coupon IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cupon no valido o inactivo');
    END IF;

    -- Check max uses
    IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cupon agotado');
    END IF;

    -- Check expiry
    IF v_coupon.valid_until IS NOT NULL AND NOW() > v_coupon.valid_until THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cupon expirado');
    END IF;

    -- Check if already redeemed by this user
    SELECT id INTO v_existing_redemption
    FROM hanna_coupon_redemptions
    WHERE coupon_id = v_coupon.id AND user_id = p_user_id;

    IF v_existing_redemption IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Ya usaste este cupon');
    END IF;

    -- Calculate expiry for free months coupons
    IF v_coupon.discount_type = 'free_months' AND v_coupon.free_months > 0 THEN
        v_plan_expires_at := NOW() + (v_coupon.free_months || ' months')::INTERVAL;
    END IF;

    -- All checks passed: perform all updates atomically

    -- 1. Update user profile to Pro
    UPDATE profiles SET
        plan = 'pro',
        subscription_status = 'active',
        plan_started_at = NOW(),
        plan_expires_at = v_plan_expires_at
    WHERE id = p_user_id;

    -- 2. Record the redemption
    INSERT INTO hanna_coupon_redemptions (coupon_id, user_id)
    VALUES (v_coupon.id, p_user_id);

    -- 3. Increment coupon usage count
    UPDATE hanna_coupons SET current_uses = current_uses + 1
    WHERE id = v_coupon.id;

    RETURN jsonb_build_object(
        'success', true,
        'free_months', COALESCE(v_coupon.free_months, 0),
        'plan_expires_at', v_plan_expires_at,
        'message', CASE
            WHEN v_coupon.free_months > 0
            THEN 'Tienes ' || v_coupon.free_months || ' meses gratis de Hanna Pro'
            ELSE 'Cupon aplicado correctamente'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Atomic message count increment function
-- (Only created if it doesn't already exist)
-- Replaces the non-atomic read-check-update in chat route
-- ============================================

CREATE OR REPLACE FUNCTION increment_message_count_v2(
    p_user_id UUID
) RETURNS TABLE(can_send BOOLEAN, messages_remaining INT, user_plan TEXT) AS $$
DECLARE
    v_profile RECORD;
    v_today TEXT;
    v_messages_today INT;
    v_limit INT := 15;
BEGIN
    v_today := to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD');

    -- Lock the profile row to prevent concurrent increments
    SELECT plan, messages_today, last_message_date
    INTO v_profile
    FROM profiles
    WHERE id = p_user_id
    FOR UPDATE;

    -- No profile found: allow (fail-open) with free defaults
    IF NOT FOUND THEN
        can_send := true;
        messages_remaining := v_limit;
        user_plan := 'free';
        RETURN NEXT;
        RETURN;
    END IF;

    -- Pro users: unlimited
    IF v_profile.plan = 'pro' THEN
        can_send := true;
        messages_remaining := 999;
        user_plan := 'pro';
        RETURN NEXT;
        RETURN;
    END IF;

    -- Calculate current count (reset if new day)
    IF v_profile.last_message_date = v_today THEN
        v_messages_today := COALESCE(v_profile.messages_today, 0);
    ELSE
        v_messages_today := 0;
    END IF;

    -- Check limit
    IF v_messages_today >= v_limit THEN
        can_send := false;
        messages_remaining := 0;
        user_plan := 'free';
        RETURN NEXT;
        RETURN;
    END IF;

    -- Increment atomically
    UPDATE profiles SET
        messages_today = v_messages_today + 1,
        last_message_date = v_today
    WHERE id = p_user_id;

    can_send := true;
    messages_remaining := v_limit - v_messages_today - 1;
    user_plan := 'free';
    RETURN NEXT;
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
