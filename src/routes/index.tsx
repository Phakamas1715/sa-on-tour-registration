import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  User,
  Phone,
  Mail,
  Map,
  Briefcase,
  Building,
  Smartphone,
  CheckSquare,
  List,
} from "lucide-react";
import { createRegistration } from "@/lib/registrations.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น – Upskill LINE OA & TikTok",
      },
      {
        name: "description",
        content:
          "ลงทะเบียนเรียน Workshop สร้าง AI Agent เชื่อม LINE OA และทำคอนเทนต์ TikTok ด้วย AI ที่ KICE ขอนแก่น 28 มิถุนายน 2569",
      },
      {
        property: "og:title",
        content: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น",
      },
      {
        property: "og:description",
        content: "Upskill LINE OA & TikTok – จ่ายเพียง 2,999 บาท",
      },
    ],
  }),
  component: LandingPage,
});

// ─── Parallax Hook ────────────────────────────────────────────────
function useParallax(speed = 0.4) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          const y = window.scrollY * speed;
          ref.current.style.transform = `translateY(${y}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return ref;
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Parallax Orb ──────────────────────────────────────────────────
function ParallaxOrb({ speed = 0.2, className = "" }) {
  const ref = useParallax(speed);
  return <div ref={ref} className={className} />;
}

// ─── Reveal Section ────────────────────────────────────────────────
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Form Field ──────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  icon: Icon,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: any;
  [key: string]: any;
}) {
  return (
    <div className="relative group">
      <label
        htmlFor={name}
        className="block text-sm font-bold mb-2 text-foreground/80 group-focus-within:text-gold transition-colors"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-3.5 rounded-xl bg-input/50 backdrop-blur-sm border ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
              : "border-border/60 focus:border-primary focus:ring-primary/30 hover:border-border"
          } text-foreground outline-none transition-all duration-300 shadow-sm focus:shadow-md focus:bg-input`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Chat Demo ────────────────────────────────────────────────────
function ChatDemo() {
  const messages = [
    { sender: "user", text: "สวัสดีครับ สนใจ workshop ขอนแก่น" },
    { sender: "bot", text: "สวัสดีครับ! มีที่นั่งเหลือ 5 ที่เท่านั้น 👋" },
    { sender: "user", text: "ต้องจ่ายเงินตอนนี้เลยไหมครับ" },
    { sender: "bot", text: "จองไว้ก่อน แล้วค่อยโอนมัดจำภายใน 24 ชม. ได้ครับ" },
  ];

  return (
    <div className="glass-card rounded-3xl p-5 w-full max-w-sm mx-auto shadow-2xl border-primary/20">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/60">
        <div className="w-10 h-10 rounded-xl bg-gold-gradient grid place-items-center shadow-glow">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-extrabold">Agent ไทบ้าน</p>
          <p className="text-[10px] text-muted-foreground">ออนไลน์ • ตอบทันที</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-muted-foreground">พร้อมช่วย</span>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} chat-in`}
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-gold-gradient text-primary-foreground font-semibold rounded-tr-sm"
                  : "glass-card text-foreground rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-input border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
          disabled
        />
        <button
          type="button"
          className="w-11 h-11 rounded-xl bg-gold-gradient grid place-items-center shadow-glow disabled:opacity-50"
          disabled
        >
          <ArrowRight className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────
function LandingPage() {
  const navigate = useNavigate();
  const submit = useServerFn(createRegistration);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interestTopic, setInterestTopic] = useState("");
  const [hasLineOa, setHasLineOa] = useState("");

  // Parallax layers
  const parallaxSlow = useParallax(0.25);
  const parallaxMed = useParallax(0.45);
  const parallaxFast = useParallax(0.65);

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
    if (!data.interest_topic) newErrors.interest_topic = "กรุณาเลือกหัวข้อที่สนใจ";
    if (!data.has_line_oa) newErrors.has_line_oa = "กรุณาระบุข้อมูล LINE OA";
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        /* Parallax base */
        .parallax-wrap { overflow: hidden; position: relative; }

        /* Scroll reveal */
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-50px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-left.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(50px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-right.is-visible { opacity: 1; transform: translateX(0); }

        /* Floating orbs */
        @keyframes drift { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.97)} }
        .orb { position:absolute; border-radius:9999px; filter:blur(80px); animation:drift 12s ease-in-out infinite; pointer-events:none; }
        .orb-2 { animation-delay:-4s; animation-duration:16s; }
        .orb-3 { animation-delay:-8s; animation-duration:14s; }

        /* Number counter shimmer */
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .shimmer-text {
          background: linear-gradient(90deg, oklch(0.82 0.15 85), oklch(0.95 0.12 90), oklch(0.72 0.22 0), oklch(0.82 0.15 85));
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        /* Grid pattern overlay */
        .grid-overlay {
          background-image:
            linear-gradient(oklch(0.82 0.15 85 / 0.04) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.82 0.15 85 / 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Glassmorphism card */
        .glass-card {
          background: oklch(0.21 0.045 262 / 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid oklch(0.82 0.15 85 / 0.12);
        }
        .glass-card-hover { transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
        .glass-card-hover:hover {
          border-color: oklch(0.82 0.15 85 / 0.35);
          box-shadow: 0 0 40px oklch(0.82 0.15 85 / 0.1);
          transform: translateY(-4px);
        }

        /* Gradient border button */
        .btn-gradient {
          position: relative;
          background: linear-gradient(135deg, oklch(0.88 0.14 90), oklch(0.72 0.22 0));
          color: oklch(0.18 0.04 260);
          font-weight: 800;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover { transform: scale(1.04); box-shadow: 0 0 40px oklch(0.82 0.15 85 / 0.5); }
        .btn-gradient:active { transform: scale(0.98); }

        /* Neon line accent */
        .neon-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.82 0.15 85), transparent);
        }

        /* Scroll indicator bounce */
        @keyframes bounce-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        .bounce-y { animation: bounce-y 1.8s ease-in-out infinite; }

        /* Timeline dot pulse */
        @keyframes ping-gold {
          0%{transform:scale(1);opacity:1}
          75%,100%{transform:scale(2.2);opacity:0}
        }
        .ping-gold::before {
          content:''; position:absolute; inset:0; border-radius:9999px;
          background:oklch(0.82 0.15 85 / 0.5);
          animation: ping-gold 1.5s cubic-bezier(0,0,0.2,1) infinite;
        }
        .ping-gold { position:relative; }

        /* Chat bubble entrance */
        @keyframes chat-in { from{opacity:0;transform:translateY(12px) scale(0.95)} to{opacity:1;transform:none} }
        .chat-in { animation: chat-in 0.5s ease both; }

        /* Color utilities */
        .text-gold { color: oklch(0.82 0.15 85); }
        .bg-gold { background: oklch(0.82 0.15 85); }
        .bg-gold/10 { background: oklch(0.82 0.15 85 / 0.1); }
        .bg-gold-gradient { background: linear-gradient(135deg, oklch(0.88 0.14 90), oklch(0.72 0.22 0)); }
        .shadow-glow { box-shadow: 0 0 30px oklch(0.82 0.15 85 / 0.3); }
        .border-gold { border-color: oklch(0.82 0.15 85); }

        .text-line { color: #06C755; }
        .bg-line/10 { background: #06C755 / 0.1; }
        .bg-line/15 { background: #06C755 / 0.15; }

        .text-tiktok { color: #EE1D52; }
        .bg-tiktok/10 { background: #EE1D52 / 0.1; }
        .bg-tiktok/15 { background: #EE1D52 / 0.15; }

        .text-primary-foreground { color: oklch(0.18 0.04 260); }
        .bg-primary-foreground { background: oklch(0.18 0.04 260); }
      `}</style>

      <Toaster richColors position="top-center" />

      {/* ── NAVBAR ────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mt-3 mx-0 sm:mx-4 glass-card rounded-2xl px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold-gradient grid place-items-center shadow-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold tracking-tight">สะออนทัวร์</p>
                <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
                  Agent ไทบ้าน ขอนแก่น
                </p>
              </div>
            </div>
            <nav className="hidden sm:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
              <a href="#details" className="hover:text-gold transition-colors">
                งาน
              </a>
              <a href="#learn" className="hover:text-gold transition-colors">
                เรียนรู้
              </a>
              <a href="#speakers" className="hover:text-gold transition-colors">
                วิทยากร
              </a>
              <a
                href="https://www.facebook.com/share/1LZAkJtcHT/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                เพจ Facebook
              </a>
            </nav>
            <a href="#register" className="btn-gradient px-4 py-2 rounded-full text-xs">
              ลงทะเบียน →
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO (PARALLAX) ───────────────────────────────── */}
      <section className="parallax-wrap relative min-h-screen flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-60 mix-blend-screen"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background pointer-events-none" />

        {/* Background grid */}
        <div className="absolute inset-0 grid-overlay opacity-40" />

        {/* Orbs — each layer at different parallax speed */}
        <div ref={parallaxSlow} className="absolute inset-0 will-change-transform">
          <div className="orb w-[700px] h-[700px] bg-primary/10 top-[-15%] right-[-10%]" />
        </div>
        <div ref={parallaxMed} className="absolute inset-0 will-change-transform">
          <div className="orb orb-2 w-[500px] h-[500px] bg-[oklch(0.5_0.2_280)]/15 bottom-[-5%] left-[-10%]" />
        </div>
        <div ref={parallaxFast} className="absolute inset-0 will-change-transform">
          <div className="orb orb-3 w-[300px] h-[300px] bg-[oklch(0.72_0.22_0)]/5 top-[30%] left-[20%]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-bold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold ping-gold" />
                <span className="text-gold">เปิดรับลงทะเบียน</span>
                <span className="text-muted-foreground">• รุ่นพิเศษขอนแก่น</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1] tracking-tight">
                <span className="block text-foreground/95">สะออนทัวร์</span>
                <span className="block shimmer-text mt-1">Agent ไทบ้าน</span>
                <span className="block text-foreground/80 text-4xl sm:text-5xl lg:text-6xl mt-2">
                  ขอนแก่น
                </span>
              </h1>

              <div className="neon-line w-24 my-6" />

              <p className="text-lg sm:text-xl font-semibold">
                Upskill <span className="text-line font-extrabold">LINE OA</span>
                {" & "}
                <span className="text-tiktok font-extrabold">TikTok</span> ด้วยพลัง AI
              </p>
              <p className="mt-3 text-muted-foreground text-base max-w-md leading-relaxed">
                เรียนรู้สร้าง AI Agent เชื่อมต่อ LINE ช่วยงานประจำ ปิดการขายอัตโนมัติ และทำคอนเทนต์
                TikTok ด้วย AI ในวันเดียว
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#register"
                  className="btn-gradient px-8 py-4 rounded-full text-sm flex items-center gap-2"
                >
                  ลงทะเบียนเรียน <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#details"
                  className="px-8 py-4 rounded-full border border-border/60 bg-card/30 backdrop-blur text-sm font-semibold hover:border-primary/40 transition"
                >
                  ดูรายละเอียด
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: Users, label: "ที่นั่งจำกัด" },
                  { icon: Wrench, label: "ลงมือทำจริง" },
                  { icon: Shield, label: "สอนโดยมืออาชีพ" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-xs text-muted-foreground"
                  >
                    <t.icon className="w-3.5 h-3.5 text-gold" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Chat UI (parallax subtle) */}
            <ChatDemo />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 bounce-y">
          <span className="text-[10px] tracking-widest uppercase">เลื่อนดู</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="neon-line opacity-40" />

      {/* ── EVENT DETAILS ─────────────────────────────────── */}
      <section id="details" className="py-24 relative">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              ข้อมูลงาน
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-12">
              Smart Business AI Workshop <span className="shimmer-text">2026</span>
            </h2>
          </RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "วันที่", value: "28 มิ.ย. 2569", sub: "วันเสาร์" },
              { icon: Clock, label: "เวลา", value: "10:00 – 19:00", sub: "น." },
              { icon: MapPin, label: "สถานที่", value: "KICE Hall 1-2", sub: "ขอนแก่น" },
              { icon: Wrench, label: "ห้อง", value: "M4-8", sub: "ชั้น 4" },
            ].map((d, i) => (
              <RevealSection key={d.label} delay={i * 100}>
                <div className="glass-card glass-card-hover rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gold-gradient grid place-items-center mx-auto mb-4 shadow-glow">
                    <d.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    {d.label}
                  </p>
                  <p className="font-extrabold text-lg leading-tight">{d.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.sub}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU LEARN ────────────────────────────────── */}
      <section id="learn" className="py-24 relative overflow-hidden">
        {/* Parallax bg orb */}
        <ParallaxOrb
          speed={0.2}
          className="absolute -right-32 top-0 w-[600px] h-[600px] bg-primary/8 orb"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              สิ่งที่คุณจะได้เรียนรู้
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-4">
              เปลี่ยน LINE OA & TikTok ให้ <span className="shimmer-text">ทำงานเองได้</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm max-w-lg mx-auto mb-14">
              Workshop ลงมือทำจริงในวันเดียว เสร็จแล้วนำไปใช้กับธุรกิจได้ทันที
            </p>
          </RevealSection>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Bot,
                color: "text-line",
                bg: "bg-line/10",
                title: "สร้าง AI Agent เชื่อม LINE OA",
                desc: "ออกแบบ Agent ที่เข้าใจลูกค้า ตอบเองได้ 24 ชม. ลดงานซ้ำซ้อน",
                tag: "LINE OA",
              },
              {
                icon: MessageCircle,
                color: "text-gold",
                bg: "bg-gold/10",
                title: "ตอบแชตอัตโนมัติ & ปิดการขาย",
                desc: "เชื่อม CRM, ปฏิทิน, ระบบจองสินค้า ให้ AI ดูแลครบลูป",
                tag: "Automation",
              },
              {
                icon: Video,
                color: "text-tiktok",
                bg: "bg-tiktok/10",
                title: "ใช้ AI ทำคอนเทนต์ TikTok",
                desc: "เขียนสคริปต์ ตัดต่อ ทำคลิปไวรัล โดยใช้เครื่องมือ AI ที่ใช้งานง่าย",
                tag: "TikTok",
              },
              {
                icon: Wrench,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "เวิร์กช็อปลงมือทำจริง",
                desc: "นั่งทำพร้อมวิทยากร เสร็จงานแล้วใช้งานต่อได้ทันที",
                tag: "Hands-on",
              },
            ].map((c, i) => (
              <RevealSection key={c.title} delay={i * 120}>
                <div className="group glass-card glass-card-hover rounded-2xl p-7 h-full relative overflow-hidden">
                  {/* Corner glow */}
                  <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gold-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500" />
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 w-12 h-12 rounded-xl ${c.bg} grid place-items-center`}
                    >
                      <c.icon className={`w-6 h-6 ${c.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.color} uppercase tracking-wider`}
                        >
                          {c.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold mb-2">{c.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPEAKERS ──────────────────────────────────────── */}
      <section id="speakers" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <ParallaxOrb
          speed={0.15}
          className="absolute -left-40 bottom-0 w-[500px] h-[500px] bg-[oklch(0.5_0.2_280)]/10 orb orb-2"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              วิทยากร
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-14">
              พบมืออาชีพตัวจริงในวงการ
            </h2>
          </RevealSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "ปรเมศวร์ มินศิริ",
                role: "Speaker",
                tag: "LINE OA / Digital Media / Content",
                accent: "line" as const,
                letter: "ป",
                link: "https://www.facebook.com/share/18gPG4FKzt/?mibextid=wwXIfr",
                buttonText: "ติดตาม Facebook",
              },
              {
                name: "โดม เจริญยศ",
                role: "Speaker",
                tag: "AI / Tech / Digital Strategy",
                accent: "gold" as const,
                letter: "โ",
                link: "https://www.facebook.com/share/18paKcNdeB/?mibextid=wwXIfr",
                buttonText: "ติดตาม Facebook",
              },
              {
                name: "หนุ่มนักออม",
                role: "Special Guest",
                tag: "สอน AI สร้างคลิป TikTok • เพจหนุ่มนักออม",
                accent: "tiktok" as const,
                letter: "ห",
                link: "https://www.tiktok.com/@noomnugaom?_r=1&_t=ZS-97NNRxCges4",
                buttonText: "ติดตาม TikTok",
              },
            ].map((s, i) => (
              <RevealSection key={s.name} delay={i * 150}>
                <div className="glass-card glass-card-hover rounded-3xl p-8 text-center group relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div>
                    {/* Avatar */}
                    <div className="relative inline-block mb-5">
                      <div
                        className={`w-20 h-20 rounded-2xl grid place-items-center text-3xl font-black mx-auto ${
                          s.accent === "line"
                            ? "bg-line/15 text-line"
                            : s.accent === "tiktok"
                              ? "bg-tiktok/15 text-tiktok"
                              : "bg-gold-gradient text-primary-foreground shadow-glow"
                        }`}
                      >
                        {s.letter}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background ${s.accent === "line" ? "bg-line" : s.accent === "tiktok" ? "bg-tiktok" : "bg-gold"} ping-gold`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                      {s.role}
                    </p>
                    <h3 className="text-xl font-black mb-3">{s.name}</h3>
                    <div className="neon-line w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.tag}</p>
                  </div>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-6 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full relative z-10 ${
                      s.accent === "line"
                        ? "bg-line/10 hover:bg-line/20 text-line border border-line/20"
                        : s.accent === "tiktok"
                          ? "bg-tiktok/10 hover:bg-tiktok/20 text-tiktok border border-tiktok/20"
                          : "bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20"
                    }`}
                  >
                    {s.buttonText}
                  </a>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <ParallaxOrb
          speed={0.3}
          className="absolute inset-0 m-auto w-[800px] h-[400px] bg-primary/5 orb"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <RevealSection>
            <div className="glass-card rounded-3xl overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1 bg-gold-gradient" />
              <div className="p-8 sm:p-12 text-center">
                <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
                  ราคาพิเศษ
                </p>
                <h2 className="text-3xl sm:text-4xl font-black mb-8">ลงทะเบียนรับสิทธิ์ภายในงาน</h2>

                {/* Price display */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gold-gradient blur-3xl opacity-20 rounded-full" />
                  <div className="relative flex items-end justify-center gap-3">
                    <span className="text-xl text-muted-foreground line-through self-start mt-2">
                      ฿5,999
                    </span>
                    <span className="shimmer-text text-7xl sm:text-8xl font-black leading-none">
                      2,999
                    </span>
                    <span className="text-xl font-bold mb-1 text-muted-foreground">฿</span>
                  </div>
                </div>

                {/* Perks */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "เรียนฟรี AI มูลค่า 3,000 บาท",
                      color: "text-line",
                    },
                    { icon: Zap, text: "Workshop ลงมือทำจริง 1 วัน", color: "text-gold" },
                    { icon: Bot, text: "ได้บอทกลับบ้าน", color: "text-primary" },
                  ].map((p) => (
                    <div
                      key={p.text}
                      className="flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm"
                    >
                      <p.icon className={`w-4 h-4 ${p.color} shrink-0`} />
                      <span className="font-semibold">{p.text}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-8">
                  รับสิทธิ์เฉพาะผู้ลงทะเบียนและโอนมัดจำล่วงหน้าตามลำดับคิวเท่านั้น
                </p>

                <a
                  href="#register"
                  className="btn-gradient inline-flex items-center gap-2 px-10 py-4 rounded-full text-base"
                >
                  จองสิทธิ์เรียน <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── REGISTRATION FORM ─────────────────────────────── */}
      <section id="register" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <ParallaxOrb
          speed={0.2}
          className="absolute right-0 top-0 w-[500px] h-[500px] bg-[oklch(0.72_0.22_0)]/8 orb orb-3"
        />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              แบบฟอร์มลงทะเบียน
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-3">
              ลงทะเบียนเรียน Workshop
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-10">
              กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียด
            </p>
          </RevealSection>

          <RevealSection delay={100}>
            <form onSubmit={onSubmit} className="glass-card rounded-3xl p-6 sm:p-10 space-y-8">
              {/* Section 1: Personal Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 grid place-items-center text-gold">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-lg">ข้อมูลส่วนบุคคล</h3>
                </div>

                <Field
                  label="ชื่อ-นามสกุล"
                  name="full_name"
                  required
                  error={errors.full_name}
                  icon={User}
                  placeholder="เช่น สมชาย ใจดี"
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="เบอร์โทรศัพท์"
                    name="phone"
                    type="tel"
                    required
                    error={errors.phone}
                    icon={Phone}
                    placeholder="0812345678"
                  />
                  <Field
                    label="LINE ID"
                    name="line_id"
                    required
                    error={errors.line_id}
                    icon={Smartphone}
                    placeholder="Line ID หรือเบอร์ที่ผูก"
                  />
                </div>
                <Field
                  label="อีเมล (ไม่บังคับ)"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="example@email.com"
                />
              </div>

              {/* Section 2: Location & Business */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-lg">ข้อมูลพื้นที่และอาชีพ</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="จังหวัด" name="province" icon={Map} placeholder="เช่น ขอนแก่น" />
                  <Field
                    label="อำเภอ"
                    name="district"
                    icon={MapPin}
                    placeholder="เช่น เมืองขอนแก่น"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="อาชีพ / ธุรกิจ"
                    name="occupation"
                    icon={Briefcase}
                    placeholder="เช่น ค้าขาย, พนักงานออฟฟิศ"
                  />
                  <Field
                    label="ชื่อเพจ / ชื่อธุรกิจ"
                    name="business_name"
                    icon={Building}
                    placeholder="(ถ้ามี)"
                  />
                </div>
              </div>

              {/* Section 3: Interests */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-line/10 grid place-items-center text-line">
                    <List className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-lg">ความสนใจ</h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-foreground/80">
                    สนใจเรียนเรื่องใดมากที่สุด <span className="text-red-400">*</span>
                  </label>
                  <input type="hidden" name="interest_topic" value={interestTopic} />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "สร้าง AI Agent เชื่อม LINE OA",
                        label: "สร้าง AI Agent LINE OA",
                        icon: Bot,
                        desc: "แชทบอทอัจฉริยะ ตอบคำถามลูกค้าอัตโนมัติ",
                      },
                      {
                        value: "ใช้ AI ทำคอนเทนต์ TikTok",
                        label: "ทำคอนเทนต์ TikTok",
                        icon: Video,
                        desc: "ใช้ AI เขียนบท ตัดต่อคลิป สร้างวิดีโอ",
                      },
                      {
                        value: "Automation & CRM ด้วย AI",
                        label: "Automation & CRM",
                        icon: Zap,
                        desc: "เชื่อมต่อข้อมูล ยอดจอง ระบบ CRM อัตโนมัติ",
                      },
                      {
                        value: "ทุกหัวข้อ",
                        label: "ทุกหัวข้อ",
                        icon: Sparkles,
                        desc: "เรียนรู้ครบวงจรทุกฟีเจอร์ AI",
                      },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = interestTopic === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setInterestTopic(opt.value)}
                          className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-glow text-gold"
                              : "border-border/60 bg-input/40 hover:border-border hover:bg-input/60 text-foreground"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg grid place-items-center mb-2.5 ${isSelected ? "bg-gold-gradient text-primary-foreground" : "bg-muted/40 text-muted-foreground"}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-sm font-extrabold">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.interest_topic && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.interest_topic}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-sm font-bold text-foreground/80">
                    มี LINE OA อยู่แล้วหรือไม่ <span className="text-red-400">*</span>
                  </label>
                  <input type="hidden" name="has_line_oa" value={hasLineOa} />
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { value: "มีแล้ว", label: "มีแล้ว", desc: "พร้อมเชื่อมบอท" },
                      {
                        value: "ยังไม่มี แต่อยากเริ่มใช้",
                        label: "ยังไม่มี",
                        desc: "อยากเริ่มต้นใช้",
                      },
                      { value: "กำลังศึกษาอยู่", label: "กำลังศึกษา", desc: "หาข้อมูลเพิ่มเติม" },
                    ].map((opt) => {
                      const isSelected = hasLineOa === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setHasLineOa(opt.value)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-glow text-gold"
                              : "border-border/60 bg-input/40 hover:border-border hover:bg-input/60 text-foreground"
                          }`}
                        >
                          <p className="text-sm font-extrabold">{opt.label}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {errors.has_line_oa && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      {errors.has_line_oa}
                    </p>
                  )}
                </div>
              </div>

              {/* Section 4: Consent & Submit */}
              <div className="pt-6 border-t border-border/40">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
                  <div className="relative flex items-start pt-0.5">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      className="peer w-5 h-5 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary/30 accent-gold cursor-pointer transition-all"
                    />
                  </div>
                  <label
                    htmlFor="consent"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
                  >
                    ข้าพเจ้ายินยอมให้ทีมงานติดต่อกลับเพื่อยืนยันการลงทะเบียนและแจ้งรายละเอียดเพิ่มเติม
                    <span className="text-red-400 ml-1 font-bold">*</span>
                    {errors.consent && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-red-400" />
                        {errors.consent}
                      </p>
                    )}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gradient w-full flex items-center justify-center gap-2 mt-6 px-6 py-4 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed shadow-xl hover:shadow-primary/20"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      ยืนยันการลงทะเบียน <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </RevealSection>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-12 border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            <p className="text-sm font-extrabold">สะออนทัวร์</p>
          </div>
          <div className="mb-4">
            <a
              href="https://www.facebook.com/share/1LZAkJtcHT/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 rounded-full border border-white/5"
            >
              🌐 ติดตามเพจ Facebook สะออนทัวร์
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 สะออนทัวร์ – Workshop Agent ไทบ้าน ขอนแก่น
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            สงวนสิทธิ์ | ข้อมูลการติดต่อตามแบบฟอร์ม
          </p>
        </div>
      </footer>
    </div>
  );
}
