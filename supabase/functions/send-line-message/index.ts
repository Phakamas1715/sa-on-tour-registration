import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not configured in Supabase secrets");
    }

    const { to, type, data } = await req.json();
    if (!to) throw new Error("Recipient 'to' (LINE user ID) is required");
    if (!type) throw new Error("Message 'type' is required");

    let messages: any[] = [];

    if (type === "registration_success") {
      const { registration_code, full_name, coupon_token, final_price } = data;

      // Construct QR Code URL
      const appUrl = req.headers.get("referer") || "https://bookingworkshop-agent.lovable.app";
      const checkinUrl = `${new URL(appUrl).origin}/admin/checkin?code=${registration_code}&token=${coupon_token}`;
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`;

      messages = [
        {
          type: "flex",
          altText: "ลงทะเบียนสะออนทัวร์ Workshop สำเร็จ!",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: qrImageUrl,
              size: "full",
              aspectRatio: "1:1",
              aspectMode: "fit",
              backgroundColor: "#ffffff"
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "ลงทะเบียนสำเร็จ 🎉",
                  weight: "bold",
                  size: "xl",
                  color: "#16a34a",
                  align: "center"
                },
                {
                  type: "text",
                  text: "นี่คือ QR Code คูปองส่วนตัวของคุณ",
                  size: "sm",
                  color: "#6b7280",
                  align: "center"
                },
                {
                  type: "separator",
                  margin: "md"
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: [
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "รหัสลงทะเบียน", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: registration_code, size: "sm", color: "#1f2937", weight: "bold", flex: 3 }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "ชื่อผู้สมัคร", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: full_name, size: "sm", color: "#1f2937", weight: "bold", flex: 3 }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "คูปองสิทธิ์", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: "เรียนฟรี AI 3,000 บ. / จ่ายเพียง 2,999 บ.", size: "sm", color: "#ea580c", weight: "bold", flex: 3, wrap: true }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "ยอดค้างชำระ", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: `฿${Number(final_price).toLocaleString()} (ชำระหน้างาน)`, size: "sm", color: "#dc2626", weight: "bold", flex: 3 }
                      ]
                    }
                  ]
                },
                {
                  type: "separator",
                  margin: "md"
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "md",
                  contents: [
                    {
                      type: "text",
                      text: "📍 สถานที่จัดงาน: KICE Hall 1-2 ห้องประชุม M4-8",
                      size: "xs",
                      color: "#4b5563",
                      wrap: true
                    },
                    {
                      type: "text",
                      text: "📅 วันที่ 28 มิถุนายน 2569 เวลา 10.00 - 19.00 น.",
                      size: "xs",
                      color: "#4b5563",
                      margin: "xs",
                      wrap: true
                    }
                  ]
                }
              ]
            },
            footer: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: "⚠️ กรุณาแสดง QR Code นี้ให้เจ้าหน้าที่สแกนรับสิทธิ์หน้างาน",
                  size: "xxs",
                  color: "#9ca3af",
                  align: "center",
                  wrap: true
                }
              ]
            }
          }
        }
      ];
    } else if (type === "payment_confirmed") {
      const { registration_code, full_name, amount } = data;

      messages = [
        {
          type: "flex",
          altText: "ยืนยันสิทธิ์สะออนทัวร์ Workshop สำเร็จ!",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "ยืนยันสิทธิ์เรียบร้อย ✅",
                  weight: "bold",
                  size: "xl",
                  color: "#16a34a",
                  align: "center"
                },
                {
                  type: "text",
                  text: "ได้รับชำระเงินและสิทธิ์ของคุณได้รับการยืนยันแล้ว",
                  size: "sm",
                  color: "#6b7280",
                  align: "center",
                  wrap: true
                },
                {
                  type: "separator",
                  margin: "md"
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: [
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "รหัสลงทะเบียน", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: registration_code, size: "sm", color: "#1f2937", weight: "bold", flex: 3 }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "ชื่อผู้ประสานงาน", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: full_name, size: "sm", color: "#1f2937", weight: "bold", flex: 3 }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        { type: "text", text: "ชำระเงินแล้ว", size: "sm", color: "#9ca3af", flex: 2 },
                        { type: "text", text: `฿${Number(amount).toLocaleString()} บาท`, size: "sm", color: "#16a34a", weight: "bold", flex: 3 }
                      ]
                    }
                  ]
                },
                {
                  type: "separator",
                  margin: "md"
                },
                {
                  type: "box",
                  layout: "vertical",
                  margin: "md",
                  contents: [
                    {
                      type: "text",
                      text: "📌 พบกันที่ KICE Hall 1-2 ห้องประชุม M4-8",
                      size: "sm",
                      color: "#111827",
                      weight: "bold",
                      wrap: true
                    },
                    {
                      type: "text",
                      text: "📅 วันที่ 28 มิถุนายน 2569 เวลา 10.00 - 19.00 น.",
                      size: "sm",
                      color: "#111827",
                      weight: "bold",
                      margin: "xs",
                      wrap: true
                    }
                  ]
                }
              ]
            }
          }
        }
      ];
    } else {
      throw new Error(`Unsupported message type: ${type}`);
    }

    // Call LINE Push Message API
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: to,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("LINE push API error:", errText);
      throw new Error(`LINE API replied with status ${response.status}: ${errText}`);
    }

    await response.text();
    console.log("Successfully sent LINE push message");

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("send-line-message error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
