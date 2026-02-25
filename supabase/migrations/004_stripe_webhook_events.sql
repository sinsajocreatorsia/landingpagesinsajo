-- ============================================
-- Stripe Webhook Events (Idempotency)
-- ============================================
-- Tracks processed Stripe webhook events to prevent
-- duplicate processing of the same event.

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by event_id
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_event_id
    ON stripe_webhook_events(event_id);

-- Grant permissions to service role (used by webhook handler)
GRANT ALL ON stripe_webhook_events TO service_role;

-- Auto-cleanup: events older than 30 days can be safely removed
-- Run this periodically via Supabase cron or pg_cron:
-- DELETE FROM stripe_webhook_events WHERE processed_at < NOW() - INTERVAL '30 days';
