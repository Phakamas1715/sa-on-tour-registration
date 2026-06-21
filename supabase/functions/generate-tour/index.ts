import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireServiceRole } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authError = requireServiceRole(req, corsHeaders);
  if (authError) return authError;

  try {
    const {
      destination,
      num_travelers,
      budget_per_person,
      study_objectives,
      study_topics,
      preferred_visits,
      travel_date_start,
      travel_date_end,
    } = await req.json();

    const Z_AI_API_KEY = Deno.env.get("Z_AI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    let apiKey = Z_AI_API_KEY;
    let isZAi = true;

    if (!apiKey) {
      apiKey = LOVABLE_API_KEY;
      isZAi = false;
    }

    if (!apiKey) throw new Error("Neither Z_AI_API_KEY nor LOVABLE_API_KEY is configured");

    const systemPrompt = `คุณเป็นผู้เชี่ยวชาญจัดทัวร์ต่างประเทศ ศึกษาดูงาน ของบริษัท Regent Holiday
สร้างโปรแกรมทัวร์ศึกษาดูงานต่างประเทศ ภาษาไทย ตอบเป็น JSON format:
{
  "tour_name": "ชื่อทัวร์",
  "destination": "ปลายทาง",
  "days": จำนวนวัน,
  "nights": จำนวนคืน,
  "highlights": ["จุดเด่น 1", "จุดเด่น 2"],
  "itinerary": [
    {
      "day": 1,
      "title": "หัวข้อวัน",
      "activities": [
        { "time": "07:00", "description": "รายละเอียด" }
      ]
    }
  ],
  "included": ["สิ่งที่รวม"],
  "excluded": ["สิ่งที่ไม่รวม"],
  "estimated_price_per_person": ราคาประมาณต่อคน,
  "study_visits": ["สถานที่ดูงาน 1", "สถานที่ดูงาน 2"],
  "notes": "หมายเหตุ"
}

กรุณา:
- จัดโปรแกรมให้เหมาะกับกรุ๊ปคณะใหญ่ศึกษาดูงาน
- ใส่สถานที่ดูงานที่เกี่ยวข้องกับวัตถุประสงค์
- ผสมระหว่างศึกษาดูงานและสถานที่ท่องเที่ยวสำคัญ
- ไม่ลงร้านช้อปปิ้ง (ไม่มี shopping stop)
- ราคาให้สมเหตุสมผลกับงบประมาณที่ให้
- ตอบเป็น JSON เท่านั้น ไม่ต้องมี markdown`;

    const userPrompt = `สร้างโปรแกรมทัวร์ศึกษาดูงาน:
- ปลายทาง: ${destination}
- จำนวนคณะ: ${num_travelers} คน
- งบประมาณ: ${budget_per_person ? `฿${budget_per_person.toLocaleString()}/คน` : "ยังไม่ระบุ"}
- วัตถุประสงค์: ${study_objectives || "ศึกษาดูงานทั่วไป"}
- หัวข้อสนใจ: ${study_topics?.join(", ") || "ไม่ระบุ"}
- สถานที่ต้องการดูงาน: ${preferred_visits || "ไม่ระบุ"}
- วันเดินทาง: ${travel_date_start || "ยังไม่ระบุ"} - ${travel_date_end || "ยังไม่ระบุ"}`;

    const url = isZAi
      ? "https://api.z.ai/api/paas/v4/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";

    const model = isZAi ? "glm-4-flash" : "google/gemini-3-flash-preview";

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
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later" }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";

    // Try to parse JSON from AI response
    let program;
    try {
      // Remove markdown code blocks if present
      const jsonStr = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      program = JSON.parse(jsonStr);
    } catch {
      program = { raw_text: content };
    }

    return new Response(JSON.stringify({ program }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-tour error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
