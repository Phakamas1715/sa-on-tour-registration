-- Add LINE user ID captured from LIFF SDK
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS line_user_id text;
