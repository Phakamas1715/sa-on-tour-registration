-- Add payment, receipt, and ticket columns to registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS ticket_type       text,
  ADD COLUMN IF NOT EXISTS needs_receipt     boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS receipt_name      text,
  ADD COLUMN IF NOT EXISTS receipt_tax_id    text,
  ADD COLUMN IF NOT EXISTS receipt_address   text,
  ADD COLUMN IF NOT EXISTS payment_method    text,
  ADD COLUMN IF NOT EXISTS payment_datetime  text,
  ADD COLUMN IF NOT EXISTS payment_amount    text,
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS notes             text;
