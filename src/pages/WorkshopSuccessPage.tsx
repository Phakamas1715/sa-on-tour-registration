import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, CreditCard, LockKeyhole, MessageCircle, Ticket } from "lucide-react";
import loginBg from "@/assets/login-bg.png";

export default function WorkshopSuccessPage() {
  const [params] = useSearchParams();
  const code = params.get("code") || "SAON-KK-XXXX";
  const token = params.get("token");
  const checkinUrl =
    token && code
      ? `${window.location.origin}/admin/checkin?code=${encodeURIComponent(code)}&token=${encodeURIComponent(token)}`
      : "";
  const qrUrl = checkinUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`
    : "";

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <img src={loginBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950 to-slate-950" />
      </div>

      <main className="pt-28 pb-16 px-4">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-400/30 grid place-items-center">
            <CheckCircle2 className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <Badge className="bg-yellow-500/10 text-yellow-300 border-yellow-400/30">
              WAIT_DEPOSIT
            </Badge>
            <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-black">
              จองสิทธิ์ Smart Business AI Workshop 2026 สำเร็จ
            </h1>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              ระบบบันทึกข้อมูลลงทะเบียนแล้ว กรุณาโอนมัดจำ 2,999 บาท และส่งสลิปให้เจ้าหน้าที่ทาง LINE
              เพื่อปลดล็อก QR Code คูปองสำหรับยืนยันสิทธิ์หน้างาน
            </p>
          </div>

          <Card className="bg-slate-900/70 border-white/10 text-left rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">รหัสลงทะเบียน</p>
                  <p className="font-heading text-2xl font-black text-white tracking-wide">{code}</p>
                </div>
                <Ticket className="w-8 h-8 text-primary" />
              </div>

              <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">ยอดมัดจำ</p>
                  <p className="font-heading text-2xl font-black text-yellow-400">2,999 บาท</p>
                  <p className="text-xs text-slate-500 mt-1">ธนาคารกสิกรไทย • เลขบัญชี 123-4-56789-0</p>
                </div>
                <CreditCard className="w-7 h-7 text-green-400" />
              </div>

              <div className="rounded-2xl bg-black/40 border border-dashed border-yellow-400/30 p-5 text-center">
                {qrUrl ? (
                  <div className="relative inline-block">
                    <img src={qrUrl} alt="Locked coupon QR" className="w-40 h-40 rounded-xl opacity-25 grayscale" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="rounded-full bg-slate-950/90 border border-yellow-400/30 p-4">
                        <LockKeyhole className="w-8 h-8 text-yellow-300" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <LockKeyhole className="w-12 h-12 text-yellow-300 mx-auto" />
                )}
                <p className="mt-3 font-heading font-bold text-yellow-300">QR Code ถูกล็อกอยู่</p>
                <p className="mt-1 text-xs text-slate-400">
                  เจ้าหน้าที่จะปลดล็อกหลังตรวจสอบยอดมัดจำ และส่งข้อความยืนยันกลับทาง LINE
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://line.me/R/ti/p/@ugm3067r" target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto rounded-xl bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                ส่งสลิปทาง LINE
              </Button>
            </a>
            <Link to="/register">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-white/10 text-white hover:bg-white/10">
                กลับหน้าลงทะเบียน
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
