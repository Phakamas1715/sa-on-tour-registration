-- Sequence for registration code
CREATE SEQUENCE IF NOT EXISTS public.registration_code_seq START WITH 1;

-- Registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_code TEXT UNIQUE,
  line_user_id TEXT NOT NULL,
  line_display_name TEXT,
  line_picture_url TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  occupation TEXT,
  business_name TEXT,
  interest_topic TEXT[],
  has_line_oa TEXT,
  wants_coupon BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger to automatically generate registration_code as 'SAON-KK-XXXX' on insert
CREATE OR REPLACE FUNCTION public.set_registration_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_code IS NULL THEN
    NEW.registration_code := 'SAON-KK-' || lpad(nextval('public.registration_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_set_registration_code
  BEFORE INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_registration_code();

-- Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  coupon_code TEXT NOT NULL UNIQUE,
  coupon_token TEXT NOT NULL UNIQUE,
  coupon_qr_url TEXT,
  coupon_name TEXT NOT NULL,
  coupon_value DECIMAL(10,2) NOT NULL DEFAULT 3000.00,
  final_price DECIMAL(10,2) NOT NULL DEFAULT 2999.00,
  status TEXT NOT NULL DEFAULT 'issued',
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Trigger to automatically create a coupon for every new registration
CREATE OR REPLACE FUNCTION public.create_coupon_for_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Generate a random hex token for coupon verification
  v_token := md5(random()::text || NEW.id::text);

  INSERT INTO public.coupons (
    registration_id,
    coupon_code,
    coupon_token,
    coupon_name,
    coupon_value,
    final_price,
    status
  )
  VALUES (
    NEW.id,
    NEW.registration_code,
    v_token,
    'Smart Business Expo 2026 Coupon',
    3000.00,
    2999.00,
    'issued'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_create_coupon_for_registration
  AFTER INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_coupon_for_registration();

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 2999.00,
  payment_method TEXT NOT NULL, -- cash, transfer, promptpay, other
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, refunded
  paid_at TIMESTAMP WITH TIME ZONE,
  admin_note TEXT
);

-- Checkins table
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  checked_in_by TEXT,
  status TEXT NOT NULL DEFAULT 'completed'
);

-- Line Messages log table
CREATE TABLE IF NOT EXISTS public.line_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
  line_user_id TEXT NOT NULL,
  message_type TEXT NOT NULL,
  sent_status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- registrations: Anyone can insert (signup), authenticated users can read/write
CREATE POLICY "Anyone can register for workshop"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage registrations"
  ON public.registrations FOR ALL
  TO authenticated
  USING (true);

-- coupons: Anyone can read (for QR code details check), authenticated users can manage
CREATE POLICY "Anyone can view coupons"
  ON public.coupons FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (true);

-- payments: authenticated only
CREATE POLICY "Authenticated users can manage payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (true);

-- checkins: authenticated only
CREATE POLICY "Authenticated users can manage checkins"
  ON public.checkins FOR ALL
  TO authenticated
  USING (true);

-- line_messages: authenticated only
CREATE POLICY "Authenticated users can manage line_messages"
  ON public.line_messages FOR ALL
  TO authenticated
  USING (true);
