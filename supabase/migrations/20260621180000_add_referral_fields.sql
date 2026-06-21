-- Add referral fields to registrations table
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS referrer_type    text,
  ADD COLUMN IF NOT EXISTS referrer_name    text,
  ADD COLUMN IF NOT EXISTS campaign_code    text,
  ADD COLUMN IF NOT EXISTS voucher_source   text;

-- Add index on new referral fields for fast querying and dashboard stats
CREATE INDEX IF NOT EXISTS idx_registrations_campaign_code
  ON public.registrations (campaign_code);
