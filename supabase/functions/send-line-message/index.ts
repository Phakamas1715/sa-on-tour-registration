import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type MessageRequest = {
  to: string;
  type: "registration_success" | "payment_confirmed";
  data?: Record<string, unknown>;
  app_origin?: string;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function money(value: unknown) {
  const amount = Number(value || 0);
  return amount.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

function originFrom(req: Request, body: MessageRequest) {
  if (body.app_origin) return body.app_origin.replace(/\/$/, "");
  const envOrigin = Deno.env.get("APP_ORIGIN") || Deno.env.get("LOVABLE_APP_URL");
  if (envOrigin) return envOrigin.replace(/\/$/, "");

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // Fall through to production default.
    }
  }
  return "https://bookingworkshop-agent.lovable.app";
}

function buildQrUrl(checkinUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`;
}

function registrationSuccessMessage(req: Request, body: MessageRequest) {
  const data = body.data ?? {};
  const registrationCode = text(data.registration_code, "SAON-KK-XXXX");
  const fullName = text(data.full_name, "ผู้ลงทะเบียน");
  const couponToken = text(data.coupon_token);
  const finalPrice = money(data.final_price || 2999);
  const appOrigin = originFrom(req, body);
  const successUrl = `${appOrigin}/success?code=${encodeURIComponent(registrationCode)}${
    couponToken ? `&token=${encodeURIComponent(couponToken)}` : ""
  }`;

  return {
    type: "flex",
    altText: `จองสิทธิ์ ${registrationCode} สำเร็จ รอตรวจสอบมัดจำ`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "จองสิทธิ์สำเร็จ",
            weight: "bold",
            size: "xl",
            color: "#f59e0b",
            align: "center",
          },
          {
            type: "text",
            text: "Smart Business AI Workshop 2026",
            size: "sm",
            color: "#111827",
            weight: "bold",
            align: "center",
            wrap: true,
          },
          {
            type: "text",
            text: "สถานะ: WAIT_DEPOSIT — QR Code จะปลดล็อกหลังเจ้าหน้าที่ตรวจสอบสลิปมัดจำ",
            size: "xs",
            color: "#6b7280",
            align: "center",
            wrap: true,
          },
          { type: "separator", margin: "md" },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              row("รหัส", registrationCode),
              row("ชื่อ", fullName),
              row("ยอดมัดจำ", `${finalPrice} บาท`),
              row("ธนาคาร", "กสิกรไทย 405-3-05346-3 / อัจฉรีญา โถนารัตน์"),
            ],
          },
          {
            type: "text",
            text: "กรุณาโอนมัดจำและส่งรูปสลิปกลับมาที่ LINE เจ้าหน้าที่ เพื่อยืนยันที่นั่งและปลดล็อกคูปอง QR Code",
            size: "xs",
            color: "#dc2626",
            margin: "md",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#f97316",
            action: {
              type: "uri",
              label: "เปิดตั๋วจองสิทธิ์",
              uri: successUrl,
            },
          },
        ],
      },
    },
  };
}

function paymentConfirmedMessage(req: Request, body: MessageRequest) {
  const data = body.data ?? {};
  const registrationCode = text(data.registration_code, "SAON-KK-XXXX");
  const fullName = text(data.full_name, "ผู้ลงทะเบียน");
  const couponToken = text(data.coupon_token);
  const amount = money(data.amount || 2999);
  const appOrigin = originFrom(req, body);
  const checkinUrl = `${appOrigin}/admin/checkin?code=${encodeURIComponent(registrationCode)}${
    couponToken ? `&token=${encodeURIComponent(couponToken)}` : ""
  }`;

  return {
    type: "flex",
    altText: `ยืนยันมัดจำ ${registrationCode} แล้ว`,
    contents: {
      type: "bubble",
      hero: couponToken
        ? {
            type: "image",
            url: buildQrUrl(checkinUrl),
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "fit",
            backgroundColor: "#ffffff",
          }
        : undefined,
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "ปลดล็อก QR Code แล้ว",
            weight: "bold",
            size: "xl",
            color: "#16a34a",
            align: "center",
            wrap: true,
          },
          {
            type: "text",
            text: "แสดง QR Code นี้ให้เจ้าหน้าที่สแกนที่หน้างาน",
            size: "sm",
            color: "#6b7280",
            align: "center",
            wrap: true,
          },
          { type: "separator", margin: "md" },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              row("รหัส", registrationCode),
              row("ชื่อ", fullName),
              row("ชำระแล้ว", `${amount} บาท`),
              row("สถานที่", "KICE Hall 1-2 ห้อง M4-8"),
              row("เวลา", "28 มิ.ย. 2569 เวลา 10.00 - 19.00 น."),
            ],
          },
        ],
      },
    },
  };
}

function row(label: string, value: string) {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: label, size: "sm", color: "#9ca3af", flex: 2 },
      {
        type: "text",
        text: value,
        size: "sm",
        color: "#1f2937",
        weight: "bold",
        flex: 3,
        wrap: true,
      },
    ],
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lineToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    if (!lineToken) {
      throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not configured in Supabase secrets");
    }

    const body = (await req.json()) as MessageRequest;
    if (!body.to) throw new Error("Recipient 'to' (LINE user ID) is required");
    if (!body.type) throw new Error("Message 'type' is required");

    const message =
      body.type === "registration_success"
        ? registrationSuccessMessage(req, body)
        : paymentConfirmedMessage(req, body);

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lineToken}`,
      },
      body: JSON.stringify({
        to: body.to,
        messages: [message],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`LINE API replied with status ${response.status}: ${detail}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-line-message error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
