/**
 * notify-discord — แจ้งเตือนการจองผ่าน Discord Webhook
 *
 * เหตุการณ์ที่รองรับ:
 * - new_registration: มีผู้ลงทะเบียนใหม่
 * - deposit_approved: อนุมัติมัดจำแล้ว
 *
 * ถ้า DISCORD_WEBHOOK_URL ไม่ได้ตั้งค่า → คืน { skipped: true } โดยไม่ error
 * Security: Service Role Key
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireServiceRole } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyPayload {
  event_type?: "new_registration" | "deposit_approved";
  registration_code?: string;
  full_name?: string;
  phone?: string;
  source_channel?: string;
  referrer_name?: string;
  payment_amount?: string | number;
  status?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authError = requireServiceRole(req, corsHeaders);
  if (authError) return authError;

  try {
    const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
    if (!DISCORD_WEBHOOK_URL) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "DISCORD_WEBHOOK_URL not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as NotifyPayload;
    const {
      event_type = "new_registration",
      registration_code,
      full_name,
      phone,
      source_channel,
      referrer_name,
      payment_amount,
      status,
    } = body;

    const isDeposit = event_type === "deposit_approved";
    const appOrigin = (Deno.env.get("APP_ORIGIN") || "https://bookingworkshop-agent.lovable.app").replace(/\/$/, "");
    const adminUrl = `${appOrigin}/admin`;

    const fields = [
      { name: "👤 ชื่อ", value: full_name || "-", inline: true },
      { name: "🔑 รหัส", value: registration_code || "-", inline: true },
      { name: "📱 เบอร์", value: phone || "-", inline: true },
      { name: "📣 ช่องทาง", value: source_channel || "LINE_LIFF", inline: true },
    ];

    if (referrer_name) {
      fields.push({ name: "🎤 วิทยากร", value: referrer_name, inline: true });
    }
    if (payment_amount) {
      fields.push({
        name: "💰 มัดจำ",
        value: `฿${Number(payment_amount).toLocaleString("th-TH", { maximumFractionDigits: 0 })}`,
        inline: true,
      });
    }
    if (status) {
      fields.push({ name: "📊 สถานะ", value: status, inline: true });
    }

    const embed = {
      title: isDeposit ? "✅ อนุมัติมัดจำแล้ว!" : "📋 การจองใหม่เข้ามา!",
      color: isDeposit ? 0x16a34a : 0xf59e0b,
      fields,
      timestamp: new Date().toISOString(),
      footer: { text: "SA-ON Tour Workshop · Admin" },
    };

    const discordBody = {
      content: isDeposit
        ? `✅ **ยืนยันมัดจำสำเร็จ!** · [Admin Dashboard](${adminUrl})`
        : `🔔 **มีการจองใหม่!** · [Admin Dashboard](${adminUrl})`,
      embeds: [embed],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordBody),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Discord webhook failed [${res.status}]: ${text}`);
    }

    await res.text();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("notify-discord error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
