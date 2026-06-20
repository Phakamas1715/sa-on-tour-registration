import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
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
          ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดการเข้าเรียน
        </p>

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
