-- Add personal fields to hanna_business_profiles
ALTER TABLE hanna_business_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE hanna_business_profiles ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('female', 'male', 'non_binary'));
ALTER TABLE hanna_business_profiles ADD COLUMN IF NOT EXISTS country TEXT;
