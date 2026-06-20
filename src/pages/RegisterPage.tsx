import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Send,
  Loader2,
  User,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Sparkles,
  Ticket,
  Building,
  Check,
  Zap,
  Bot,
  Terminal,
  Cpu,
  CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import liff from "@line/liff";
import loginBg from "@/assets/login-bg.png";

const aiUseOptions = [
  { text: "สร้าง AI Agent เชื่อมต่อ LINE OA", emoji: "🤖", code: "LINE_OA_CONNECT" },
  { text: "ตอบแชทลูกค้าและจัดการงานอัตโนมัติ", emoji: "💬", code: "SALES_AUTOPILOT" },
  { text: "สร้างคอนเทนต์ TikTok ให้เร็วขึ้น", emoji: "🎬", code: "TIKTOK_CREATIVE" },
  { text: "ลดงานซ้ำซ้อน ประหยัดเวลา เพิ่มประสิทธิภาพ", emoji: "⚡", code: "WORKFLOW_OPTIMIZE" },
];

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [successData, setSuccessData] = useState<{
    code: string;
    name: string;
    qrUrl: string;
  } | null>(null);

  // LINE LIFF State
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [lineProfile, setLineProfile] = useState<{
    userId: string;
    displayName: string;
    pictureUrl?: string;
  } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("ขอนแก่น");
  const [district, setDistrict] = useState("");
  const [occupation, setOccupation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [hasLineOa, setHasLineOa] = useState("ยังไม่มี");

  const [selectedAiUses, setSelectedAiUses] = useState<string[]>([]);
  const [customAiUse, setCustomAiUse] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Gamification & Compilation states
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Initialize LINE LIFF
  useEffect(() => {
    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId) {
      console.warn("VITE_LIFF_ID not set. Running in Developer Mock Mode.");
      setIsMockMode(true);
      return;
    }

    liff.init({ liffId })
      .then(() => {
        setLiffInitialized(true);
        if (liff.isLoggedIn()) {
          liff.getProfile().then((profile) => {
            setLineProfile(profile);
            setFullName(profile.displayName);
          }).catch(err => {
            console.error("Failed to get profile:", err);
          });
        } else {
          liff.login();
        }
      })
      .catch((err) => {
        console.error("LIFF init error:", err);
        setIsMockMode(true);
        toast.error("ไม่สามารถเชื่อมต่อ LINE LIFF ได้ กำลังรันโหมดจำลอง");
      });
  }, []);

  const handleMockLogin = () => {
    setLineProfile({
      userId: "U_MOCK_" + Math.random().toString(36).substring(2, 9),
      displayName: "คุณสมชาย ใจดี (LINE จำลอง)",
      pictureUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Somchai"
    });
    setFullName("สมชาย ใจดี");
    toast.success("ล็อกอินบัญชี LINE (จำลอง) สำเร็จ!");
  };

  const toggleAiUse = (opt: string) => {
    setSelectedAiUses((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  const validateStep1 = () => {
    if (!fullName || !phone || !email || !province || !district) {
      toast.error("กรุณากรอกข้อมูลส่วนตัวผู้สร้าง (*) ให้ครบถ้วน");
      return false;
    }
    if (phone.replace(/-|\s/g, "").length < 9) {
      toast.error("กรุณาระบุเบอร์โทรศัพท์ผู้สร้างที่ถูกต้อง");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("กรุณาระบุอีเมลผู้สร้างที่ถูกต้อง");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const compileAgent = () => {
    return new Promise<void>((resolve) => {
      setIsCompiling(true);
      setCompilationLogs([]);

      const logs = [
        `[CMD] bash configure_agent.sh --creator="${fullName}"`,
        `> Initializing Agent Builder core v2.0.26...`,
        `> Mapping owner identity metadata [Phone: ${phone}]... OK`,
        `> Linking Business Domain: "${businessName || "ทั่วไป"}"... OK`,
        `> Mapping operation area: [จังหวัด: ${province}, อำเภอ: ${district}]...`,
        `> Connecting LINE profile ID: [${lineProfile?.userId.substring(0, 10)}...]... Done`,
        `> Mounting LINE Official Account status: [Status: ${hasLineOa}]... OK`,
        `> Programming skill module toggles: [${selectedAiUses.length} modules selected]...`,
        ...selectedAiUses.map((skill) => `  - Mounted module: ${skill}`),
        `> Injecting System prompt guidelines & core behaviors...`,
        customAiUse ? `  - System Prompt rule added: "${customAiUse}"` : `  - Standard prompt behaviors injected.`,
        `> Validating agent security policies & database schema... OK`,
        `> Generating unique Voucher Serial Key...`,
        `> Build complete! Preparing deployment to local cluster...`
      ];

      let currentLogIdx = 0;
      const interval = setInterval(() => {
        if (currentLogIdx < logs.length) {
          setCompilationLogs((prev) => [...prev, logs[currentLogIdx]]);
          currentLogIdx++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 200); // Progressively add log rows
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lineProfile) {
      toast.error("กรุณาล็อกอินด้วยบัญชี LINE ก่อนลงทะเบียน");
      return;
    }

    if (!termsAccepted) {
      toast.error("กรุณากดยินยอมข้อตกลงก่อนส่งข้อมูล");
      return;
    }

    // Trigger terminal animation
    await compileAgent();
    setIsSubmitting(true);

    try {
      let finalAiUse = [...selectedAiUses];
      if (customAiUse) {
        finalAiUse.push(`Promptคำสั่ง: ${customAiUse}`);
      }

      // Submit to registrations table
      const { data: reg, error: regError } = await supabase
        .from("registrations")
        .insert({
          line_user_id: lineProfile.userId,
          line_display_name: lineProfile.displayName,
          line_picture_url: lineProfile.pictureUrl || null,
          full_name: fullName,
          phone: phone,
          email: email,
          province: province,
          district: district,
          occupation: occupation || null,
          business_name: businessName || null,
          interest_topic: finalAiUse,
          has_line_oa: hasLineOa,
          wants_coupon: true,
          status: "new"
        })
        .select("id, registration_code")
        .single();

      if (regError) throw regError;

      // Query generated coupon details
      const { data: coupon, error: couponError } = await supabase
        .from("coupons")
        .select("coupon_token, final_price")
        .eq("registration_id", reg.id)
        .single();

      if (couponError) throw couponError;

      const checkinUrl = `${window.location.origin}/admin/checkin?code=${reg.registration_code}&token=${coupon.coupon_token}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`;

      // Invoke send-line-message edge function
      try {
        await supabase.functions.invoke("send-line-message", {
          body: {
            to: lineProfile.userId,
            type: "registration_success",
            data: {
              registration_code: reg.registration_code,
              full_name: fullName,
              coupon_token: coupon.coupon_token,
              final_price: coupon.final_price
            }
          }
        });
      } catch (lineErr) {
        console.error("LINE message delivery failed:", lineErr);
        toast.warning("สมัครสำเร็จ แต่ขัดข้องการส่งแชท LINE ยืนยันสิทธิ์");
      }

      setSuccessData({
        code: reg.registration_code || "",
        name: fullName,
        qrUrl: qrCodeUrl
      });
      toast.success("จองสิทธิ์และอัปเดตระบบ AI Agent เรียบร้อย!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      setIsCompiling(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col justify-between text-white">
        <Navbar />

        {/* Ambient background with grid overlays */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </div>

        {/* Decorative background glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[130px] pointer-events-none -z-10" />

        <div className="pt-28 pb-20 flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md relative animate-fade-in-up space-y-6">

            {/* Header Success info */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse">
                <CreditCard className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-xl font-bold text-white">จองสิทธิ์สำเร็จ (รอชำระมัดจำ) ⏳</h2>
              <p className="font-body text-slate-400 text-xs">กรุณาโอนเงินมัดจำเพื่อยืนยันที่นั่งและเปิดใช้งานสิทธิ์คูปอง</p>
            </div>

            {/* Premium Digital Voucher Ticket (License Style) */}
            <div className="relative border border-white/10 bg-slate-900/50 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-5 overflow-visible">

              {/* Ticket cut-outs */}
              <div className="absolute -left-[10px] top-[45%] -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border-r border-white/10 z-20" />
              <div className="absolute -right-[10px] top-[45%] -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border-l border-white/10 z-20" />

              {/* Top part of ticket: Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-heading text-[10px] text-yellow-500 font-bold uppercase tracking-wider">ใบอนุญาต & ตั๋วจองสัมมนา</span>
                    <h3 className="font-heading text-lg font-black text-white mt-0.5">Smart Business Expo 2026</h3>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] py-0.5 px-2.5 rounded-full font-heading">
                    WAIT_DEPOSIT
                  </Badge>
                </div>

                <div className="space-y-2 font-body text-xs text-slate-300 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ผู้ควบคุม Agent:</span>
                    <span className="font-bold text-white">{successData.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-orange-450">
                    <span>สิทธิ์ส่วนลดเวิร์กช็อป:</span>
                    <span className="font-bold">เรียนฟรี AI มูลค่า 3,000 บ.</span>
                  </div>
                  <div className="flex justify-between items-center text-white border-t border-white/5 pt-2">
                    <span className="text-slate-400 font-semibold text-yellow-500">ยอดเงินมัดจำที่ต้องชำระ:</span>
                    <span className="font-heading font-extrabold text-base text-yellow-500">2,999 บาท</span>
                  </div>
                </div>
              </div>

              {/* Bank Account Transfer Details */}
              <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] text-slate-400 font-heading uppercase tracking-wider">บัญชีโอนเงินมัดจำเพื่อจองสิทธิ์ (KBANK)</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center font-heading text-xs text-white font-black">
                      K
                    </div>
                    <div>
                      <p className="text-xs font-heading font-semibold text-white">ธนาคารกสิกรไทย</p>
                      <p className="text-[10px] font-body text-slate-400">บจก. เรเจ้นท์ ฮอลิเดย์</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-heading font-black text-white select-all">123-4-56789-0</p>
                  </div>
                </div>
              </div>

              {/* Attendance warning Box */}
              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-xl text-center">
                <p className="text-[10px] text-primary font-body font-semibold leading-relaxed">
                  ⚠️ เงื่อนไขสิทธิ์: ผู้ลงทะเบียนจองสิทธิ์ต้องจ่ายเงินมัดจำ 2,999 บาท และต้องแสดงคูปอง QR Code จากในงานเพื่อยืนยันสิทธิ์ลดก่อนเข้างานสัมมนา (รับจำนวนจำกัด)
                </p>
              </div>

              {/* Perforated Tear Line */}
              <div className="border-t border-dashed border-white/15 my-4 relative" />

              {/* Bottom part of ticket: QR Code & Code details */}
              <div className="space-y-4 text-center">
                <p className="text-[10px] text-slate-400 font-body">ส่งสลิปโอนเงินเข้า LINE เจ้าหน้าที่เพื่อเปิดใช้งาน QR Code ด้านล่างนี้</p>

                {/* QR Code container with brackets to simulate scan window */}
                <div className="relative inline-block p-4 bg-white rounded-2xl shadow-xl transform hover:scale-102 transition-all duration-300">
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary" />

                  <img src={successData.qrUrl} alt="Coupon QR Code" className="w-40 h-40 mx-auto opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
                    <p className="text-xs font-heading font-bold text-yellow-500 bg-black/85 border border-yellow-500/30 px-3 py-1.5 rounded-full">รอส่งสลิปอนุมัติ</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 text-[10px] font-heading uppercase tracking-wider">License ID / รหัสอ้างอิง</div>
                  <div className="text-xl font-heading font-black text-white tracking-widest bg-white/5 border border-white/10 rounded-xl py-2 px-6 inline-block">
                    {successData.code}
                  </div>
                </div>
              </div>

              {/* Info block footer */}
              <div className="border-t border-white/5 pt-4 text-left font-body text-[10px] text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">📍 <span>สถานที่: KICE Hall 1-2 ห้องประชุม M4-8 จ.ขอนแก่น</span></p>
                <p className="flex items-center gap-1.5">📅 <span>วันจัดสัมมนา: 28 มิถุนายน 2569 เวลา 10.00 - 19.00 น.</span></p>
              </div>

            </div>

            {/* Instruction on next steps */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-slate-300 text-[11px] font-body space-y-1.5">
              <p className="font-bold text-yellow-500 text-xs">ขั้นตอนถัดไปเพื่อยื่นยันสิทธิ์:</p>
              <p>1. โอนเงินมัดจำจำนวน 2,999 บาท ไปยังบัญชีธนาคารด้านบน</p>
              <p>2. แนบรูปสลิปหลักฐานการโอนส่งเข้าแชท LINE ของคุณ (ที่ได้รับคูปองแจ้งเตือน)</p>
              <p>3. เจ้าหน้าที่จะอนุมัติสิทธิ์ และส่งตั๋ว QR โค้ดที่พร้อมสแกนกลับไปให้ในแชท LINE</p>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-white flex flex-col justify-between">
      <Navbar />

      {/* Ambient background with grid overlays */}
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </div>

      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="pt-28 pb-20 flex-1 relative z-10">
        <div className="container max-w-6xl px-4 mx-auto">

          {/* Split Screen layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Event details */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 animate-fade-in-up">
              {/* Badges & Titles */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary font-heading text-xs font-semibold shrink-0">
                    <Cpu className="h-3.5 w-3.5 text-primary animate-spin" style={{ animationDuration: '4s' }} />
                    ระบบจอง AI Agent
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-heading text-[10px] font-semibold animate-pulse">
                    🔥 รับจำนวนจำกัด จำกัดสิทธิ์เฉพาะผู้โอนมัดจำก่อน
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-black leading-tight text-white">
                  Smart Business<br />
                  <span className="text-gradient-primary">AI Workshop 2026</span>
                </h1>
                <p className="font-body text-xs md:text-sm text-slate-400 leading-relaxed">
                  แดชบอร์ดฝึกสอนและสำรองสิทธิ์ AI Agent เวิร์กช็อปขอนแก่น! กรุณากรอกข้อมูล
                  และชำระค่ามัดจำจองที่นั่งเนื่องจาก <strong>รับจำนวนจำกัดเฉพาะผู้โอนก่อนเท่านั้น</strong>
                </p>
              </div>

              {/* Event Schedule & Location Card */}
              <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/15 mt-0.5">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-heading uppercase tracking-wider">วันสัมมนาภาคปฏิบัติ</p>
                    <p className="text-xs font-body text-white font-semibold mt-0.5">28 มิถุนายน 2569</p>
                    <p className="text-[11px] text-slate-400 font-body">เวลาปฏิบัติการ: 10:00 - 19:00 น.</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start border-t border-white/5 pt-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/15 mt-0.5">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-heading uppercase tracking-wider">ห้องปฏิบัติการเรียนรู้</p>
                    <p className="text-xs font-body text-white font-semibold mt-0.5">KICE Hall 1-2 ห้องประชุม M4-8</p>
                    <p className="text-[11px] text-slate-400 font-body">จังหวัดขอนแก่น</p>
                  </div>
                </div>
              </div>

              {/* Workshop Outlines */}
              <div className="space-y-3">
                <h3 className="font-heading text-xs font-bold text-slate-400 tracking-wider uppercase">ทักษะที่ Agent จะได้รับการฝึกสอน</h3>
                <div className="grid gap-2.5">
                  {[
                    { emoji: "🤖", title: "ทักษะสื่อสารเชื่อมต่อ LINE OA API", desc: "เชื่อมต่อบอทให้ตอบคำถาม ให้บริการ และส่งการแจ้งเตือนหาลูกค้าแบบอัตโนมัติ" },
                    { emoji: "💬", title: "ทักษะงานขาย Autopilot ปิดยอดแชท", desc: "รับคำสั่งซื้อ บันทึกสินค้า สรุปราคารวม และปิดการขายได้อย่างเป็นระบบ" },
                    { emoji: "🎬", title: "ทักษะผลิตไอเดียสื่อโซเชียลมีเดีย TikTok", desc: "คิดพล็อต เขียนบทพากย์ จัดทำ Storyboard วิดีโอสั้นได้ใน 3 วินาที" },
                    { emoji: "⚡", title: "ทักษะเชื่อมต่อ API & ฐานข้อมูลองค์กร", desc: "เชื่อมโยงข้อมูลเข้าระบบ Google Sheets, CRM และจัดการงานซ้ำซ้อนหลังบ้าน" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all duration-300 group">
                      <span className="text-base bg-slate-900 border border-white/10 p-1.5 rounded-xl shrink-0 w-9 h-9 flex items-center justify-center group-hover:border-primary/45 transition-colors">{item.emoji}</span>
                      <div>
                        <h4 className="text-xs font-heading font-semibold text-white group-hover:text-primary transition-colors">{item.title}</h4>
                        <p className="text-[10px] font-body text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Promo Card */}
              <div className="relative border border-primary/20 rounded-2xl p-4 bg-gradient-to-br from-primary/10 to-transparent flex gap-3.5 items-center overflow-hidden shadow-lg">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                  <Ticket className="h-5 w-5 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-heading font-bold">สิทธิ์แลกซื้อบัตรเข้าเวิร์กช็อป</p>
                  <p className="text-[11px] text-slate-300 font-body mt-0.5">ชำระมัดจำจองเพียง 2,999 บ. จากปกติ 5,999 บ. (ได้สิทธิ์เรียนฟรี AI มูลค่า 3,000 บ.)</p>
                </div>
              </div>
            </div>

            {/* Right Column: Registration stepper & card */}
            <div className="lg:col-span-7">

              {/* LIFF Connection pill indicator */}
              {lineProfile && (
                <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={lineProfile.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=LINE"}
                        className="w-9 h-9 rounded-full border border-white/20 object-cover"
                        alt="LINE User Profile"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-body">ผู้สร้าง (LINE Connected)</p>
                      <h4 className="text-xs font-heading font-semibold text-white truncate max-w-[150px] sm:max-w-xs">{lineProfile.displayName}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMockMode && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px] py-0.5 px-2">
                        โหมดจำลอง
                      </Badge>
                    )}
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[9px] py-0.5 px-2">
                      Ready
                    </Badge>
                  </div>
                </div>
              )}

              {/* Wizard Steps Card */}
              <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] p-6 md:p-8 relative overflow-hidden space-y-6">

                {/* Visual grid overlay for premium dashboard look */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Limited Quota Warning box */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-center animate-pulse relative z-10">
                  <p className="text-[10px] text-red-400 font-body font-semibold">
                    ⚠️ โควตาสัมมนาจำกัด (รับจำนวนจำกัด): ผู้ลงทะเบียนจองต้องจ่ายเงินมัดจำ 2,999 บาท และยื่นคูปอง QR Code เพื่อยืนยันสิทธิ์ลดก่อนเข้างาน
                  </p>
                </div>

                {/* Progress bar Stepper */}
                {lineProfile && (
                  <div className="relative z-10 border-b border-white/5 pb-6">
                    <div className="flex justify-between items-center max-w-md mx-auto relative px-4">
                      {/* Grey Connector Line */}
                      <div className="absolute left-6 right-6 h-[2px] bg-white/5 top-1/2 -translate-y-1/2 z-0" />
                      {/* Active Gradient Line */}
                      <div
                        className="absolute left-6 h-[2px] bg-gradient-to-r from-primary to-accent top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${(currentStep - 1) * 44}%` }}
                      />

                      {[
                        { step: 1, label: "ข้อมูลผู้สร้าง", icon: User },
                        { step: 2, label: "ทักษะ & คำสั่ง", icon: Bot },
                        { step: 3, label: "บิวท์ & ติดตั้ง", icon: Award }
                      ].map((s) => {
                        const IconComponent = s.icon;
                        const isCompleted = currentStep > s.step;
                        const isActive = currentStep === s.step;

                        return (
                          <div key={s.step} className="flex flex-col items-center z-10 relative">
                            <button
                              type="button"
                              disabled={currentStep < s.step && !isCompleted}
                              onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                              className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-500 cursor-pointer ${
                                isActive
                                  ? "bg-slate-950 border-primary text-primary shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110"
                                  : isCompleted
                                  ? "bg-primary border-primary text-white"
                                  : "bg-slate-950 border-white/10 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {isCompleted ? <Check className="h-5 w-5" /> : <IconComponent className="h-4 w-4" />}
                            </button>
                            <span className={`text-[10px] font-heading mt-2 transition-colors duration-300 ${
                              isActive ? "text-primary font-bold" : isCompleted ? "text-white" : "text-slate-500"
                            }`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Form Panels */}
                <div className="relative z-10">

                  {/* Auth / Not logged in State */}
                  {!lineProfile ? (
                    <div className="text-center py-6 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-bounce">
                        <MessageSquare className="h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading font-bold text-xl text-white">ลงทะเบียนเพื่อเชื่อมต่อ LINE</h3>
                        <p className="font-body text-slate-300 text-sm max-w-sm mx-auto leading-relaxed">
                          เชื่อมต่อ LINE บัญชีของคุณกับคอนโซลควบคุม เพื่อส่งมอบสิทธิ์ติดตั้งคูปอง Agent ไปยังแชทของท่านโดยตรง
                        </p>
                      </div>

                      <div className="py-4">
                        {isMockMode ? (
                          <Button
                            onClick={handleMockLogin}
                            className="bg-green-600 hover:bg-green-700 text-white font-heading font-black px-10 py-7 rounded-2xl text-base shadow-xl shadow-green-600/25 active:scale-95 transition-all"
                          >
                            🟢 เชื่อมต่อ LINE (โหมดจำลองระบบ)
                          </Button>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="font-body text-sm text-slate-400">กำลังเชื่อมโยง LINE LIFF API...</span>
                          </div>
                        )}
                      </div>

                      {isMockMode && (
                        <p className="text-[10px] text-slate-500 font-body">
                          * รันในโหมดจำลองระบบเนื่องจากไม่พบคีย์ VITE_LIFF_ID ในการใช้งานปัจจุบัน
                        </p>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

                      {/* === STEP 1: Personal Profile (Agent Creator) === */}
                      {currentStep === 1 && (
                        <div className="space-y-5 animate-fade-in-up">
                          <div className="border-b border-white/5 pb-2">
                            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                              <User className="h-4.5 w-4.5 text-primary animate-pulse" />
                              ขั้นตอนที่ 1: กำหนดตัวแปรข้อมูลผู้สร้าง (Agent Creator Setup)
                            </h3>
                            <p className="text-[10px] text-slate-400 font-body">กรอกข้อมูลผู้ใช้งานที่จะเป็นคนควบคุมและป้อนข้อมูลให้ Agent</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">

                            {/* Fullname */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">ชื่อผู้ควบคุมหลัก (ชื่อ-นามสกุล) <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="กรอกชื่อ-นามสกุลผู้ดูแล"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                  required
                                />
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">เบอร์โทรศัพท์ผู้สร้าง <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="08x-xxx-xxxx"
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                  required
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">อีเมลยืนยันสิทธิ์ <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="yourname@email.com"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                  required
                                />
                              </div>
                            </div>

                            {/* Province */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">พื้นที่ปฏิบัติการ (จังหวัด) <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="เช่น ขอนแก่น"
                                  value={province}
                                  onChange={(e) => setProvince(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                  required
                                />
                              </div>
                            </div>

                            {/* District */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">พื้นที่ปฏิบัติการ (อำเภอ) <span className="text-destructive">*</span></Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="เช่น เมืองขอนแก่น"
                                  value={district}
                                  onChange={(e) => setDistrict(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                  required
                                />
                              </div>
                            </div>

                            {/* Occupation */}
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-slate-300">อาชีพ / สังกัดผู้สั่งการ</Label>
                              <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="เช่น เจ้าของธุรกิจทัวร์ / สตาร์ทอัพ"
                                  value={occupation}
                                  onChange={(e) => setOccupation(e.target.value)}
                                  className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                                />
                              </div>
                            </div>

                          </div>

                          {/* Brand Company Name */}
                          <div className="space-y-2">
                            <Label className="font-heading font-semibold text-xs text-slate-300">แบรนด์สินค้า / องค์กรที่ Agent จะช่วยดูแลงาน (ถ้ามี)</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input
                                placeholder="เช่น บจก. สะออนทัวร์ มีเดีย"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="pl-9 h-11 rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* === STEP 2: Configure Skills & Prompt === */}
                      {currentStep === 2 && (
                        <div className="space-y-5 animate-fade-in-up">
                          <div className="border-b border-white/5 pb-2">
                            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                              <Bot className="h-4.5 w-4.5 text-primary" />
                              ขั้นตอนที่ 2: โปรแกรมทักษะ & ป้อนชุดคำสั่ง (Agent Skills & Prompt)
                            </h3>
                            <p className="text-[10px] text-slate-400 font-body">ตั้งค่าฟังก์ชันสมองกลและคำสั่งควบคุมที่ต้องการป้อนให้กับ AI Agent ของคุณ</p>
                          </div>

                          {/* LINE OA status selector */}
                          <div className="space-y-3">
                            <Label className="font-heading font-semibold text-xs text-slate-300">ระบบ LINE OA สำหรับประจำการ Agent <span className="text-destructive">*</span></Label>
                            <div className="grid grid-cols-3 gap-3">
                              {["ยังไม่มี", "มีแล้ว", "กำลังจะเปิด"].map((opt) => {
                                const isSelected = hasLineOa === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setHasLineOa(opt)}
                                    className={`py-3 rounded-xl border font-body text-xs transition-all active:scale-[0.97] ${
                                      isSelected
                                        ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_12px_rgba(249,115,22,0.2)]"
                                        : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Target AI usage options selection grid */}
                          <div className="space-y-3 pt-1">
                            <Label className="font-heading font-semibold text-xs text-slate-300">ทักษะสมองกลที่ต้องการเปิดใช้บริการ (เลือกได้หลายทักษะ)</Label>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {aiUseOptions.map((opt) => {
                                const isSelected = selectedAiUses.includes(opt.text);
                                return (
                                  <button
                                    key={opt.text}
                                    type="button"
                                    onClick={() => toggleAiUse(opt.text)}
                                    className={`rounded-xl border p-3 text-left font-body text-xs transition-all active:scale-[0.98] flex items-start gap-2.5 ${
                                      isSelected
                                        ? "border-primary bg-primary/10 text-white shadow-[0_0_12px_rgba(249,115,22,0.15)] font-semibold"
                                        : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25"
                                    }`}
                                  >
                                    <span className="text-base shrink-0 bg-white/5 p-1 rounded-md border border-white/10 w-7 h-7 flex items-center justify-center">{opt.emoji}</span>
                                    <span className="flex-1 leading-normal text-[11px] text-white self-center">{opt.text}</span>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 self-center transition-colors ${
                                      isSelected ? "bg-primary border-primary text-white" : "border-white/25"
                                    }`}>
                                      {isSelected && <Check className="h-2.5 w-2.5" />}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Custom prompt text area input */}
                          <div className="space-y-2">
                            <Label className="font-heading font-semibold text-xs text-slate-300 flex items-center gap-1">
                              <Zap className="h-3.5 w-3.5 text-primary" />
                              ป้อนคำสั่งควบคุมเฉพาะให้สมองกล (System Prompt / Custom Instruction)
                            </Label>
                            <Textarea
                              placeholder="เช่น 'ให้คุยอย่างเป็นกันเองกับลูกค้า, แนะนำแพ็คเกจทัวร์โปรโมชันบัตร 2,999 บาท และพยายามของเบอร์โทรศัพท์ติดต่อกลับเพื่อปิดการขาย'"
                              value={customAiUse}
                              onChange={(e) => setCustomAiUse(e.target.value)}
                              className="min-h-[80px] rounded-xl text-xs bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500 focus:bg-white/[0.07] focus:border-primary/50 focus:ring-0 transition-all font-body leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* === STEP 3: Deploy & Build Terminal === */}
                      {currentStep === 3 && (
                        <div className="space-y-5 animate-fade-in-up">
                          <div className="border-b border-white/5 pb-2">
                            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                              <Award className="h-4.5 w-4.5 text-primary" />
                              ขั้นตอนที่ 3: คอมไพล์รหัสบัตร & ติดตั้งระบบ (Build & Deploy License)
                            </h3>
                            <p className="text-[10px] text-slate-400 font-body">ตรวจสอบพารามิเตอร์และจำลองการดีพลอยเพื่ออกรหัส License หน้างาน</p>
                          </div>

                          {/* Interactive terminal compilation simulator logs */}
                          {isCompiling ? (
                            <div className="space-y-2">
                              <Label className="font-heading font-semibold text-xs text-primary flex items-center gap-1.5">
                                <Terminal className="h-4 w-4 animate-pulse" />
                                สถานะการคอมไพล์บิลด์บอท (Agent Build Terminal Logs)
                              </Label>
                              <div className="bg-slate-950 font-mono text-[9px] p-4 rounded-xl border border-white/10 text-green-400 space-y-1.5 h-44 overflow-y-auto shadow-2xl">
                                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2 text-slate-500 text-[8px] select-none">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                  <span className="ml-1 text-[9px]">agent_compiler.sh</span>
                                </div>
                                {compilationLogs.map((log, i) => (
                                  <p key={i} className="animate-fade-in-up leading-relaxed">{log}</p>
                                ))}
                                <div className="animate-pulse inline-block w-1.5 h-3 bg-green-500" />
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Ticket details summary card */}
                              <div className="relative border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-visible p-5 shadow-2xl space-y-4">
                                <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-slate-950 border-r border-white/10 z-10" />
                                <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-slate-950 border-l border-white/10 z-10" />

                                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-heading font-bold py-0.5 px-2">
                                    ใบตรวจสอบ Agent License
                                  </Badge>
                                  <span className="font-heading text-[10px] text-slate-400 tracking-wider font-bold">Smart Business Expo 2026</span>
                                </div>

                                <div className="space-y-3 py-1">
                                  <div>
                                    <h4 className="font-heading font-bold text-xs text-white">สะออนทัวร์ AI เวิร์กช็อป ขอนแก่น</h4>
                                    <p className="text-[9px] text-slate-400 font-body mt-0.5">ผู้ควบคุมลิขสิทธิ์: คุณ {fullName}</p>
                                  </div>

                                  <div className="border-t border-dashed border-white/15 my-2" />

                                  <div className="space-y-1.5 font-body text-xs text-slate-300">
                                    <div className="flex justify-between">
                                      <span className="text-slate-400">คูปองส่วนลดจองสิทธิ์:</span>
                                      <span className="font-bold text-green-400">เรียนฟรี AI (มูลค่า 3,000 บาท)</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 text-[10px]">
                                      <span>มูลค่าบัตรปกติ:</span>
                                      <span className="line-through">5,999 บาท</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-2 text-xs">
                                      <span className="font-bold text-white font-semibold text-yellow-500">ยอดชำระมัดจำเพื่อจองสิทธิ์:</span>
                                      <span className="font-heading font-black text-yellow-500 text-sm">2,999 บาท</span>
                                    </div>
                                  </div>

                                  {/* Bank Account Transfer Details inside Step 3 */}
                                  <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 space-y-2.5">
                                    <p className="text-[10px] text-slate-400 font-heading uppercase tracking-wider">บัญชีโอนเงินมัดจำ (KBANK)</p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center font-heading text-xs text-white font-black">
                                          K
                                        </div>
                                        <div>
                                          <p className="text-xs font-heading font-semibold text-white">ธนาคารกสิกรไทย</p>
                                          <p className="text-[10px] font-body text-slate-400">บจก. เรเจ้นท์ ฮอลิเดย์</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs font-heading font-black text-white select-all">123-4-56789-0</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center mt-3">
                                    <p className="text-[9px] text-primary font-body font-semibold">
                                      * เงื่อนไข: ผู้ลงทะเบียนจองสิทธิ์ต้องจ่ายเงินมัดจำ 2,999 บาท และต้องแสดงคูปอง QR Code เพื่อยืนยันสิทธิ์ลดก่อนเข้างานสัมมนา (รับจำนวนจำกัด)
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Consent checklist */}
                              <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                                <Checkbox
                                  id="terms"
                                  checked={termsAccepted}
                                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                                  className="mt-1 h-5 w-5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                                />
                                <label htmlFor="terms" className="font-body text-[10px] text-slate-400 leading-relaxed cursor-pointer select-none">
                                  ข้าพเจ้านินยอมเข้าร่วมสัมมนา และยอมรับเงื่อนไขการโอนชำระเงินมัดจำจำนวน 2,999 บาท เพื่อแลกซื้อสิทธิ์จองที่นั่งและคูปองส่วนลดมูลค่า 3,000 บาท <span className="text-destructive">*</span>
                                </label>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex gap-4 pt-4 border-t border-white/5 relative z-10">
                        {currentStep > 1 && !isCompiling && (
                          <Button
                            type="button"
                            onClick={handlePrevStep}
                            variant="outline"
                            className="flex-1 py-5 rounded-xl text-xs font-heading font-semibold border-white/10 hover:bg-white/5 text-slate-300"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> ย้อนกลับ
                          </Button>
                        )}

                        {currentStep < 3 ? (
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 bg-primary hover:bg-primary/95 text-white py-5 rounded-xl text-xs font-heading font-bold transition-all active:scale-[0.97]"
                          >
                            ถัดไป <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          !isCompiling && (
                            <Button
                              type="button"
                              onClick={handleSubmit}
                              variant="hero"
                              className="flex-1 py-5 rounded-xl text-xs font-heading font-bold shadow-xl shadow-primary/25 transition-all active:scale-[0.97]"
                              disabled={isSubmitting || !termsAccepted}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  กำลังส่งข้อมูล...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  ยืนยันการบิวท์ & ติดตั้งบอท
                                </>
                              )}
                            </Button>
                          )
                        )}
                      </div>
                    </form>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
