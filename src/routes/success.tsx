import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Sparkles, Calendar, MapPin, Gift } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => z.object({ code: z.string().optional() }).parse(s),
  head: () => ({
    meta: [{ title: "ลงทะเบียนสำเร็จ – สะออนทัวร์ Workshop" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { code } = Route.useSearch();
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 grid place-items-center px-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div className="max-w-lg w-full text-center animate-fade-up relative">
        {/* Decorative Thai pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_#D97706_1px,_transparent_1px)] bg-[length:20px_20px]" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,_#DC2626_1px,_transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="relative">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 blur-2xl opacity-40 rounded-full animate-pulse-soft" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 grid place-items-center shadow-2xl mx-auto ring-4 ring-amber-200/50">
              <CheckCircle2 className="w-14 h-14 text-white drop-shadow-lg" />
            </div>
          </div>

          <h1 className="mt-8 text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            ลงทะเบียนสำเร็จ!
          </h1>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed font-medium">
            ขอบคุณที่ลงทะเบียนเรียน <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700">
              สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น
            </span>
            <br />
            <span className="text-sm text-gray-500">ในงาน Smart Business Expo 2026</span>
          </p>

          {/* Event details reminder */}
          <div className="mt-6 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-200/60 shadow-lg text-left space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 rounded-lg bg-amber-100">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
              <span className="text-gray-600">วันที่:</span>
              <span className="font-bold text-amber-800">28 มิถุนายน 2569</span>
              <span className="text-gray-500 text-xs">13.30 – 16.30 น.</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 rounded-lg bg-amber-100">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              </div>
              <span className="text-gray-600">สถานที่:</span>
              <span className="font-bold text-amber-800">KICE Hall 1-2</span>
              <span className="text-gray-500 text-xs">ห้อง M4-8</span>
            </div>
          </div>

          {/* Gift Voucher - Styled like traditional Thai envelope */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/10 to-pink-500/10 border-2 border-red-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-transparent rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tl from-rose-400/20 to-transparent rounded-full -ml-10 -mb-10" />
            <div className="relative flex items-center justify-center gap-2 mb-2">
              <div className="p-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                รับ Gift Voucher เรียนฟรี 3,000 บาท
              </span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              ที่จุดลงทะเบียนงาน <span className="font-bold text-red-600">Smart Business Expo</span> ในวันงาน
            </p>
          </div>

          {code && (
            <div className="mt-8 p-6 rounded-2xl bg-white border-2 border-amber-400 shadow-2xl relative">
              {/* Subtle decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-t-2xl" />

              <div className="relative">
                <p className="text-xs text-amber-600 uppercase tracking-[0.2em] font-bold">รหัสลงทะเบียนของคุณ</p>
                {/* Code with high contrast - dark text on light background */}
                <p className="mt-3 text-4xl font-black text-gray-800 tracking-wider">{code}</p>
                {/* Decorative underline */}
                <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-2" />

                <div className="mt-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <p className="text-xs text-gray-500 font-medium">
                    กรุณาเก็บรหัสนี้ไว้ <span className="text-amber-600 font-bold">อ้างอิงกับทีมงาน</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-4 h-4" /> กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
