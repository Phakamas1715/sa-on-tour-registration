-- Add new registration statuses
ALTER TYPE public.registration_status ADD VALUE IF NOT EXISTS 'wait_deposit';
ALTER TYPE public.registration_status ADD VALUE IF NOT EXISTS 'checked_in';

-- Add new columns to registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS system_prompt  text,
  ADD COLUMN IF NOT EXISTS checked_in_at timestamptz;

-- ── Coupons table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  token           text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status          text NOT NULL DEFAULT 'locked'
                    CHECK (status IN ('locked', 'active', 'used')),
  value           integer NOT NULL DEFAULT 3000,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

GRANT ALL  ON public.coupons TO service_role;
GRANT SELECT ON public.coupons TO authenticated;

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER coupons_set_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Auto-create coupon after registration insert ───────────────────────────
CREATE OR REPLACE FUNCTION public.create_coupon_on_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.coupons (registration_id, token, status, value)
  VALUES (NEW.id, encode(gen_random_bytes(16), 'hex'), 'locked', 3000);
  RETURN NEW;
END;
$$;

CREATE TRIGGER registration_create_coupon
AFTER INSERT ON public.registrations
FOR EACH ROW EXECUTE FUNCTION public.create_coupon_on_registration();

-- ── Approve deposit: set status=paid, unlock coupon, return metadata ───────
CREATE OR REPLACE FUNCTION public.approve_deposit(_registration_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_code  text;
  v_name  text;
  v_luid  text;
BEGIN
  UPDATE public.registrations
  SET status = 'paid', updated_at = now()
  WHERE id = _registration_id
  RETURNING registration_code, full_name, line_user_id INTO v_code, v_name, v_luid;

  UPDATE public.coupons
  SET status = 'active', updated_at = now()
  WHERE registration_id = _registration_id
  RETURNING token INTO v_token;

  RETURN jsonb_build_object(
    'token',             v_token,
    'registration_code', v_code,
    'full_name',         v_name,
    'line_user_id',      v_luid
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_deposit(uuid) TO authenticated;

-- ── Check-in: mark as checked_in, consume coupon ──────────────────────────
CREATE OR REPLACE FUNCTION public.checkin_registration(_registration_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.registrations
  SET status = 'checked_in', checked_in_at = now(), updated_at = now()
  WHERE id = _registration_id;

  UPDATE public.coupons
  SET status = 'used', updated_at = now()
  WHERE registration_id = _registration_id AND status = 'active';

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.checkin_registration(uuid) TO authenticated;
