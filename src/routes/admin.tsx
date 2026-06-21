import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  listRegistrations,
  updateRegistrationStatus,
  claimFirstAdmin,
  checkIsAdmin,
} from "@/lib/registrations.functions";
import { LogOut, Search, Download, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin – Workshop Registrations" }] }),
  component: AdminPage,
});

type Reg = {
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
  source_channel?: string | null;
  status: string;
  created_at: string;
  referrer_type?: string | null;
  referrer_name?: string | null;
  campaign_code?: string | null;
  voucher_source?: string | null;
  payment_amount?: string | null;
};

const SOURCE_BADGE: Record<string, { label: string; color: string }> = {
  GOOGLE_FORM_EXPO:    { label: "Google Form", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  LINE_LIFF:           { label: "LINE LIFF",   color: "bg-green-500/15 text-green-400 border-green-500/30" },
  LINE_LIFF_NUMNAKOM:  { label: "LIFF หนุ่มนักออม", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  SPEAKER_REFERRAL:    { label: "Speaker Referral / ช่องทางวิทยากร", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
};

const STATUSES = [
  { v: "new", label: "ลงทะเบียนใหม่" },
  { v: "contacted", label: "ติดต่อแล้ว" },
  { v: "confirmed", label: "ยืนยันเข้าเรียน" },
  { v: "paid", label: "ชำระเงินแล้ว" },
  { v: "cancelled", label: "ยกเลิก" },
];

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const checkAdmin = useServerFn(checkIsAdmin);
  const claim = useServerFn(claimFirstAdmin);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
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
        <div className="max-w-md text-center p-8 rounded-2xl bg-card border border-border shadow-card-soft">
          <Shield className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="text-2xl font-bold">ยังไม่มีสิทธิ์เข้าถึง</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            บัญชีนี้ยังไม่ได้รับสิทธิ์ Admin หากคุณเป็นผู้ดูแลคนแรก กดปุ่มด้านล่างเพื่อรับสิทธิ์
          </p>
          <button
            onClick={async () => {
              try {
                const r = await claim();
                if (r.claimed) {
                  toast.success("รับสิทธิ์ Admin สำเร็จ");
                  setIsAdmin(true);
                } else {
                  toast.error("มี Admin อยู่แล้ว โปรดติดต่อผู้ดูแลระบบ");
                }
              } catch {
                toast.error("เกิดข้อผิดพลาด");
              }
            }}
            className="mt-6 px-6 py-2.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-glow"
          >
            รับสิทธิ์ Admin คนแรก
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-3 block mx-auto text-sm text-muted-foreground hover:text-foreground"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const fn =
        mode === "signin"
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: `${window.location.origin}/admin` },
            });
      const { error } = await fn;
      if (error) toast.error(error.message);
      else if (mode === "signup") toast.success("สมัครสำเร็จ เข้าสู่ระบบได้เลย");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-hero isan-pattern px-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Toaster richColors position="top-center" />
      <form
        onSubmit={submit}
        className="w-full max-w-sm p-8 rounded-3xl bg-card border border-border shadow-card-soft"
      >
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient grid place-items-center shadow-glow">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-center">Admin Panel</h1>
        <p className="text-center text-sm text-slate-300 mt-1">
          {mode === "signin" ? "เข้าสู่ระบบเพื่อจัดการ" : "สมัครบัญชี Admin"}
        </p>

        <div className="space-y-3 mt-6">
          <input
            type="email"
            required
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border outline-none focus:border-primary"
          />
        </div>

        <button
          disabled={busy}
          className="w-full mt-5 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-bold shadow-glow disabled:opacity-60"
        >
          {busy ? "กำลังดำเนินการ..." : mode === "signin" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-3 text-sm text-slate-300 hover:text-gold"
        >
          {mode === "signin" ? "ยังไม่มีบัญชี? สมัครที่นี่" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const list = useServerFn(listRegistrations);
  const update = useServerFn(updateRegistrationStatus);
  const [rows, setRows] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  async function refresh() {
    setLoading(true);
    try {
      const data = await list();
      setRows(data as Reg[]);
    } catch (e) {
      console.error(e);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (channelFilter !== "all" && (r.source_channel ?? "LINE_LIFF") !== channelFilter) return false;
      if (q) {
        const s = q.toLowerCase();
        return (
          r.full_name.toLowerCase().includes(s) ||
          r.phone.toLowerCase().includes(s) ||
          r.registration_code.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [rows, q, statusFilter, channelFilter]);

  const stats = useMemo(() => {
    let googleFormTotal = 0;
    let googleFormPaid = 0;
    let googleFormRevenue = 0;

    let numnakomTotal = 0;
    let numnakomPaid = 0;
    let numnakomRevenue = 0;

    let paramateTotal = 0;
    let paramatePaid = 0;
    let paramateRevenue = 0;

    let domeTotal = 0;
    let domePaid = 0;
    let domeRevenue = 0;

    let otherSpeakersTotal = 0;
    let otherSpeakersPaid = 0;
    let otherSpeakersRevenue = 0;

    let genericLiffTotal = 0;
    let genericLiffPaid = 0;
    let genericLiffRevenue = 0;

    let checkedInCount = 0;
    let totalPaidCount = 0;
    let totalUnpaidCount = 0;

    rows.forEach((r) => {
      const channel = r.source_channel || "LINE_LIFF";
      const status = r.status;
      const isPaid = status === "paid" || status === "checked_in";
      const isCheckedIn = status === "checked_in";

      // Parse payment amount
      let amt = 0;
      if (isPaid) {
        const cleaned = (r.payment_amount || "").replace(/[^0-9.]/g, "");
        amt = parseFloat(cleaned) || 2999;
      }

      if (isCheckedIn) checkedInCount++;
      if (isPaid) {
        totalPaidCount++;
      } else if (status !== "cancelled") {
        totalUnpaidCount++;
      }

      const campaign = (r.campaign_code || "").toUpperCase();
      const refName = r.referrer_name || "";

      if (channel === "GOOGLE_FORM_EXPO") {
        googleFormTotal++;
        if (isPaid) {
          googleFormPaid++;
          googleFormRevenue += amt;
        }
      } else if (channel === "LINE_LIFF_NUMNAKOM") {
        numnakomTotal++;
        if (isPaid) {
          numnakomPaid++;
          numnakomRevenue += amt;
        }
      } else if (channel === "SPEAKER_REFERRAL" || campaign.startsWith("SPEAKER-") || r.source_channel === "LINE_LIFF_PREMIUM") {
        // Speaker Referral
        if (refName === "ปรเมศวร์ มินศิริ" || campaign.includes("PARAMATE")) {
          paramateTotal++;
          if (isPaid) {
            paramatePaid++;
            paramateRevenue += amt;
          }
        } else if (refName === "โดม เจริญยศ" || campaign.includes("DOME")) {
          domeTotal++;
          if (isPaid) {
            domePaid++;
            domeRevenue += amt;
          }
        } else {
          otherSpeakersTotal++;
          if (isPaid) {
            otherSpeakersPaid++;
            otherSpeakersRevenue += amt;
          }
        }
      } else {
        // Generic LINE_LIFF
        genericLiffTotal++;
        if (isPaid) {
          genericLiffPaid++;
          genericLiffRevenue += amt;
        }
      }
    });

    return {
      googleForm: { total: googleFormTotal, paid: googleFormPaid, revenue: googleFormRevenue },
      numnakom: { total: numnakomTotal, paid: numnakomPaid, revenue: numnakomRevenue },
      paramate: { total: paramateTotal, paid: paramatePaid, revenue: paramateRevenue },
      dome: { total: domeTotal, paid: domePaid, revenue: domeRevenue },
      otherSpeakers: { total: otherSpeakersTotal, paid: otherSpeakersPaid, revenue: otherSpeakersRevenue },
      genericLiff: { total: genericLiffTotal, paid: genericLiffPaid, revenue: genericLiffRevenue },
      checkedInCount,
      totalPaidCount,
      totalUnpaidCount,
      totalRevenue: googleFormRevenue + numnakomRevenue + paramateRevenue + domeRevenue + otherSpeakersRevenue + genericLiffRevenue,
    };
  }, [rows]);

  async function changeStatus(id: string, status: string) {
    try {
      await update({ data: { id, status } });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success("อัปเดตสถานะแล้ว");
    } catch {
      toast.error("อัปเดตไม่สำเร็จ");
    }
  }

  function exportCsv() {
    const headers = [
      "Registration ID",
      "Source Channel",
      "Full name",
      "Phone",
      "LINE ID",
      "Email",
      "Province",
      "District",
      "Occupation",
      "Interest",
      "Status",
      "Payment Amount",
      "Created",
      "Referrer Type",
      "Referrer Name",
      "Campaign Code",
      "Voucher Source",
    ];
    const lines = [headers.join(",")];
    for (const r of filtered) {
      lines.push(
        [
          r.registration_code,
          r.source_channel ?? "LINE_LIFF",
          r.full_name,
          r.phone,
          r.line_id,
          r.email ?? "",
          r.province ?? "",
          r.district ?? "",
          r.occupation ?? "",
          r.interest_topic ?? "",
          r.status,
          r.payment_amount ?? "",
          r.created_at,
          r.referrer_type ?? "",
          r.referrer_name ?? "",
          r.campaign_code ?? "",
          r.voucher_source ?? "",
        ]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      );
    }
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Toaster richColors position="top-center" />

      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            <h1 className="font-bold">Admin Panel</h1>
            <span className="text-xs text-slate-300 ml-2">
              {filtered.length} / {rows.length} รายการ
            </span>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-300 hover:text-white flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">เช็คอินหน้างาน</p>
            <p className="text-3xl font-black text-gold">{stats.checkedInCount} <span className="text-xs font-semibold text-slate-300">คน</span></p>
            <p className="text-[10px] text-slate-400 mt-1">สแกน QR รับคูปองแล้ว</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">ยอดผู้ลงทะเบียน (ชำระแล้ว / รออนุมัติ)</p>
            <p className="text-3xl font-black text-green-400">
              {stats.totalPaidCount} <span className="text-xs font-semibold text-slate-300">/ {stats.totalUnpaidCount} คน</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">ทั้งหมด {rows.length} คน (ไม่รวมที่ยกเลิก)</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">รายได้มัดจำรวม</p>
            <p className="text-3xl font-black text-green-400">{stats.totalRevenue.toLocaleString()} <span className="text-xs font-semibold text-slate-300">บาท</span></p>
            <p className="text-[10px] text-slate-400 mt-1">คำนวณจากคนที่จ่ายเงินแล้ว</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card-soft">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">สัดส่วนผู้เข้าร่วม</p>
            <div className="text-xs text-slate-300 mt-1.5 space-y-1">
              <div className="flex justify-between"><span>Google Form:</span> <strong>{stats.googleForm.total} คน</strong></div>
              <div className="flex justify-between"><span>หนุ่มนักออม:</span> <strong>{stats.numnakom.total} คน</strong></div>
              <div className="flex justify-between"><span>วิทยากร (Speaker):</span> <strong>{stats.paramate.total + stats.dome.total + stats.otherSpeakers.total} คน</strong></div>
            </div>
          </div>
        </div>

        {/* Detailed channel breakdown table */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-8 shadow-card-soft">
          <h3 className="font-extrabold text-sm mb-4 text-slate-200">📊 สรุปยอดตามช่องทางวิทยากรและแคมเปญ (Referral Stats)</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <p className="text-xs font-bold text-slate-300">Google Form (กลางงาน)</p>
              <p className="text-lg font-extrabold text-white mt-1">{stats.googleForm.total} คน</p>
              <p className="text-[10px] text-slate-400 mt-0.5">จ่ายแล้ว: {stats.googleForm.paid} คน ({stats.googleForm.revenue.toLocaleString()} บ.)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <p className="text-xs font-bold text-slate-300">หนุ่มนักออม</p>
              <p className="text-lg font-extrabold text-white mt-1">{stats.numnakom.total} คน</p>
              <p className="text-[10px] text-slate-400 mt-0.5">จ่ายแล้ว: {stats.numnakom.paid} คน ({stats.numnakom.revenue.toLocaleString()} บ.)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40 border-purple-500/20 bg-purple-500/5">
              <p className="text-xs font-bold text-purple-300">Speaker: ปรเมศวร์</p>
              <p className="text-lg font-extrabold text-white mt-1">{stats.paramate.total} คน</p>
              <p className="text-[10px] text-purple-400 mt-0.5">จ่ายแล้ว: {stats.paramate.paid} คน ({stats.paramate.revenue.toLocaleString()} บ.)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40 border-purple-500/20 bg-purple-500/5">
              <p className="text-xs font-bold text-purple-300">Speaker: โดม</p>
              <p className="text-lg font-extrabold text-white mt-1">{stats.dome.total} คน</p>
              <p className="text-[10px] text-purple-400 mt-0.5">จ่ายแล้ว: {stats.dome.paid} คน ({stats.dome.revenue.toLocaleString()} บ.)</p>
            </div>
          </div>
          {(stats.otherSpeakers.total > 0 || stats.genericLiff.total > 0) && (
            <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-border/40">
              {stats.otherSpeakers.total > 0 && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
                  <p className="text-xs font-bold text-slate-300">วิทยากรอื่นๆ</p>
                  <p className="text-lg font-extrabold text-white mt-1">{stats.otherSpeakers.total} คน</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">จ่ายแล้ว: {stats.otherSpeakers.paid} คน ({stats.otherSpeakers.revenue.toLocaleString()} บ.)</p>
                </div>
              )}
              {stats.genericLiff.total > 0 && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
                  <p className="text-xs font-bold text-slate-300">LINE LIFF ทั่วไป</p>
                  <p className="text-lg font-extrabold text-white mt-1">{stats.genericLiff.total} คน</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">จ่ายแล้ว: {stats.genericLiff.paid} คน ({stats.genericLiff.revenue.toLocaleString()} บ.)</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="ค้นหาชื่อ / เบอร์ / รหัส"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-input border border-border outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-input border border-border outline-none focus:border-primary"
          >
            <option value="all">ทุกสถานะ</option>
            {STATUSES.map((s) => (
              <option key={s.v} value={s.v}>{s.label}</option>
            ))}
          </select>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-input border border-border outline-none focus:border-primary"
          >
            <option value="all">ทุกช่องทาง</option>
            {Object.entries(SOURCE_BADGE).map(([v, b]) => (
              <option key={v} value={v}>{b.label}</option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-primary-foreground font-semibold flex items-center gap-2 shadow-glow"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ช่องทาง</th>
                  <th className="px-4 py-3">ชื่อ</th>
                  <th className="px-4 py-3">เบอร์</th>
                  <th className="px-4 py-3">LINE</th>
                  <th className="px-4 py-3">จังหวัด</th>
                  <th className="px-4 py-3">อาชีพ</th>
                  <th className="px-4 py-3">สนใจ</th>
                  <th className="px-4 py-3">วันที่</th>
                  <th className="px-4 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-slate-300">
                      <Loader2 className="w-5 h-5 animate-spin inline" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-slate-300">
                      ยังไม่มีรายการ
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/40">
                      <td className="px-4 py-3 font-mono text-xs text-gold">
                        {r.registration_code}
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const ch = r.source_channel ?? "LINE_LIFF";
                          const b = SOURCE_BADGE[ch] ?? { label: ch, color: "bg-muted/20 text-muted-foreground border-border" };
                          const label = ch === "SPEAKER_REFERRAL" && r.referrer_name ? `Speaker: ${r.referrer_name}` : b.label;
                          return (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${b.color}`}>
                              {label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 font-semibold">{r.full_name}</td>
                      <td className="px-4 py-3">{r.phone}</td>
                      <td className="px-4 py-3">{r.line_id}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {r.province ?? "-"} {r.district ? `/ ${r.district}` : ""}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{r.occupation ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-300">{r.interest_topic ?? "-"}</td>
                      <td className="px-4 py-3 text-xs text-slate-300">
                        {new Date(r.created_at).toLocaleString("th-TH")}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          onChange={(e) => changeStatus(r.id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-input border border-border text-xs"
                        >
                          {STATUSES.map((s) => (
                            <option key={s.v} value={s.v}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
