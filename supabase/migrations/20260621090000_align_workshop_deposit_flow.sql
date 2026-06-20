-- Align Smart Business AI Workshop flow with the production deposit/check-in states.

ALTER TABLE public.registrations
  ALTER COLUMN status SET DEFAULT 'WAIT_DEPOSIT';

ALTER TABLE public.coupons
  ALTER COLUMN status SET DEFAULT 'locked';

UPDATE public.registrations
SET status = 'WAIT_DEPOSIT'
WHERE status = 'new';

UPDATE public.coupons
SET status = 'locked'
WHERE status = 'issued';

CREATE UNIQUE INDEX IF NOT EXISTS payments_registration_id_unique
  ON public.payments (registration_id);

CREATE UNIQUE INDEX IF NOT EXISTS checkins_registration_id_unique
  ON public.checkins (registration_id);

CREATE OR REPLACE FUNCTION public.create_coupon_for_registration()
RETURNS TRIGGER AS $$
DECLARE
  v_token TEXT;
BEGIN
  v_token := md5(random()::text || NEW.id::text || clock_timestamp()::text);

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
    'Smart Business AI Workshop 2026 Coupon',
    3000.00,
    2999.00,
    'locked'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
