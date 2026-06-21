# Security Memory

## App Overview

Public landing page for a paid "สะออนทัวร์" workshop in Khon Kaen. Anonymous visitors submit a registration form; signed-in admins manage submissions at `/admin` and `/checkin`. The app also has LINE bot integration, an AI-powered tour generator, a Discord notification function, and an external registration API for Google Forms.

## Access Control Model

### Database (RLS)

- `registrations`: RLS on. INSERT allowed to anon+authenticated for the public form. SELECT/UPDATE/DELETE restricted to users with the `admin` role via `has_role()`.
- `user_roles`: RLS on. Users can SELECT their own roles only. Writes happen via service role or the `claim_first_admin()` bootstrap.
- `coupons`: RLS on. Admin-only via `has_role()`.
- `has_role(uuid, app_role)`: SECURITY DEFINER, granted EXECUTE to anon+authenticated so RLS policies can use it. Returns boolean only.
- `claim_first_admin()`: SECURITY DEFINER, granted to authenticated. No-op once any admin exists.

### Server Functions (TanStack Start)

- `createRegistration`: Uses service role (`supabaseAdmin`) server-side. This is intentional for public form inserts and is validated with Zod.
- `listRegistrations`, `updateRegistrationStatus`, `approveDeposit`, `checkinRegistration`, `lookupForCheckin`: protected by `requireSupabaseAuth` middleware and an explicit `has_role` admin check inside the handler.
- `checkIsAdmin`, `claimFirstAdmin`: protected by `requireSupabaseAuth`.

### Edge Functions (Supabase)

- `generate-tour`: Protected by `requireServiceRole`, which checks `SUPABASE_SERVICE_ROLE_KEY` in the `Authorization` header. Fails closed if the key is not configured.
- `notify-discord`: Protected by `requireServiceRole`. Fails closed if the key is not configured.
- `payment-agent`: Protected by `requireServiceRole`. Fails closed if the key is not configured.
- `send-line-message`: Protected by `requireServiceRole`. Fails closed if the key is not configured. Reads `APP_ORIGIN` from env var only.
- `register-external`: Protected by `x-api-key` header checked against `EXTERNAL_API_KEY`. Fails closed if the key is not configured.
- `line-bot`: Protected by LINE HMAC-SHA256 signature verification (`verifyLineSignature`). Fails if `LINE_CHANNEL_SECRET` is not set.

## Intentional / Accepted

- Public INSERT on `registrations` with `WITH CHECK (true)` is intentional because the registration form must accept anonymous submissions. Do not flag it.
- `has_role` and `claim_first_admin` being EXECUTE-able by authenticated/anon is required by the user-roles pattern. Do not flag as SECURITY DEFINER exposure.
- Supabase publishable/anon keys in `VITE_` prefixed variables are intentional. Do not flag.
- `Access-Control-Allow-Origin: *` on edge functions is acceptable because all endpoints require auth credentials.

## Must Never Happen

- Anonymous or non-admin SELECT/UPDATE/DELETE on `registrations`, which would leak PII such as phone, LINE ID, and email.
- Privilege escalation to admin without going through `claim_first_admin` or service role.
- Service role key or admin Supabase client reaching the browser bundle.
- Unauthenticated callers triggering LINE push messages through `payment-agent` or `send-line-message`.
- Fake LINE webhook events being processed without signature verification in `line-bot`.
- `register-external` allowing inserts when `EXTERNAL_API_KEY` is not configured.
- Edge functions consuming AI API credits without proper auth, especially `generate-tour` and `line-bot`.

## Post-Deploy Verification

- Fake POST to `line-bot` without `X-Line-Signature` must return `401`.
- `payment-agent`, `send-line-message`, `generate-tour`, and `notify-discord` must reject callers without service-role bearer auth.
- `register-external` must reject callers without `x-api-key`.
