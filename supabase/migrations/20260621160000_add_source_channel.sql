-- Add source_channel and line_display_name to registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS source_channel    text NOT NULL DEFAULT 'LINE_LIFF',
  ADD COLUMN IF NOT EXISTS line_display_name text;

-- Index for quick filter by channel
CREATE INDEX IF NOT EXISTS idx_registrations_source_channel
  ON public.registrations (source_channel);

COMMENT ON COLUMN public.registrations.source_channel IS
  'GOOGLE_FORM_EXPO | LINE_LIFF_NUMNAKOM | LINE_LIFF_PREMIUM | LINE_LIFF';
