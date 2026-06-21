/**
 * Payment Confirmation AI Agent
 *
 * ทำงานหลังจาก admin อนุมัติมัดจำ:
 * 1. ใช้ GLM-4 (function calling) ตัดสินใจว่าจะส่ง message อะไรบ้าง
 * 2. ส่งตั๋ว QR Code ให้ผู้ลงทะเบียนเสมอ
 * 3. ส่งใบเสร็จถ้า needs_receipt = true
 * 4. แจ้ง admin เสมอ
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireServiceRole } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegData {
  id: string;
  registration_code: string;
  full_name: string;
  phone: string;
  email?: string | null;
  line_user_id?: string | null;
  needs_receipt?: boolean;
  receipt_name?: string | null;
  receipt_tax_id?: string | null;
  receipt_address?: string | null;
  payment_amount?: string | null;
  payment_method?: string | null;
  payment_datetime?: string | null;
  ticket_type?: string | null;
  coupon_token?: string | null;
}

// ── Tool definitions (GLM-4 function calling) ─────────────────────────────────

const TOOLS = [
  {
    type: "function",
    function: {
      name: "send_ticket_message",
      description: "ส่ง Flex Message ตั๋วเข้างานพร้อม QR Code สำหรับเช็คอินให้ผู้ลงทะเบียนทาง LINE",
      parameters: {
        type: "object",
        properties: {
          greeting: {
            type: "string",
            description: "ข้อความทักทายส่วนตัว 1 ประโยค ภาษาไทย เป็นกันเองแต่สุภาพ เช่น 'ยินดีต้อนรับครับ คุณสมชาย ที่นั่งพร้อมแล้ว!'",
          },
        },
        required: ["greeting"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_receipt_message",
      description: "ส่ง Flex Message ใบเสร็จรับเงิน — เรียกใช้เฉพาะเมื่อ needs_receipt = true เท่านั้น",
      parameters: {
        type: "object",
        properties: {
          receipt_note: {
            type: "string",
            description: "หมายเหตุในใบเสร็จ ถ้าไม่มีให้ใส่ string ว่าง",
          },
        },
        required: ["receipt_note"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "notify_admin",
      description: "ส่งสรุปการยืนยันมัดจำให้แอดมิน",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "สรุปสั้นๆ สำหรับแอดมิน เช่น 'สมชาย ใจดี ชำระ 2,999 บาท ต้องการใบเสร็จ'",
          },
        },
        required: ["summary"],
      },
    },
  },
];

// ── Agent loop ────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authError = requireServiceRole(req, corsHeaders);
  if (authError) return authError;

  try {
    const reg = (await req.json()) as RegData;

    const zApiKey = Deno.env.get("Z_AI_API_KEY");
    if (!zApiKey) throw new Error("Z_AI_API_KEY not configured");
    const lineToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
    if (!lineToken) throw new Error("LINE_CHANNEL_ACCESS_TOKEN not configured");

    const adminUserId = Deno.env.get("LINE_ADMIN_USER_ID");
    const appOrigin = (Deno.env.get("APP_ORIGIN") || "https://bookingworkshop-agent.lovable.app").replace(/\/$/, "");

    const systemPrompt = `คุณเป็น Payment Confirmation Agent สำหรับงาน SA-ON Tour Workshop: Agent ไทบ้าน ขอนแก่น

รายละเอียดงาน:
- วันที่: 28 มิถุนายน 2569  10.00–19.00 น.
- สถานที่: KICE Hall 1-2 ห้อง M4-8 จังหวัดขอนแก่น
- ราคาพิเศษ: 2,999 บาท + Gift Voucher เรียนฟรี 3,000 บาท

กฎการทำงาน:
1. เรียก send_ticket_message เสมอ (ผู้ลงทะเบียนทุกคนต้องได้รับตั๋ว QR)
2. เรียก send_receipt_message เฉพาะเมื่อ needs_receipt = true
3. เรียก notify_admin เสมอ
4. ปรับ greeting ให้เหมาะกับชื่อและบริบทของผู้ลงทะเบียน`;

    const userPrompt = `ยืนยันมัดจำใหม่:
รหัส: ${reg.registration_code}
ชื่อ: ${reg.full_name}
เบอร์: ${reg.phone}
ประเภทบัตร: ${reg.ticket_type || "ราคาพิเศษ 2,999 บาท"}
ต้องการใบเสร็จ: ${reg.needs_receipt ? "ใช่" : "ไม่"}${reg.needs_receipt ? `
ชื่อในใบเสร็จ: ${reg.receipt_name || reg.full_name}
เลขผู้เสียภาษี: ${reg.receipt_tax_id || "-"}
ที่อยู่: ${reg.receipt_address || "-"}` : ""}
ยอดชำระ: ${reg.payment_amount || "2999"} บาท
ช่องทาง: ${reg.payment_method || "โอนผ่านธนาคาร"}

กรุณาดำเนินการส่ง messages`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const actionsTaken: string[] = [];

    // Agent loop — max 6 turns to prevent infinite loop
    for (let turn = 0; turn < 6; turn++) {
      const aiRes = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${zApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "glm-4-flash",
          messages,
          tools: TOOLS,
          tool_choice: "auto",
        }),
      });

      if (!aiRes.ok) throw new Error(`GLM-4 error: ${await aiRes.text()}`);

      const aiData = await aiRes.json();
      const assistantMsg = aiData.choices?.[0]?.message;
      messages.push(assistantMsg);

      // No tool calls → agent decided it's done
      if (!assistantMsg?.tool_calls?.length) break;

      for (const tc of assistantMsg.tool_calls) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const args = JSON.parse(tc.function.arguments || "{}") as any;
        let result = "";

        switch (tc.function.name) {
          case "send_ticket_message":
            result = reg.line_user_id
              ? await sendTicketMessage(reg, args.greeting, appOrigin, lineToken)
              : "skipped — no line_user_id";
            break;
          case "send_receipt_message":
            result = reg.line_user_id
              ? await sendReceiptMessage(reg, args.receipt_note, lineToken)
              : "skipped — no line_user_id";
            break;
          case "notify_admin":
            result = adminUserId
              ? await notifyAdmin(reg, args.summary, adminUserId, lineToken)
              : "skipped — no LINE_ADMIN_USER_ID";
            break;
          default:
            result = "unknown tool";
        }

        actionsTaken.push(`${tc.function.name}: ${result}`);
        messages.push({ role: "tool", tool_call_id: tc.id, content: result });
      }
    }

    console.log("payment-agent done:", actionsTaken);
    return new Response(JSON.stringify({ ok: true, actions: actionsTaken }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("payment-agent error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function qrUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
}

function row(label: string, value: string) {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      { type: "text", text: label, size: "sm", color: "#9ca3af", flex: 2 },
      { type: "text", text: value, size: "sm", color: "#f3f4f6", weight: "bold", flex: 3, wrap: true },
    ],
  };
}

async function pushLine(to: string, message: unknown, token: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to, messages: [message] }),
  });
  if (!res.ok) console.error("LINE push error:", await res.text());
}

// ── Tool implementations ──────────────────────────────────────────────────────

async function sendTicketMessage(reg: RegData, greeting: string, appOrigin: string, lineToken: string) {
  const checkinUrl = `${appOrigin}/checkin?code=${encodeURIComponent(reg.registration_code)}${
    reg.coupon_token ? `&token=${encodeURIComponent(reg.coupon_token)}` : ""
  }`;

  await pushLine(reg.line_user_id!, {
    type: "flex",
    altText: `✅ ที่นั่งยืนยันแล้ว ${reg.registration_code} — แสดง QR ที่หน้างาน`,
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: qrUrl(checkinUrl),
        size: "full",
        aspectRatio: "1:1",
        aspectMode: "fit",
        backgroundColor: "#ffffff",
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        backgroundColor: "#111827",
        paddingAll: "20px",
        contents: [
          { type: "text", text: greeting, size: "sm", color: "#f59e0b", wrap: true },
          {
            type: "text",
            text: "✅ ยืนยันที่นั่งแล้ว!",
            weight: "bold",
            size: "xxl",
            color: "#16a34a",
            align: "center",
            margin: "sm",
          },
          {
            type: "text",
            text: "แสดง QR Code นี้ที่จุดเช็คอินหน้างาน",
            size: "xs",
            color: "#9ca3af",
            align: "center",
          },
          { type: "separator", margin: "lg", color: "#374151" },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "lg",
            contents: [
              row("รหัส", reg.registration_code),
              row("ชื่อ", reg.full_name),
              row("วันงาน", "28 มิ.ย. 2569  10.00–19.00 น."),
              row("สถานที่", "KICE Hall 1-2 ห้อง M4-8"),
            ],
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#1c2a1c",
            borderColor: "#16a34a",
            borderWidth: "1px",
            cornerRadius: "8px",
            paddingAll: "12px",
            contents: [
              {
                type: "text",
                text: "🎁 รับ Gift Voucher เรียนฟรี 3,000 บาท ที่จุดลงทะเบียนงาน Smart Business Expo!",
                size: "xs",
                color: "#4ade80",
                wrap: true,
                align: "center",
              },
            ],
          },
        ],
      },
    },
  }, lineToken);

  return "ticket + QR sent";
}

async function sendReceiptMessage(reg: RegData, receiptNote: string, lineToken: string) {
  const suffix = reg.registration_code.replace(/^SAON-KK-/, "").padStart(4, "0");
  const receiptNo = `REC-2569-${suffix}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const amount = (reg.payment_amount || "2999").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  await pushLine(reg.line_user_id!, {
    type: "flex",
    altText: `🧾 ใบเสร็จรับเงิน ${receiptNo} — ${reg.full_name}`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "none",
        backgroundColor: "#ffffff",
        contents: [
          // Header bar
          {
            type: "box",
            layout: "vertical",
            backgroundColor: "#111827",
            paddingAll: "16px",
            contents: [
              { type: "text", text: "🧾 ใบเสร็จรับเงิน", weight: "bold", size: "lg", color: "#f59e0b", align: "center" },
              { type: "text", text: "SA-ON Tour Workshop", size: "xs", color: "#9ca3af", align: "center" },
            ],
          },
          // Receipt number + date
          {
            type: "box",
            layout: "horizontal",
            paddingAll: "12px",
            contents: [
              { type: "text", text: `เลขที่: ${receiptNo}`, size: "xs", color: "#6b7280", flex: 1 },
              { type: "text", text: dateStr, size: "xs", color: "#6b7280", align: "end", flex: 1 },
            ],
          },
          { type: "separator", color: "#e5e7eb" },
          // Customer
          {
            type: "box",
            layout: "vertical",
            paddingAll: "12px",
            spacing: "xs",
            contents: [
              { type: "text", text: "ผู้รับบริการ", size: "xxs", color: "#9ca3af", weight: "bold" },
              { type: "text", text: reg.receipt_name || reg.full_name, size: "sm", color: "#111827", weight: "bold" },
              ...(reg.receipt_tax_id
                ? [{ type: "text", text: `เลขผู้เสียภาษี: ${reg.receipt_tax_id}`, size: "xxs", color: "#6b7280" }]
                : []),
              ...(reg.receipt_address
                ? [{ type: "text", text: reg.receipt_address, size: "xxs", color: "#6b7280", wrap: true }]
                : []),
            ],
          },
          { type: "separator", color: "#e5e7eb" },
          // Item
          {
            type: "box",
            layout: "vertical",
            paddingAll: "12px",
            spacing: "xs",
            contents: [
              { type: "text", text: "รายการ", size: "xxs", color: "#9ca3af", weight: "bold" },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "บัตร Workshop AI Agent\nขอนแก่น 2569", size: "sm", color: "#111827", flex: 3, wrap: true },
                  { type: "text", text: `${amount} .-`, size: "sm", color: "#111827", weight: "bold", flex: 2, align: "end" },
                ],
              },
            ],
          },
          { type: "separator", color: "#e5e7eb" },
          // Total
          {
            type: "box",
            layout: "horizontal",
            paddingAll: "12px",
            backgroundColor: "#fef9c3",
            contents: [
              { type: "text", text: "รวมทั้งสิ้น", weight: "bold", size: "md", color: "#111827", flex: 1 },
              { type: "text", text: `${amount} บาท`, weight: "bold", size: "md", color: "#dc2626", align: "end", flex: 1 },
            ],
          },
          // Note
          ...(receiptNote
            ? [{
                type: "box",
                layout: "vertical",
                paddingAll: "8px",
                backgroundColor: "#f9fafb",
                contents: [
                  { type: "text", text: `หมายเหตุ: ${receiptNote}`, size: "xxs", color: "#9ca3af", wrap: true },
                ],
              }]
            : []),
          // Footer
          {
            type: "box",
            layout: "vertical",
            paddingAll: "12px",
            contents: [
              { type: "text", text: "ขอบคุณที่ลงทะเบียนค่ะ 🙏", size: "xs", color: "#9ca3af", align: "center" },
              { type: "text", text: "สะออนทัวร์ Workshop", size: "xxs", color: "#d1d5db", align: "center" },
            ],
          },
        ],
      },
    },
  }, lineToken);

  return `receipt ${receiptNo} sent`;
}

async function notifyAdmin(reg: RegData, summary: string, adminUserId: string, lineToken: string) {
  const amount = (reg.payment_amount || "2999").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  await pushLine(adminUserId, {
    type: "flex",
    altText: `💰 ยืนยันมัดจำ: ${reg.registration_code} — ${reg.full_name}`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        backgroundColor: "#111827",
        paddingAll: "20px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "💰", size: "xl", flex: 0 },
              {
                type: "box",
                layout: "vertical",
                margin: "sm",
                contents: [
                  { type: "text", text: "ยืนยันมัดจำแล้ว", weight: "bold", color: "#16a34a", size: "lg" },
                  { type: "text", text: summary, size: "xs", color: "#9ca3af", wrap: true },
                ],
              },
            ],
          },
          { type: "separator", margin: "md", color: "#374151" },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "md",
            contents: [
              row("รหัส", reg.registration_code),
              row("ชื่อ", reg.full_name),
              row("เบอร์", reg.phone),
              row("ยอด", `${amount} บาท`),
              row("ใบเสร็จ", reg.needs_receipt ? "✅ ต้องการ" : "ไม่ต้องการ"),
              row("ช่องทาง", reg.payment_method || "โอนธนาคาร"),
            ],
          },
        ],
      },
    },
  }, lineToken);

  return "admin notified";
}
