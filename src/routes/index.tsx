import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Bot,
  MessageCircle,
  Video,
  Wrench,
  ArrowRight,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { createRegistration } from "@/lib/registrations.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น – Upskill LINE OA & TikTok" },
      {
        name: "description",
        content:
          "ลงทะเบียนเรียน Workshop สร้าง AI Agent เชื่อม LINE OA และทำคอนเทนต์ TikTok ด้วย AI ที่ KICE ขอนแก่น 28 มิถุนายน 2569",
      },
      { property: "og:title", content: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น" },
      {
        property: "og:description",
        content: "Upskill LINE OA & TikTok – จ่ายเพียง 2,999 บาท",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const submit = useServerFn(createRegistration);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      full_name: String(fd.get("full_name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      line_id: String(fd.get("line_id") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      province: String(fd.get("province") ?? "").trim(),
      district: String(fd.get("district") ?? "").trim(),
      occupation: String(fd.get("occupation") ?? "").trim(),
      business_name: String(fd.get("business_name") ?? "").trim(),
      interest_topic: String(fd.get("interest_topic") ?? "").trim(),
      has_line_oa: String(fd.get("has_line_oa") ?? "").trim(),
      consent: fd.get("consent") === "on",
    };

    const newErrors: Record<string, string> = {};
    if (!data.full_name) newErrors.full_name = "กรุณากรอกชื่อ-นามสกุล";
    if (!data.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!data.line_id) newErrors.line_id = "กรุณากรอก LINE ID";
    if (!data.consent) newErrors.consent = "กรุณายินยอมให้ติดต่อกลับ";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submit({ data: { ...data, consent: true as const } });
      navigate({ to: "/success", search: { code: res.registration_code } });
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <link
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient grid place-items-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">สะออนทัวร์</p>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Agent ไทบ้าน ขอนแก่น</p>
            </div>
          </div>
          <a
            href="#register"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-gradient text-primary-foreground text-sm font-semibold hover:scale-[1.03] transition-transform shadow-glow"
          >
            ลงทะเบียนเรียน <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero isan-pattern">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-[oklch(0.5_0.2_280)]/30 blur-3xl animate-float" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-gold text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse-soft" />
                เปิดรับลงทะเบียน • รุ่นพิเศษขอนแก่น
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                สะออนทัวร์
                <br />
                <span className="bg-gold-gradient bg-clip-text text-transparent">Agent ไทบ้าน</span>
                <br />
                <span className="text-foreground/90">ขอนแก่น</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl font-semibold text-foreground/85">
                Upskill <span className="text-line">LINE OA</span> & <span className="text-tiktok">TikTok</span>{" "}
                ด้วยพลัง AI
              </p>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl">
                เรียนรู้การสร้าง AI Agent เชื่อมต่อ LINE เพื่อช่วยงานประจำ ทำงานสะดวกขึ้น และใช้ AI ทำคอนเทนต์ TikTok
                ได้จริง
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#register"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground text-base font-bold hover:scale-[1.03] transition-transform shadow-glow"
                >
                  ลงทะเบียนเรียน <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#details"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card/60 backdrop-blur text-foreground font-semibold hover:bg-card transition"
                >
                  ดูรายละเอียด
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { icon: Users, label: "ที่นั่งจำกัด" },
                  { icon: Wrench, label: "ลงมือทำจริง" },
                  { icon: Shield, label: "สอนโดยมืออาชีพ" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-card/40 border border-border/60"
                  >
                    <t.icon className="w-5 h-5 text-gold" />
                    <span className="text-xs text-muted-foreground">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative animate-slide-in">
              <div className="absolute inset-0 bg-gold-gradient blur-3xl opacity-25 rounded-full" />
              <div className="relative rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 shadow-card-soft">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80" />
                    <div className="w-3 h-3 rounded-full bg-primary/80" />
                    <div className="w-3 h-3 rounded-full bg-line/80" />
                  </div>
                  <span className="text-xs text-muted-foreground">agent.ai/line</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 animate-fade-up">
                    <div className="w-9 h-9 rounded-full bg-line/20 grid place-items-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-line" />
                    </div>
                    <div className="flex-1 p-3 rounded-2xl rounded-tl-sm bg-secondary text-sm">
                      สวัสดีค่ะ สนใจสินค้านี้ราคาเท่าไหร่คะ?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end animate-fade-up [animation-delay:200ms]">
                    <div className="flex-1 max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-gold-gradient text-primary-foreground text-sm font-medium">
                      ราคาเริ่มต้น 1,290 บาทค่ะ ส่งฟรีทั่วประเทศ พร้อมส่วนลด 10% สำหรับคำสั่งซื้อแรก ✨
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gold-gradient grid place-items-center shrink-0 shadow-glow">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex gap-3 animate-fade-up [animation-delay:400ms]">
                    <div className="w-9 h-9 rounded-full bg-line/20 grid place-items-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-line" />
                    </div>
                    <div className="flex-1 p-3 rounded-2xl rounded-tl-sm bg-secondary text-sm">
                      สั่ง 2 ชิ้นได้มั้ยคะ?
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end animate-fade-up [animation-delay:600ms]">
                    <div className="flex-1 max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-gold-gradient text-primary-foreground text-sm font-medium">
                      ได้เลยค่ะ กำลังสร้างลิงก์ชำระเงินให้นะคะ 💳
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gold-gradient grid place-items-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/60">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold animate-pulse-soft" />
                    <span className="text-xs text-muted-foreground">AI Agent ทำงานอัตโนมัติ</span>
                  </div>
                  <span className="text-xs font-semibold text-line">● Online</span>
                </div>
              </div>

              {/* floating cards */}
              <div className="absolute -top-6 -right-6 p-3 rounded-2xl bg-card border border-border shadow-card-soft animate-float">
                <Video className="w-6 h-6 text-tiktok" />
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold">TikTok AI</p>
              </div>
              <div className="absolute -bottom-6 -left-6 p-3 rounded-2xl bg-card border border-border shadow-card-soft animate-float-slow">
                <MessageCircle className="w-6 h-6 text-line" />
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold">LINE OA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event details */}
      <section id="details" className="py-20 sm:py-24 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "วันที่", value: "28 มิถุนายน 2569" },
              { icon: Clock, label: "เวลา", value: "10.00 – 19.00 น." },
              { icon: MapPin, label: "สถานที่", value: "KICE Hall 1-2 ขอนแก่น" },
              { icon: Wrench, label: "ห้องประชุม", value: "M4-8" },
            ].map((d) => (
              <div
                key={d.label}
                className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition shadow-card-soft"
              >
                <d.icon className="w-6 h-6 text-gold mb-3" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{d.label}</p>
                <p className="mt-1 font-bold text-lg">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning topics */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest">สิ่งที่คุณจะได้เรียนรู้</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
              เปลี่ยน LINE OA และ TikTok ของคุณให้
              <span className="bg-gold-gradient bg-clip-text text-transparent"> ทำงานเองได้</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Bot,
                title: "สร้าง AI Agent เชื่อม LINE OA",
                desc: "ออกแบบ Agent ที่เข้าใจลูกค้า ตอบเองได้ 24 ชม. ลดงานซ้ำซ้อน",
              },
              {
                icon: MessageCircle,
                title: "ช่วยตอบแชต & จัดการงานอัตโนมัติ",
                desc: "เชื่อม CRM, ปฏิทิน, ระบบจองสินค้า ให้ AI ดูแลครบลูป",
              },
              {
                icon: Video,
                title: "ใช้ AI ทำคอนเทนต์ TikTok",
                desc: "เขียนสคริปต์ ตัดต่อ และทำคลิปไวรัล โดยใช้เครื่องมือ AI ที่ใช้งานง่าย",
              },
              {
                icon: Wrench,
                title: "เวิร์กช็อปลงมือทำจริง",
                desc: "นั่งทำพร้อมวิทยากร เสร็จงานแล้วใช้งานต่อได้ทันที",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className="group relative p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition shadow-card-soft overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-gold-gradient opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-gold-gradient grid place-items-center mb-4 shadow-glow">
                  <c.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="py-20 sm:py-24 bg-card/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest">วิทยากร</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">พบมืออาชีพตัวจริงในวงการ</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "ปรเมศวร์ มินศิริ",
                role: "Speaker",
                tag: "LINE OA / Digital Media / Content",
                accent: "line",
              },
              {
                name: "โดม เจริญยศ",
                role: "Speaker",
                tag: "AI / Tech / Digital Strategy",
                accent: "gold",
              },
              {
                name: "หนุ่มนักออม",
                role: "Special Guest",
                tag: "สอน AI สร้างคลิป TikTok • เพจหนุ่มนักออม",
                accent: "tiktok",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition shadow-card-soft"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl grid place-items-center text-2xl font-extrabold ${
                      s.accent === "line"
                        ? "bg-line/15 text-line"
                        : s.accent === "tiktok"
                          ? "bg-tiktok/15 text-tiktok"
                          : "bg-gold-gradient text-primary-foreground"
                    }`}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.role}</p>
                    <h3 className="text-lg font-bold">{s.name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{s.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative p-1 rounded-3xl bg-gold-gradient shadow-glow">
            <div className="rounded-[22px] bg-card p-8 sm:p-12 text-center">
              <p className="text-gold font-semibold text-sm uppercase tracking-widest">ราคาพิเศษ</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">ลงทะเบียนรับสิทธิ์ภายในงาน</h2>
              <div className="mt-8 flex items-end justify-center gap-3">
                <span className="text-xl text-muted-foreground line-through">5,999</span>
                <span className="text-6xl sm:text-7xl font-extrabold bg-gold-gradient bg-clip-text text-transparent">
                  2,999
                </span>
                <span className="text-xl font-semibold mb-2">บาท</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-line/10 text-line text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> เรียนฟรี AI มูลค่า 3,000 บาท
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                รับสิทธิ์เฉพาะผู้ลงทะเบียนภายในงานเท่านั้น ที่นั่งจำกัด
              </p>
              <a
                href="#register"
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold-gradient text-primary-foreground font-bold hover:scale-[1.03] transition shadow-glow"
              >
                ลงทะเบียนเรียน <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section id="register" className="py-20 sm:py-28 bg-card/30 border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-semibold text-sm uppercase tracking-widest">แบบฟอร์มลงทะเบียน</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">ลงทะเบียนเรียน Workshop</h2>
            <p className="mt-3 text-muted-foreground">กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียด</p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 p-6 sm:p-8 rounded-3xl bg-card border border-border/60 shadow-card-soft"
          >
            <Field label="ชื่อ-นามสกุล" name="full_name" required error={errors.full_name} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="เบอร์โทรศัพท์" name="phone" type="tel" required error={errors.phone} />
              <Field label="LINE ID" name="line_id" required error={errors.line_id} />
            </div>
            <Field label="อีเมล (ไม่บังคับ)" name="email" type="email" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="จังหวัด" name="province" />
              <Field label="อำเภอ" name="district" />
            </div>
            <Field label="อาชีพ / ธุรกิจ" name="occupation" />
            <Field label="ชื่อเพจหรือชื่อธุรกิจ (ถ้ามี)" name="business_name" />

            <div>
              <label className="block text-sm font-semibold mb-2">สนใจเรียนเรื่องใดมากที่สุด</label>
              <select
                name="interest_topic"
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
              >
                <option value="">-- เลือก --</option>
                <option>สร้าง AI Agent เชื่อม LINE OA</option>
                <option>ใช้ AI ช่วยตอบแชต</option>
                <option>ใช้ AI ทำคอนเทนต์คลิป TikTok</option>
                <option>อยากเริ่มต้นใช้ AI ในงานประจำ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">มี LINE OA แล้วหรือยัง</label>
              <div className="grid grid-cols-3 gap-2">
                {["มีแล้ว", "ยังไม่มี", "ไม่แน่ใจ"].map((v) => (
                  <label
                    key={v}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-input cursor-pointer hover:border-primary/60 transition has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-gold"
                  >
                    <input type="radio" name="has_line_oa" value={v} className="sr-only" />
                    <span className="text-sm font-semibold">{v}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border cursor-pointer">
              <input type="checkbox" name="consent" className="mt-1 w-5 h-5 accent-[var(--color-gold)]" />
              <span className="text-sm">ยินยอมให้ทีมงานติดต่อกลับเพื่อยืนยันการลงทะเบียน</span>
            </label>
            {errors.consent && <p className="text-destructive text-sm">{errors.consent}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gold-gradient text-primary-foreground font-bold text-lg hover:scale-[1.01] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
            >
              {submitting ? "กำลังส่ง..." : "ยืนยันลงทะเบียนเรียน"}
            </button>
          </form>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-muted-foreground border-t border-border/60">
        <p>© 2569 สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น</p>
        <Link to="/admin" className="text-xs text-muted-foreground/60 hover:text-gold mt-2 inline-block">
          Admin
        </Link>
      </footer>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        name={name}
        type={type}
        className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}
