import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const registrationSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(30),
  line_id: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  province: z.string().trim().max(80).optional().or(z.literal("")),
  district: z.string().trim().max(80).optional().or(z.literal("")),
  occupation: z.string().trim().max(200).optional().or(z.literal("")),
  business_name: z.string().trim().max(200).optional().or(z.literal("")),
  interest_topic: z.string().trim().max(120).optional().or(z.literal("")),
  has_line_oa: z.string().trim().max(40).optional().or(z.literal("")),
  consent: z.literal(true),
});

export const createRegistration = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
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
    };
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert(payload)
      .select("registration_code")
      .single();
    if (error) throw new Error(error.message);
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
