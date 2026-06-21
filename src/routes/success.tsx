import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Lock, Sparkles, Copy, MessageCircle } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({
      code: z.string().optional(),
      slip: z.boolean().optional().or(z.string().transform((v) => v === "true")),
    }).parse(s),
  head: () => ({
    meta: [{ title: "จองสิทธิ์สำเร็จ – สะออนทัวร์ Workshop" }],
  }),
  component: SuccessPage,
});

const LINE_OA_URL = "https://line.me/R/ti/p/@saontour";

function SuccessPage() {
  const { code, slip } = Route.useSearch();
  const [copied, setCopied] = useState(false);

  function copyCode() {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success("คัดลอกรหัสแล้ว");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-hero isan-pattern relative overflow-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <Toaster richColors position="top-center" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-5 animate-fade-up">

          {/* ── Status header ── */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gold-gradient blur-2xl opacity-40 rounded-full animate-pulse-soft" />
              <div className="relative w-20 h-20 rounded-full bg-gold-gradient grid place-items-center shadow-glow mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold">จองสิทธิ์สำเร็จ!</h1>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400">รอตรวจสอบมัดจำ (WAIT_DEPOSIT)</span>
            </div>
          </div>

          {/* ── Registration code card ── */}
          {code && (
            <div className="glass-card rounded-3xl p-5 space-y-1 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                รหัสลงทะเบียนของคุณ
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-2xl font-extrabold bg-gold-gradient bg-clip-text text-transparent tracking-wider">
                  {code}
                </p>
                <button
                  onClick={copyCode}
                  className="p-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 transition"
                  title="คัดลอก"
                >
                  {copied
                    ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                    : <Copy className="w-4 h-4 text-gold" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" /> บันทึกรหัสนี้ไว้อ้างอิงกับทีมงาน
              </p>
            </div>
          )}

          {/* ── Locked QR placeholder ── */}
          <div className="glass-card rounded-3xl p-6 text-center space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              คูปอง QR Code เข้างาน
            </p>
            <div className="relative mx-auto w-36 h-36">
              {/* Blurred QR placeholder */}
              <div className="w-full h-full rounded-2xl bg-white/10 border border-border/40 grid place-items-center blur-sm select-none">
                <div className="grid grid-cols-3 gap-1 p-3 opacity-30">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${i % 3 === 0 || i > 5 ? "bg-foreground" : "bg-foreground/50"}`}
                      style={{ width: 28, height: 28 }}
                    />
                  ))}
                </div>
              </div>
              {/* Lock icon overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 grid place-items-center backdrop-blur-sm">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-[9px] font-black text-amber-400 bg-background/80 px-2 py-0.5 rounded-full">
                  LOCKED
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed px-2">
              QR Code จะ<span className="font-bold text-gold">ปลดล็อกอัตโนมัติ</span>หลังเจ้าหน้าที่ตรวจสอบสลิปมัดจำเรียบร้อยแล้ว
            </p>
          </div>

          {/* ── Bank transfer info ── */}
          <div className="glass-card rounded-3xl overflow-hidden">
            <div
              className="p-4 text-center"
              style={{ background: "oklch(0.26 0.08 50 / 0.5)", borderBottom: "1px solid oklch(0.7 0.18 50 / 0.3)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-0.5">ยอดมัดจำ</p>
              <p className="text-4xl font-black text-gold">2,999</p>
              <p className="text-xs text-muted-foreground">บาท</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "oklch(0.22 0.05 262 / 0.8)" }}>
                <div className="w-9 h-9 rounded-xl grid place-items-center bg-green-500/15 shrink-0">
                  <span className="font-black text-green-400 text-sm">K</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ธนาคารกสิกรไทย</p>
                  <p className="font-extrabold text-gold text-lg leading-tight">405-3-05346-3</p>
                  <p className="text-xs text-muted-foreground">อัจฉรีญา โถนารัตน์</p>
                </div>
              </div>
              <div
                className="p-3 rounded-xl text-xs font-semibold leading-relaxed"
                style={{ background: "oklch(0.7 0.18 50 / 0.08)", border: "1px solid oklch(0.7 0.18 50 / 0.2)", color: "oklch(0.88 0.06 50)" }}
              >
                {slip ? (
                  <span>
                    📌 <strong>ได้รับสลิปแล้ว:</strong> ระบบได้รับหลักฐานการโอนเงินและข้อมูลของท่านแล้ว เจ้าหน้าที่จะตรวจสอบสลิปและส่งตั๋ว QR Code ให้ท่านทาง LINE OA
                  </span>
                ) : (
                  <span>
                    📌 <strong>ขั้นตอนถัดไป:</strong> โอนเงิน 2,999 บาท แล้วส่งรูปสลิป พร้อมรหัส <strong>{code ?? "SAON-KK-XXXX"}</strong> ทาง LINE เจ้าหน้าที่ด้านล่างได้เลย
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Gift voucher notice ── */}
          <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 text-gold text-sm font-semibold text-center">
            🎁 รับ Gift Voucher เรียนฟรี 3,000 บาท ที่จุดลงทะเบียนงาน Smart Business Expo!
          </div>

          {/* ── Action buttons ── */}
          <div className="space-y-3">
            <a
              href={LINE_OA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg"
              style={{ background: "#06C755" }}
            >
              <MessageCircle className="w-5 h-5" />
              {slip ? "ติดต่อสอบถามทาง LINE OA" : "ส่งสลิปทาง LINE เจ้าหน้าที่"}
            </a>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-card hover:bg-accent transition font-semibold text-sm"
            >
              <Home className="w-4 h-4" /> กลับสู่หน้าหลัก
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
