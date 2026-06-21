import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
    if (!DISCORD_WEBHOOK_URL) {
      throw new Error("DISCORD_WEBHOOK_URL is not configured");
    }

    const { contact_name, org_name, destination, num_travelers, budget_per_person, contact_phone } =
      await req.json();

    const adminUrl = "https://bookingworkshop-agent.lovable.app/admin";

    const embed = {
      title: "📋 ใบเสนอราคาใหม่!",
      color: 0x2563eb,
      fields: [
        { name: "👤 ชื่อผู้ติดต่อ", value: contact_name || "-", inline: true },
        { name: "🏢 องค์กร", value: org_name || "-", inline: true },
        { name: "✈️ ปลายทาง", value: destination || "-", inline: true },
        { name: "👥 จำนวน", value: `${num_travelers || 0} คน`, inline: true },
        {
          name: "💰 งบ/คน",
          value: budget_per_person ? `฿${Number(budget_per_person).toLocaleString()}` : "ไม่ระบุ",
          inline: true,
        },
        { name: "📞 โทร", value: contact_phone || "-", inline: true },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "Regent Holiday CRM" },
    };

    const discordBody = {
      content: `🔔 **มีคำขอใบเสนอราคาใหม่!**\n👉 [เข้าระบบ Admin](${adminUrl})`,
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
    console.error("Discord notify error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
