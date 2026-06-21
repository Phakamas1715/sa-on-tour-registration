export const jsonHeaders = { "Content-Type": "application/json" };

export function unauthorized(headers: HeadersInit = {}) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...headers, ...jsonHeaders },
  });
}

export function serverMisconfigured(message: string, headers: HeadersInit = {}) {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { ...headers, ...jsonHeaders },
  });
}

export function isAuthorizedServiceRoleRequest(req: Request) {
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) return false;
  return req.headers.get("authorization") === `Bearer ${serviceRoleKey}`;
}

export function requireServiceRole(req: Request, headers: HeadersInit = {}) {
  if (!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    return serverMisconfigured("SUPABASE_SERVICE_ROLE_KEY is not configured", headers);
  }
  if (!isAuthorizedServiceRoleRequest(req)) {
    return unauthorized(headers);
  }
  return null;
}

export async function verifyLineSignature(bodyText: string, signature: string | null) {
  const channelSecret = Deno.env.get("LINE_CHANNEL_SECRET");
  if (!channelSecret || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(bodyText));
  const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(digest)));

  return timingSafeEqual(signature, expectedSignature);
}

function timingSafeEqual(a: string, b: string) {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;

  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}
