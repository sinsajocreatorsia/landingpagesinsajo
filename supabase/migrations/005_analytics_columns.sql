-- Add analytics columns to api_usage_logs for smart model routing + feedback tracking
-- These columns support the admin analytics panel and quality metrics

ALTER TABLE api_usage_logs ADD COLUMN IF NOT EXISTS query_category TEXT;
ALTER TABLE api_usage_logs ADD COLUMN IF NOT EXISTS model_selected TEXT;
ALTER TABLE api_usage_logs ADD COLUMN IF NOT EXISTS response_length INTEGER;
ALTER TABLE api_usage_logs ADD COLUMN IF NOT EXISTS user_satisfaction INTEGER;

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_category ON api_usage_logs(query_category);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_plan ON api_usage_logs(user_plan);
