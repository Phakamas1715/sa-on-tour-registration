import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Sparkles, Calendar, MapPin, Gift } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({ code: z.string().optional() }).parse(s),
  head: () => ({
    meta: [{ title: "ลงทะเบียนสำเร็จ – สะออนทัวร์ Workshop" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { code } = Route.useSearch();
  return (
    <div className="min-h-screen bg-hero isan-pattern grid place-items-center px-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div className="max-w-lg w-full text-center animate-fade-up">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gold-gradient blur-2xl opacity-50 rounded-full animate-pulse-soft" />
          <div className="relative w-24 h-24 rounded-full bg-gold-gradient grid place-items-center shadow-glow mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        <h1 className="mt-8 text-4xl sm:text-5xl font-extrabold">ลงทะเบียนสำเร็จ</h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          ขอบคุณที่ลงทะเบียนเรียน <br />
          <span className="font-semibold text-foreground">
            สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น
          </span>
          <br />
          ในงาน Smart Business Expo 2026
        </p>

        {/* Event details reminder */}
        <div className="mt-6 p-4 rounded-xl bg-card border border-border/40 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gold shrink-0" />
            <span className="text-muted-foreground">วันที่:</span>
            <span className="font-bold">28 มิถุนายน 2569 เวลา 13.30 – 16.30 น.</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <span className="text-muted-foreground">สถานที่:</span>
            <span className="font-bold">KICE Hall 1-2 ห้องประชุม M4-8</span>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5" />
            <span className="font-extrabold text-base">รับ Gift Voucher เรียนฟรี 3,000 บาท</span>
          </div>
          <p className="text-sm">
            ที่จุดลงทะเบียนงาน <span className="font-bold">Smart Business Expo</span> ในวันงาน
          </p>
        </div>

        {code && (
          <div className="mt-8 p-6 rounded-2xl bg-card border border-primary/40 shadow-glow">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              รหัสลงทะเบียนของคุณ
            </p>
            <p className="mt-2 text-3xl font-extrabold bg-gold-gradient bg-clip-text text-transparent tracking-wider">
              {code}
            </p>
            <p className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" /> กรุณาเก็บรหัสนี้ไว้อ้างอิงกับทีมงาน
            </p>
          </div>
        )}

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-accent transition font-semibold"
        >
          <Home className="w-4 h-4" /> กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
}
