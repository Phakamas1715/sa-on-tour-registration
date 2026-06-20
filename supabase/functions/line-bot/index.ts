import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    const Z_AI_API_KEY = Deno.env.get("Z_AI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not configured in Supabase secrets");
    }

    let apiKey = Z_AI_API_KEY;
    let isZAi = true;

    if (!apiKey) {
      apiKey = LOVABLE_API_KEY;
      isZAi = false;
    }

    if (!apiKey) {
      throw new Error("Neither Z_AI_API_KEY nor LOVABLE_API_KEY is configured in Supabase secrets");
    }

    const bodyText = await req.text();
    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return new Response("Invalid JSON payload", { status: 400 });
    }

    const events = payload.events || [];
    console.log(`Received ${events.length} LINE events`);

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const replyToken = event.replyToken;
        const userText = event.message.text;
        const userId = event.source.userId;

        console.log(`User ${userId} sent: ${userText}`);

        // Get AI response
        const aiResponse = await getAiReply(userText, apiKey, isZAi);

        // Send reply message to LINE
        await replyToLine(replyToken, aiResponse, LINE_CHANNEL_ACCESS_TOKEN);
      } else if (event.type === "follow") {
        const replyToken = event.replyToken;
        console.log(`User followed the bot: ${event.source.userId}`);

        const welcomeMessage = {
          type: "flex",
          altText: "ยินดีต้อนรับสู่ สะออนทัวร์ AI Agent 🤖",
          contents: {
            type: "bubble",
            hero: {
              type: "image",
              url: "https://bookingworkshop-agent.lovable.app/hero-bg.png",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover"
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "md",
              contents: [
                {
                  type: "text",
                  text: "สะออนทัวร์ AI Agent 🤖",
                  weight: "bold",
                  size: "xl",
                  color: "#f59e0b"
                },
                {
                  type: "text",
                  text: "ยินดีต้อนรับเข้าสู่ระบบจำลองผู้ช่วยอัจฉริยะ!",
                  weight: "bold",
                  size: "md",
                  color: "#ffffff",
                  wrap: true
                },
                {
                  type: "text",
                  text: "สัมมนาสุดพิเศษที่จะเปลี่ยน LINE OA & TikTok ให้ทำงานแทนคุณ 24 ชั่วโมง ดำเนินการโดยวิทยากรผู้เชี่ยวชาญระดับประเทศ",
                  size: "sm",
                  color: "#9ca3af",
                  wrap: true
                },
                {
                  type: "box",
                  layout: "vertical",
                  spacing: "xs",
                  margin: "lg",
                  contents: [
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        {
                          type: "text",
                          text: "📅 วันเสาร์ที่ 28 มิ.ย. 2569",
                          size: "xs",
                          color: "#d1d5db",
                          flex: 1
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "horizontal",
                      contents: [
                        {
                          type: "text",
                          text: "📍 KICE Hall 1-2 ขอนแก่น ห้อง M4-8",
                          size: "xs",
                          color: "#d1d5db",
                          flex: 1
                        }
                      ]
                    }
                  ]
                }
              ],
              backgroundColor: "#111827"
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  color: "#f59e0b",
                  action: {
                    type: "uri",
                    label: "ลงทะเบียนรับสิทธิ์ 2,999.-",
                    uri: "https://bookingworkshop-agent.lovable.app"
                  }
                },
                {
                  type: "button",
                  style: "secondary",
                  color: "#374151",
                  action: {
                    type: "message",
                    label: "คุยกับบอททดสอบ",
                    text: "สวัสดีครับ สนใจบอท AI Agent"
                  }
                }
              ],
              backgroundColor: "#111827"
            }
          }
        };

        await replyToLine(replyToken, welcomeMessage, LINE_CHANNEL_ACCESS_TOKEN);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("LINE bot error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function getAiReply(userMessage: string, apiKey: string, isZAi: boolean): Promise<string> {
  const systemPrompt = `คุณเป็น AI Agent ผู้ช่วยลูกค้าอัจฉริยะของบริษัท Regent Holiday (บริษัททัวร์ต่างประเทศและจัดศึกษาดูงานคุณภาพสูง)
  หน้าที่ของคุณคือ:
  1. แนะนำแพ็คเกจทัวร์ต่างประเทศ เช่น ญี่ปุ่น จีน เกาหลี ฮ่องกง ยุโรป และอื่นๆ
  2. ให้ข้อมูลผู้จัดสัมมนา "AI Agent & Automation สำหรับธุรกิจ" ราคาพิเศษ 2,999 บาท และปกติ 5,999 บาท
  3. ช่วยแนะนำวิธีการขอใบเสนอราคา และตอบข้อสงสัยของลูกค้าอย่างเป็นมิตร สุภาพ และเป็นมืออาชีพ
  4. ตอบลูกค้าเป็นภาษาไทยสั้นกระชับเข้าใจง่าย มีการใช้ emoji ตกแต่งสวยงามให้น่าอ่าน`;

  const url = isZAi
    ? "https://api.z.ai/api/paas/v4/chat/completions"
    : "https://ai.gateway.lovable.dev/v1/chat/completions";

  const model = isZAi ? "glm-4-flash" : "google/gemini-3-flash-preview";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI Lovable Gateway error:", errText);
      return "ขออภัยด้วยนะคะ ระบบประมวลผลอัจฉริยะขัดข้องชั่วคราว มีอะไรให้ช่วยอย่างอื่นไหมคะ 🥺";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "ยินดีต้อนรับเข้าสู่บริการ Regent Holiday ค่ะ มีอะไรให้ช่วยแชร์ข้อมูลไหมคะ";
  } catch (err) {
    console.error("Failed to query AI model:", err);
    return "ระบบผู้ช่วยกำลังปรับปรุงชั่วคราวค่ะ ขออภัยในความไม่สะดวกด้วยนะคะ";
  }
}

async function replyToLine(replyToken: string, message: any, token: string) {
  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: [
        typeof message === "string"
          ? {
              type: "text",
              text: message,
            }
          : message,
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("LINE reply API error:", errText);
    throw new Error(`LINE API replied with status ${response.status}`);
  }

  await response.text();
  console.log("Successfully sent reply message");
}
