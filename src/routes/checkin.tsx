import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  lookupForCheckin,
  approveDeposit,
  checkinRegistration,
  checkIsAdmin,
} from "@/lib/registrations.functions";
import {
  Search,
  CheckCircle2,
  Lock,
  Unlock,
  Shield,
  Loader2,
  QrCode,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Bot,
  CreditCard,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/checkin")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({
      code: z.string().optional(),
      token: z.string().optional(),
    }).parse(s),
  head: () => ({ meta: [{ title: "Admin Check-in – สะออนทัวร์ Workshop" }] }),
  component: CheckinPage,
});

type CouponRow = {
  id: string;
  token: string;
  status: "locked" | "active" | "used";
  value: number;
  created_at: string;
};

type RegRow = {
  id: string;
  registration_code: string;
  full_name: string;
  phone: string;
  line_id: string;
  email: string | null;
  province: string | null;
  district: string | null;
  occupation: string | null;
  interest_topic: string | null;
  system_prompt: string | null;
  ticket_type: string | null;
  needs_receipt: boolean | null;
  payment_method: string | null;
  status: string;
  checked_in_at: string | null;
  created_at: string;
  coupons: CouponRow[] | null;
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new:          { label: "ลงทะเบียนใหม่",     color: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  contacted:    { label: "ติดต่อแล้ว",         color: "text-purple-400 bg-purple-400/10 border-purple-400/30" },
  confirmed:    { label: "ยืนยันเข้าเรียน",   color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/30" },
  wait_deposit: { label: "รอตรวจสอบมัดจำ",   color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  paid:         { label: "ชำระเงินแล้ว",      color: "text-green-400 bg-green-400/10 border-green-400/30" },
  checked_in:   { label: "เช็คอินแล้ว ✓",    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  cancelled:    { label: "ยกเลิก",            color: "text-red-400 bg-red-400/10 border-red-400/30" },
};

function CheckinPage() {
  const { code: qrCode, token: qrToken } = Route.useSearch();
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const checkAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    checkAdmin()
      .then((r) => setIsAdmin(r.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [session, checkAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!session) return <AuthPanel />;

  if (isAdmin === null) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <Toaster richColors position="top-center" />
        <div className="max-w-sm text-center p-8 rounded-2xl bg-card border border-border shadow-card-soft">
          <Shield className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="text-xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
          <p className="mt-2 text-slate-300 text-sm">บัญชีนี้ไม่ใช่ Admin</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-4 text-sm text-slate-300 hover:text-white"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  }

  return <CheckinDashboard initialCode={qrCode} qrToken={qrToken} />;
}

// ── Auth panel ───────────────────────────────────────────────────────────────
function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-hero isan-pattern px-4">
      <Toaster richColors position="top-center" />
      <form
        onSubmit={submit}
        className="w-full max-w-sm p-8 rounded-3xl bg-card border border-border shadow-card-soft"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient grid place-items-center shadow-glow">
            <QrCode className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-center">Admin Check-in</h1>
        <p className="text-center text-sm text-slate-300 mt-1">เข้าสู่ระบบเพื่อสแกนเช็คอิน</p>
        <div className="space-y-3 mt-6">
          <input
            type="email" required placeholder="อีเมล Admin" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary"
          />
          <input
            type="password" required minLength={6} placeholder="รหัสผ่าน" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary"
          />
        </div>
        <button
          disabled={busy}
          className="w-full mt-5 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-bold shadow-glow disabled:opacity-60"
        >
          {busy ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}

// ── Check-in dashboard ───────────────────────────────────────────────────────
function CheckinDashboard({ initialCode, qrToken }: { initialCode?: string; qrToken?: string }) {
  const lookup = useServerFn(lookupForCheckin);
  const approve = useServerFn(approveDeposit);
  const checkin = useServerFn(checkinRegistration);

  const [searchCode, setSearchCode] = useState(initialCode ?? "");
  const [searching, setSearching] = useState(false);
  const [reg, setReg] = useState<RegRow | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  // Auto-search when arriving from QR code
  useEffect(() => {
    if (initialCode) doSearch(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doSearch(code = searchCode) {
    if (!code.trim()) return;
    setSearching(true);
    setNotFound(false);
    setReg(null);
    try {
      const result = await lookup({ data: { code: code.trim().toUpperCase() } });
      if (result) {
        setReg(result as unknown as RegRow);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setSearching(false);
    }
  }

  async function handleApproveDeposit() {
    if (!reg) return;
    setActionBusy(true);
    try {
      await approve({ data: { id: reg.id } });
      toast.success("อนุมัติมัดจำและส่ง QR Code ทาง LINE แล้ว");
      await doSearch(reg.registration_code);
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถอนุมัติได้");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleCheckin() {
    if (!reg) return;
    setActionBusy(true);
    try {
      await checkin({ data: { id: reg.id } });
      toast.success("เช็คอินสำเร็จ! 🎉");
      await doSearch(reg.registration_code);
    } catch (err) {
      console.error(err);
      toast.error("เช็คอินไม่สำเร็จ");
    } finally {
      setActionBusy(false);
    }
  }

  const coupon = reg?.coupons?.[0] ?? null;
  const statusInfo = reg ? (STATUS_MAP[reg.status] ?? { label: reg.status, color: "text-muted-foreground bg-muted/20 border-border" }) : null;
  const fromQr = !!initialCode && !!qrToken && reg?.coupons?.[0]?.token === qrToken;

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold" />
            <h1 className="font-bold text-sm">Admin Check-in</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">

        {/* Search */}
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-300">ค้นหารหัสลงทะเบียน</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="เช่น SAON-KK-0001"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary font-mono text-sm"
              />
            </div>
            <button
              onClick={() => doSearch()}
              disabled={searching || !searchCode.trim()}
              className="px-5 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-bold text-sm shadow-glow disabled:opacity-50 shrink-0"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          {fromQr && (
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-3 py-2">
              <QrCode className="w-3.5 h-3.5 shrink-0" />
              ตรวจสอบจาก QR Code – Token ถูกต้อง ✓
            </div>
          )}
        </div>

        {/* Not found */}
        {notFound && (
          <div className="text-center py-10 text-slate-300">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">ไม่พบรหัสลงทะเบียน</p>
            <p className="text-xs mt-1">"{searchCode}" ไม่มีในระบบ</p>
          </div>
        )}

        {/* Registration card */}
        {reg && (
          <div className="space-y-4 animate-fade-up">

            {/* Status + code */}
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">รหัสลงทะเบียน</p>
                  <p className="text-xl font-extrabold text-gold font-mono">{reg.registration_code}</p>
                </div>
                {statusInfo && (
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                )}
              </div>
 
              {/* Personal info */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <InfoRow icon={User} label="ชื่อ" value={reg.full_name} />
                <InfoRow icon={Phone} label="เบอร์" value={reg.phone} />
                <InfoRow icon={Mail} label="อีเมล" value={reg.email ?? "-"} />
                <InfoRow icon={MapPin} label="จังหวัด" value={[reg.province, reg.district].filter(Boolean).join(" / ") || "-"} />
                {reg.occupation && <InfoRow icon={Briefcase} label="อาชีพ" value={reg.occupation} />}
              </div>
 
              {/* AI interests */}
              {reg.interest_topic && (
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                     <Bot className="w-3.5 h-3.5 text-gold" />
                    <p className="text-xs font-bold text-slate-300 uppercase">ความสนใจ AI</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {reg.interest_topic.split(", ").map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/20">{t}</span>
                    ))}
                  </div>
                </div>
              )}
 
              {/* System prompt */}
              {reg.system_prompt && (
                <div className="pt-3 border-t border-border/40">
                  <p className="text-xs font-bold text-slate-300 uppercase mb-1">System Prompt</p>
                  <p className="text-xs text-slate-300 bg-input/50 rounded-xl px-3 py-2 font-mono leading-relaxed line-clamp-4">
                    {reg.system_prompt}
                  </p>
                </div>
              )}
            </div>

            {/* Coupon status */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-gold" />
                <p className="font-bold text-sm">สถานะคูปอง Gift Voucher 3,000.-</p>
              </div>
              {coupon ? (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0
                    ${coupon.status === "locked" ? "bg-amber-400/10" : coupon.status === "active" ? "bg-green-400/10" : "bg-muted/20"}`}>
                    {coupon.status === "locked" && <Lock className="w-5 h-5 text-amber-400" />}
                    {coupon.status === "active" && <Unlock className="w-5 h-5 text-green-400" />}
                    {coupon.status === "used" && <CheckCircle2 className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {coupon.status === "locked" && <span className="text-amber-400">ล็อกอยู่ — รอตรวจสอบมัดจำ</span>}
                      {coupon.status === "active" && <span className="text-green-400">ปลดล็อกแล้ว — พร้อมใช้</span>}
                      {coupon.status === "used" && <span className="text-muted-foreground">ใช้แล้ว</span>}
                    </p>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{coupon.token.slice(0, 8)}…</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-300">ยังไม่มีคูปอง</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {/* Approve deposit */}
              {reg.status !== "paid" && reg.status !== "checked_in" && reg.status !== "cancelled" && (
                <button
                  onClick={handleApproveDeposit}
                  disabled={actionBusy}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, oklch(0.75 0.18 50), oklch(0.65 0.22 45))", color: "white" }}
                >
                  {actionBusy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                  อนุมัติมัดจำ — ปลดล็อก QR Code + แจ้ง LINE
                </button>
              )}

              {/* Check-in */}
              {(reg.status === "paid" || (reg.status !== "checked_in" && reg.status !== "cancelled" && fromQr)) && (
                <button
                  onClick={handleCheckin}
                  disabled={actionBusy || reg.status === "checked_in"}
                  className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 bg-green-600 hover:bg-green-500 transition text-white"
                >
                  {actionBusy ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {reg.status === "checked_in" ? "เช็คอินแล้ว ✓" : "เช็คอินเข้างาน"}
                </button>
              )}

              {reg.status === "checked_in" && (
                <div className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  เช็คอินเรียบร้อยแล้ว
                  {reg.checked_in_at && (
                    <span className="text-xs font-normal ml-1">
                      {new Date(reg.checked_in_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-300">{label}</p>
        <p className="font-semibold text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
