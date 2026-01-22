-- Migration: Create workshop_registrations table
-- Description: Stores workshop payment registrations from Stripe and PayPal
-- Date: 2026-01-22

-- Create the workshop_registrations table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal')),
  payment_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  workshop_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_email ON workshop_registrations(email);

-- Create index for payment_id lookups
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_payment_id ON workshop_registrations(payment_id);

-- Enable Row Level Security
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from authenticated API calls (service role)
CREATE POLICY "Allow service role insert" ON workshop_registrations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow service role to read all registrations
CREATE POLICY "Allow service role select" ON workshop_registrations
  FOR SELECT
  TO service_role
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_workshop_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_workshop_registrations_updated_at
  BEFORE UPDATE ON workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_registrations_updated_at();

-- Comment on table
COMMENT ON TABLE workshop_registrations IS 'Stores workshop payment registrations from Stripe and PayPal';
