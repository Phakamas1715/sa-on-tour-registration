/**
 * generate-receipt — ใบเสร็จการจอง / ใบยืนยันการจอง
 *
 * รับ registration_id → ดึงข้อมูลจาก DB → ส่งคืนข้อมูลใบเสร็จ + HTML
 * รองรับ needs_receipt=true (ใบเสร็จรับเงินพร้อมเลขผู้เสียภาษี) และ
 * needs_receipt=false (ใบยืนยันการจองทั่วไป)
 *
 * Security: Service Role Key
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { requireServiceRole } from "../_shared/security.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

  try {
    const { registration_id } = await req.json();
    if (!registration_id) {
      return new Response(JSON.stringify({ error: "registration_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: reg, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", registration_id)
      .single();

    if (error || !reg) {
      return new Response(JSON.stringify({ error: "Registration not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const issueDate = new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const amountNum = Number(reg.payment_amount || 2999);
    const amountFormatted = amountNum.toLocaleString("th-TH", { maximumFractionDigits: 0 });

    const receipt = {
      receipt_type: reg.needs_receipt ? "tax_receipt" : "booking_confirmation",
      issue_date: issueDate,
      registration_code: reg.registration_code,
      event: {
        name: "สะออนทัวร์ Workshop: Agent ไทบ้าน",
        date: "28 มิถุนายน 2569",
        time: "10.00 – 19.00 น.",
        venue: "KICE Hall 1-2 ห้อง M4-8 จังหวัดขอนแก่น",
        organizer: "สะออนทัวร์",
      },
      participant: {
        name: reg.full_name,
        phone: reg.phone,
        email: reg.email || null,
        line_id: reg.line_id || null,
      },
      billing: reg.needs_receipt
        ? {
            name: reg.receipt_name || reg.full_name,
            tax_id: reg.receipt_tax_id || null,
            address: reg.receipt_address || null,
          }
        : null,
      payment: {
        amount: amountNum,
        amount_text: `${amountFormatted} บาท`,
        method: reg.payment_method || "โอนผ่านธนาคาร",
        datetime: reg.payment_datetime || null,
        bank_name: "ธนาคารกสิกรไทย",
        account_number: "405-3-05346-3",
        account_name: "อัจฉรีญา โถนารัตน์",
      },
      status: reg.status,
      html: buildReceiptHtml(reg, issueDate, amountFormatted),
    };

    return new Response(JSON.stringify({ receipt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-receipt error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// deno-lint-ignore no-explicit-any
function buildReceiptHtml(reg: any, issueDate: string, amount: string): string {
  const isTax = reg.needs_receipt === true;
  const title = isTax ? "ใบเสร็จรับเงิน" : "ใบยืนยันการจอง";
  const billingName = isTax ? (reg.receipt_name || reg.full_name) : reg.full_name;
  const taxId = reg.receipt_tax_id ? `เลขผู้เสียภาษี: ${reg.receipt_tax_id}` : "";
  const address = reg.receipt_address || "";

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title} ${reg.registration_code}</title>
<style>
  body{font-family:'Sarabun',sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#1f2937;font-size:14px}
  .header{text-align:center;border-bottom:2px solid #f59e0b;padding-bottom:16px;margin-bottom:24px}
  .header h1{margin:0;font-size:22px;color:#111827}
  .header p{margin:4px 0;color:#6b7280;font-size:12px}
  .badge{display:inline-block;background:#f59e0b;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:.05em}
  .section{margin-bottom:20px}
  .section h2{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:10px}
  .row{display:flex;justify-content:space-between;padding:4px 0}
  .row .label{color:#6b7280}
  .row .value{font-weight:600;text-align:right}
  .amount-box{background:#fff7ed;border:2px solid #f59e0b;border-radius:8px;padding:16px;text-align:center;margin:20px 0}
  .amount-box .amt{font-size:32px;font-weight:800;color:#92400e}
  .amount-box .sub{font-size:12px;color:#6b7280;margin-top:4px}
  .footer{text-align:center;margin-top:32px;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:12px}
  @media print{body{margin:0}}
</style>
</head>
<body>
<div class="header">
  <div class="badge">${title}</div>
  <h1>สะออนทัวร์ Workshop: Agent ไทบ้าน</h1>
  <p>เลขที่: ${reg.registration_code} &nbsp;|&nbsp; วันที่ออก: ${issueDate}</p>
</div>

<div class="section">
  <h2>รายละเอียดงาน</h2>
  <div class="row"><span class="label">ชื่องาน</span><span class="value">SA-ON Tour Workshop: Agent ไทบ้าน</span></div>
  <div class="row"><span class="label">วันที่</span><span class="value">28 มิถุนายน 2569</span></div>
  <div class="row"><span class="label">เวลา</span><span class="value">10.00 – 19.00 น.</span></div>
  <div class="row"><span class="label">สถานที่</span><span class="value">KICE Hall 1-2 ห้อง M4-8 จ.ขอนแก่น</span></div>
</div>

<div class="section">
  <h2>${isTax ? "ผู้ชำระเงิน / ออกใบเสร็จในนาม" : "ข้อมูลผู้ลงทะเบียน"}</h2>
  <div class="row"><span class="label">ชื่อ</span><span class="value">${billingName}</span></div>
  ${taxId ? `<div class="row"><span class="label">เลขผู้เสียภาษี</span><span class="value">${reg.receipt_tax_id}</span></div>` : ""}
  ${address ? `<div class="row"><span class="label">ที่อยู่</span><span class="value">${address}</span></div>` : ""}
  <div class="row"><span class="label">เบอร์โทร</span><span class="value">${reg.phone}</span></div>
  ${reg.email ? `<div class="row"><span class="label">อีเมล</span><span class="value">${reg.email}</span></div>` : ""}
</div>

<div class="section">
  <h2>การชำระเงิน</h2>
  <div class="row"><span class="label">รายการ</span><span class="value">ค่าลงทะเบียน Workshop</span></div>
  <div class="row"><span class="label">ช่องทาง</span><span class="value">${reg.payment_method || "โอนผ่านธนาคาร"}</span></div>
  ${reg.payment_datetime ? `<div class="row"><span class="label">วันเวลาที่โอน</span><span class="value">${reg.payment_datetime}</span></div>` : ""}
  <div class="row"><span class="label">โอนไปยัง</span><span class="value">ธ.กสิกรไทย 405-3-05346-3 (อัจฉรีญา โถนารัตน์)</span></div>
</div>

<div class="amount-box">
  <div class="amt">${amount} บาท</div>
  <div class="sub">ยอดชำระมัดจำ</div>
</div>

<div class="footer">
  <p>เอกสารนี้ออกโดยระบบอัตโนมัติ · สะออนทัวร์ Workshop</p>
  <p>รหัสอ้างอิง: ${reg.registration_code}</p>
</div>
</body>
</html>`;
}
