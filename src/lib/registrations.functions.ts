import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const registrationSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(30),
  line_id: z.string().trim().min(1).max(80),
  email: z.string().trim().max(200).optional().or(z.literal("")),
  province: z.string().trim().max(80).optional().or(z.literal("")),
  district: z.string().trim().max(80).optional().or(z.literal("")),
  occupation: z.string().trim().max(200).optional().or(z.literal("")),
  business_name: z.string().trim().max(200).optional().or(z.literal("")),
  interest_topic: z.string().trim().max(500).optional().or(z.literal("")),
  has_line_oa: z.string().trim().max(40).optional().or(z.literal("")),
  ticket_type: z.string().trim().max(40).optional().or(z.literal("")),
  needs_receipt: z.boolean().optional(),
  receipt_name: z.string().trim().max(200).optional().or(z.literal("")),
  receipt_tax_id: z.string().trim().max(30).optional().or(z.literal("")),
  receipt_address: z.string().trim().max(500).optional().or(z.literal("")),
  payment_method: z.string().trim().max(40).optional().or(z.literal("")),
  payment_datetime: z.string().trim().max(50).optional().or(z.literal("")),
  payment_amount: z.string().trim().max(30).optional().or(z.literal("")),
  payment_proof_url: z.string().trim().max(1000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  line_user_id: z.string().trim().max(50).optional().or(z.literal("")),
  system_prompt: z.string().trim().max(2000).optional().or(z.literal("")),
  source_channel: z.string().trim().max(40).optional().or(z.literal("")),
  line_display_name: z.string().trim().max(200).optional().or(z.literal("")),
  consent: z.literal(true),
  referrer_type: z.string().trim().max(100).optional().or(z.literal("")),
  referrer_name: z.string().trim().max(200).optional().or(z.literal("")),
  campaign_code: z.string().trim().max(100).optional().or(z.literal("")),
  voucher_source: z.string().trim().max(200).optional().or(z.literal("")),
});

export const createRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        "[createRegistration] SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to Mock Registration Mode for local development.",
      );
      const mockCode = `SAON-KK-MOCK-${Math.floor(1000 + Math.random() * 9000)}`;
      return { registration_code: mockCode };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      ...data,
      email: data.email || null,
      province: data.province || null,
      district: data.district || null,
      occupation: data.occupation || null,
      business_name: data.business_name || null,
      interest_topic: data.interest_topic || null,
      has_line_oa: data.has_line_oa || null,
      ticket_type: data.ticket_type || null,
      needs_receipt: data.needs_receipt ?? false,
      receipt_name: data.receipt_name || null,
      receipt_tax_id: data.receipt_tax_id || null,
      receipt_address: data.receipt_address || null,
      payment_method: data.payment_method || null,
      payment_datetime: data.payment_datetime || null,
      payment_amount: data.payment_amount || null,
      payment_proof_url: data.payment_proof_url || null,
      notes: data.notes || null,
      line_user_id: data.line_user_id || null,
      system_prompt: data.system_prompt || null,
      source_channel: data.source_channel || "LINE_LIFF",
      line_display_name: data.line_display_name || null,
      referrer_type: data.referrer_type || null,
      referrer_name: data.referrer_name || null,
      campaign_code: data.campaign_code || null,
      voucher_source: data.voucher_source || null,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert(payload as any)
      .select("registration_code")
      .single();
    if (error) throw new Error(error.message);
    if (data.line_user_id) {
      try {
        const { error: lineError } = await supabaseAdmin.functions.invoke("send-line-message", {
          body: {
            to: data.line_user_id,
            type: "registration_success",
            data: {
              registration_code: row.registration_code,
              full_name: data.full_name,
              final_price: 2999,
            },
          },
        });
        if (lineError) console.warn("[createRegistration] LINE push failed:", lineError.message);
      } catch (lineError) {
        console.warn("[createRegistration] LINE push failed:", lineError);
      }
    }
    return { registration_code: row.registration_code };
  });

export const listRegistrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateRegistrationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "contacted", "confirmed", "paid", "cancelled"]),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { error } = await context.supabase
      .from("registrations")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return { claimed: data === true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: data === true };
  });

export const lookupForCheckin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ code: z.string().trim().min(1).max(30) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .select("*, coupons(*)")
      .eq("registration_code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (row ?? null) as any;
  });

export const approveDeposit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result, error } = await (context.supabase as any).rpc("approve_deposit", {
      _registration_id: data.id,
    });
    if (error) throw new Error((error as { message: string }).message);
    const meta = result as { token: string; registration_code: string; full_name: string; line_user_id: string | null };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch full registration so AI Agent has all fields (receipt, payment, etc.)
    const { data: fullReg } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .eq("id", data.id)
      .single();

    // Invoke AI Agent — handles ticket QR, receipt, admin notification
    if (fullReg) {
      await supabaseAdmin.functions.invoke("payment-agent", {
        body: {
          ...(fullReg as Record<string, unknown>),
          coupon_token: meta.token,
        },
      });
    }
    return { ok: true, token: meta.token };
  });

export const checkinRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (context.supabase as any).rpc("checkin_registration", {
      _registration_id: data.id,
    });
    if (error) throw new Error((error as { message: string }).message);
    return { ok: true };
  });
