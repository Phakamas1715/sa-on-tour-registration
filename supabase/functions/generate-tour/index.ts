/**
 * generate-tour — DEPRECATED
 *
 * ฟังก์ชันนี้ถูกแทนที่ด้วย generate-receipt
 * This endpoint has been replaced by generate-receipt.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireServiceRole } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authError = requireServiceRole(req, corsHeaders);
  if (authError) return authError;

  return new Response(
    JSON.stringify({
      error: "This endpoint has been replaced. Use generate-receipt instead.",
      replacement: "generate-receipt",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
