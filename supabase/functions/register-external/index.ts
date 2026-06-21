/**
 * Public API endpoint: receives registration data from Google Apps Script
 * (or any external source) and writes it into the Master Register (registrations table).
 *
 * Security: caller must include `x-api-key: <EXTERNAL_API_KEY>` header.
 * Set EXTERNAL_API_KEY in Supabase Dashboard → Edge Functions → Secrets.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serverMisconfigured, unauthorized } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── API key guard ───────────────────────────────────────────────────────
    const expectedKey = Deno.env.get("EXTERNAL_API_KEY");
    if (!expectedKey) {
      return serverMisconfigured("EXTERNAL_API_KEY is not configured", corsHeaders);
    }

    const providedKey = req.headers.get("x-api-key");
    if (providedKey !== expectedKey) {
      return unauthorized(corsHeaders);
    }

    // ── Parse body ──────────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      source_channel = "GOOGLE_FORM_EXPO",
      full_name,
      phone,
      line_id = "",
      email = "",
      province = "",
      district = "",
      occupation = "",
      interest_topic = "",
      ticket_type = "expo",
      notes = "",
      line_display_name = "",
      needs_receipt = "",
      receipt_name = "",
      receipt_tax_id = "",
      receipt_address = "",
      payment_method = "",
      payment_datetime = "",
      payment_amount = "",
      payment_proof_url = "",
    } = body as Record<string, string>;

    if (!full_name || !phone) {
      return new Response(
        JSON.stringify({ error: "full_name and phone are required" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Dedup: phone already exists? → return existing code ────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing } = await supabase
      .from("registrations")
      .select("registration_code, source_channel")
      .eq("phone", String(phone).trim())
      .maybeSingle();

    if (existing) {
      console.log(`Duplicate phone ${phone} → returning existing ${existing.registration_code}`);
      return new Response(
        JSON.stringify({
          registration_code: existing.registration_code,
          duplicate: true,
          original_channel: existing.source_channel,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Insert new registration ─────────────────────────────────────────────
    // "ต้องการ" → true, anything else → false
    const needsReceiptBool = String(needs_receipt).trim() === "ต้องการ";

    const payload = {
      source_channel: String(source_channel).trim(),
      full_name: String(full_name).trim(),
      phone: String(phone).trim(),
      line_id: String(line_id).trim(),
      email: String(email).trim() || null,
      province: String(province).trim() || null,
      district: String(district).trim() || null,
      occupation: String(occupation).trim() || null,
      interest_topic: String(interest_topic).trim() || null,
      ticket_type: String(ticket_type).trim() || null,
      notes: String(notes).trim() || null,
      line_display_name: String(line_display_name).trim() || null,
      needs_receipt: needsReceiptBool,
      receipt_name: String(receipt_name).trim() || null,
      receipt_tax_id: String(receipt_tax_id).trim() || null,
      receipt_address: String(receipt_address).trim() || null,
      payment_method: String(payment_method).trim() || null,
      payment_datetime: String(payment_datetime).trim() || null,
      payment_amount: String(payment_amount).trim() || null,
      payment_proof_url: String(payment_proof_url).trim() || null,
      consent: true,
      status: "new",
    };

    const { data: row, error } = await supabase
      .from("registrations")
      .insert(payload)
      .select("registration_code")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`New registration from ${source_channel}: ${row.registration_code}`);
    return new Response(
      JSON.stringify({ registration_code: row.registration_code, duplicate: false }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("register-external error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
