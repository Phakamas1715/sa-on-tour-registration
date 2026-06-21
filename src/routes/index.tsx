import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef, type InputHTMLAttributes } from "react";
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
  Volume2,
  Eye,
  Lock,
  FileText,
  X,
  Brain,
  Cpu,
  Cog,
  Send,
  CreditCard,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import { createRegistration } from "@/lib/registrations.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const LIFF_ID = "2010458070-beALbiun";

const TERMINAL_LINES = [
  "$ SA-ON Tour Workshop AI Agent System v2.0.26",
  "> Initializing registration pipeline...",
  "> Connecting to Supabase jsqzymwzrcvabrgjwbrr... ✓",
  "> Validating registration data... ✓",
  "> Creating workshop ticket SAON-KK-xxxx...",
  "> Compiling AI Agent config from system prompt...",
  "> Deploying LINE OA bot to cloud infrastructure... ✓",
  "> Scheduling LINE OA notification... ✓",
  "> Build complete! 🚀 Agent เชื่อมต่อสำเร็จ!",
];

const BG_IMAGES = ["/bg-slide-1.png", "/bg-slide-2.png", "/bg-slide-3.png"];

const PROFESSIONAL_TRUST_ITEMS = [
  { icon: Shield, title: "ลงทะเบียนผ่านระบบที่ตรวจสอบได้", desc: "ข้อมูลถูกบันทึกเข้าระบบ Supabase พร้อมเลขอ้างอิงการจอง" },
  { icon: CheckSquare, title: "ทีมงานยืนยันสิทธิ์เป็นขั้นตอน", desc: "ตรวจสอบมัดจำก่อนปลดล็อก QR Code และคูปองทาง LINE" },
  { icon: Lock, title: "ใช้ข้อมูลตามวัตถุประสงค์", desc: "ข้อมูลส่วนบุคคลใช้เพื่อการลงทะเบียน ติดต่อกลับ และออกใบเสร็จเท่านั้น" },
];

const REGISTRATION_STEPS = [
  "กรอกข้อมูลผู้เข้าอบรม",
  "รับเลขอ้างอิงการจองทางหน้าเว็บและ LINE",
  "ส่งสลิปมัดจำให้ทีมงานตรวจสอบ",
  "รับ QR Code และ Gift Voucher หลังอนุมัติ",
];

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) =>
    z.object({
      g: z.string().optional(),
    }).parse(s),
  head: () => ({
    meta: [
      {
        title: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น (ในงาน Smart Business Expo 2026)",
      },
      {
        name: "description",
        content:
          "ลงทะเบียนเวิร์กช็อปสร้าง AI Agent เชื่อม LINE OA และทำคอนเทนต์ TikTok สำหรับผู้ประกอบการ ภายในงาน Smart Business Expo 2026 ขอนแก่น 28 มิถุนายน 2569",
      },
      {
        property: "og:title",
        content: "สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น",
      },
      {
        property: "og:description",
        content: "เวิร์กช็อปลงมือทำจริง พร้อมขั้นตอนยืนยันสิทธิ์และรับ QR Code ทาง LINE หลังตรวจสอบมัดจำ",
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
type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: LucideIcon;
  highlighted?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  icon: Icon,
  highlighted = false,
  ...props
}: FieldProps) {
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
          className={`w-full ${Icon ? "pl-12" : "pl-4"} pr-4 py-3.5 rounded-xl bg-input/50 backdrop-blur-sm border transition-all duration-300 shadow-sm focus:shadow-md focus:bg-input ${
            highlighted
              ? "border-gold ring-4 ring-gold/40 animate-pulse bg-gold/10 text-gold font-bold scale-[1.02]"
              : error
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                : "border-border/60 focus:border-primary focus:ring-primary/30 hover:border-border"
          } text-foreground outline-none`}
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

// ─── Speak Button ────────────────────────────────────────────────
function SpeakButton({ text, enabled }: { text: string; enabled: boolean }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "th-TH";
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
      }
    }
  };

  if (!enabled) return null;

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center p-1.5 rounded-full border transition-colors ml-2 ${
        speaking
          ? "bg-gold border-gold text-primary-foreground animate-pulse"
          : "bg-muted/40 border-border/40 text-muted-foreground hover:text-gold hover:border-gold/40"
      }`}
      title="อ่านออกเสียง"
    >
      <Volume2 className="w-3.5 h-3.5" />
    </button>
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
  const { g } = Route.useSearch();
  const submit = useServerFn(createRegistration);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Controlled form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [occupation, setOccupation] = useState("");
  const [interestTopics, setInterestTopics] = useState<string[]>([]);
  const [ticketType, setTicketType] = useState("");
  const [needsReceipt, setNeedsReceipt] = useState<boolean | null>(null);
  const [receiptName, setReceiptName] = useState("");
  const [receiptTaxId, setReceiptTaxId] = useState("");
  const [receiptAddress, setReceiptAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("โอนเงินผ่านบัญชีธนาคาร (กสิกรไทย)");
  const [paymentDatetime, setPaymentDatetime] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("2999");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [district, setDistrict] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalVisibleCount, setTerminalVisibleCount] = useState(0);
  const [consent, setConsent] = useState(false);
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);

  const handleSlipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    setUploadingSlip(true);
    const toastId = toast.loading("กำลังอัปโหลดสลิป...");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath);

      setPaymentProofUrl(publicUrl);
      toast.success("อัปโหลดสลิปสำเร็จแล้ว", { id: toastId });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(`อัปโหลดสลิปไม่สำเร็จ: ${err.message || "เกิดข้อผิดพลาด"}`, { id: toastId });
    } finally {
      setUploadingSlip(false);
    }
  };

  // Accessibility states
  const [fontScale, setFontScale] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [pdpaOpen, setPdpaOpen] = useState(false);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      sender: "bot" | "user";
      text: string;
      options?: Array<{ label: string; value: string }>;
    }>
  >([]);
  const [currentStep, setCurrentStep] = useState<
    | "welcome"
    | "general"
    | "full_name"
    | "phone"
    | "line_id"
    | "done"
  >("welcome");
  const [chatInput, setChatInput] = useState("");
  const chatInitializedRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [liffUserId, setLiffUserId] = useState("");
  const liffInitedRef = useRef(false);

  // Background slider state
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Parallax layers
  const parallaxSlow = useParallax(0.25);
  const parallaxMed = useParallax(0.45);
  const parallaxFast = useParallax(0.65);

  // LIFF initialization
  useEffect(() => {
    if (liffInitedRef.current || typeof window === "undefined") return;
    liffInitedRef.current = true;
    const initLiff = async () => {
      if (!(window as any).liff) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://static.line-scdn.net/liff/edge/2/sdk.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("LIFF SDK load failed"));
          document.head.appendChild(s);
        });
      }
      const liff = (window as any).liff;
      await liff.init({ liffId: LIFF_ID });
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        setLiffUserId(profile.userId);
        setFullName((prev: string) => prev || profile.displayName);
      }
    };
    initLiff().catch((err) => console.warn("[LIFF]", err));
  }, []);

  // Voice Speech Synthesis
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "th-TH";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Apply Accessibility Settings
  useEffect(() => {
    document.documentElement.style.setProperty("--font-multiplier", fontScale.toString());
  }, [fontScale]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("hc-mode");
    } else {
      document.body.classList.remove("hc-mode");
    }
  }, [highContrast]);

  // Terminal animation
  useEffect(() => {
    if (!showTerminal) { setTerminalVisibleCount(0); return; }
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setTerminalVisibleCount(count);
      if (count >= TERMINAL_LINES.length) clearInterval(timer);
    }, 350);
    return () => clearInterval(timer);
  }, [showTerminal]);

  // Initialize Chat Messages
  useEffect(() => {
    if (!chatOpen || chatInitializedRef.current) return;

    chatInitializedRef.current = true;
    const introMsg =
      "สวัสดีครับ! ผมคือ Hermes Agent ไทบ้าน 🤖 ผู้ช่วยลงทะเบียนสำหรับเวิร์กช็อปนี้ครับ";
    const promptMsg =
      "ต้องการให้ผมช่วยเหลือเรื่องใด หรือแนะนำรายละเอียดงาน หรือช่วยกรอกข้อมูลลงทะเบียนสำหรับคุณดีครับ? เลือกตอบปุ่มด้านล่างได้เลยนะครับ 😊";

    setChatMessages([
      { sender: "bot", text: introMsg },
      {
        sender: "bot",
        text: promptMsg,
        options: [
          { label: "ช่วยฉันกรอกข้อมูลลงทะเบียน 📝", value: "yes" },
          { label: "สอบถามรายละเอียดของงาน 💬", value: "no" },
        ],
      },
    ]);
    speak(introMsg + " " + promptMsg);
  }, [chatOpen]);

  // Handle chatbot text responses
  const handleUserTextSubmit = (text: string) => {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { sender: "user", text }]);
    setChatInput("");

    if (currentStep === "full_name") {
      setFullName(text);
      setHighlightField("full_name");
      setTimeout(() => setHighlightField(null), 1500);
      setCurrentStep("phone");
      const botMsg =
        "ได้รับข้อมูลชื่อแล้วครับ! ถัดไปขอทราบ 'เบอร์โทรศัพท์' 10 หลักของคุณเพื่อการติดต่อประสานงานครับ 📞";
      setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
      speak(botMsg);
    } else if (currentStep === "phone") {
      const cleanNum = text.replace(/[^0-9]/g, "");
      if (cleanNum.length < 9 || cleanNum.length > 10) {
        const botMsg =
          "ขออภัยครับ เบอร์โทรศัพท์ต้องมีตัวเลขประมาณ 9-10 หลักนะครับ รบกวนกรอกใหม่อีกครั้งครับ 😊";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
        speak(botMsg);
      } else {
        setPhone(cleanNum);
        setHighlightField("phone");
        setTimeout(() => setHighlightField(null), 1500);
        setCurrentStep("line_id");
        const botMsg =
          "บันทึกเบอร์โทรเรียบร้อย! ถัดไปขอทราบ 'LINE ID' (หรือเบอร์โทรที่ผูกไลน์) เพื่อให้ทีมงานส่งรายละเอียดเพิ่มเติมให้ครับ 💬";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
        speak(botMsg);
      }
    } else if (currentStep === "line_id") {
      setLineId(text);
      setHighlightField("line_id");
      setTimeout(() => setHighlightField(null), 1500);
      setCurrentStep("done");
      const botMsg =
        "ข้อมูลพื้นฐานครบแล้วครับ! ผมได้กรอกชื่อ เบอร์โทร และ LINE ID ให้แล้ว กรุณาเลื่อนลงเพื่อกรอกข้อมูลเพิ่มเติม เลือกประเภทบัตร ระบุข้อมูลการชำระเงิน และยืนยันการสมัครครับ 📝";
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botMsg,
          options: [
            { value: "scroll_form", label: "ไปที่แบบฟอร์มและกรอกต่อ ↓" },
          ],
        },
      ]);
      speak(botMsg);
    } else if (currentStep === "general") {
      const q = text.toLowerCase();
      let botMsg =
        "ขออภัยครับ ผมเข้าใจข้อมูลจำกัดเกี่ยวกับงาน ลองถามเรื่อง 'วันที่จัดงาน', 'ราคาบัตร', หรือ 'เนื้อหาการเรียน' หรือเริ่มต้นลงทะเบียนได้เลยครับ!";
      if (
        q.includes("วันไหน") ||
        q.includes("สถานที่") ||
        q.includes("จัดที่ไหน") ||
        q.includes("เมื่อไหร่") ||
        q.includes("เวลา")
      ) {
        botMsg =
          "เวิร์กช็อปจัดวันเสาร์ที่ 28 มิถุนายน 2569 เวลา 13.30 – 16.30 น. ณ KICE Hall 1-2 ห้องประชุม M4-8 (ในงาน Smart Business Expo 2026) ครับ!";
      } else if (
        q.includes("ราคา") ||
        q.includes("เท่าไหร่") ||
        q.includes("บาท") ||
        q.includes("ค่าเรียน")
      ) {
        botMsg =
          "ราคาพิเศษเพียง 2,999 บาท (จากปกติ 5,999 บาท) ลงทะเบียนภายใน 27 มิ.ย. 69 เพื่อรับ Gift Voucher เรียนฟรี 3,000 บาท ที่จุดลงทะเบียนงาน Smart Business Expo ครับ!";
      } else if (
        q.includes("เรียน") ||
        q.includes("สอน") ||
        q.includes("เนื้อหา") ||
        q.includes("หลักสูตร")
      ) {
        botMsg =
          "เราจะเรียนการสร้าง AI Agent เชื่อมต่อ LINE OA เพื่อเข้าใจลูกค้า ตอบอัตโนมัติ 24 ชม., การตอบแชทปิดการขายครบวงจร, และการใช้ AI ช่วยคิดคอนเทนต์/ตัดต่อวิดีโอลง TikTok ให้ปังในวันเดียวครับ!";
      } else if (q.includes("สมัคร") || q.includes("ลงทะเบียน") || q.includes("จอง")) {
        setCurrentStep("full_name");
        botMsg =
          "ยอดเยี่ยมครับ! งั้นเรามาเริ่มกรอกข้อมูลกันเลย ขอทราบ 'ชื่อและนามสกุล' ของคุณเพื่อทำการลงทะเบียนครับ 😊";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
        speak(botMsg);
        return;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botMsg,
          options: [
            { label: "จัดวันไหน/สถานที่ไหน? 📅", value: "info_date" },
            { label: "ราคาเท่าไหร่? 💰", value: "info_price" },
            { label: "เนื้อหาที่สอน? 📚", value: "info_learn" },
            { label: "เริ่มลงทะเบียน 📝", value: "start_register" },
          ],
        },
      ]);
      speak(botMsg);
    } else {
      const botMsg =
        "ข้อมูลครบเรียบร้อยแล้วครับ หากต้องการกรอกฟอร์มใหม่ สามารถพิมพ์เพื่อบอกผมได้เลยครับ!";
      setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
      speak(botMsg);
    }
  };

  // Handle chatbot button option clicks
  const handleOptionClick = (value: string, label: string) => {
    setChatMessages((prev) => [...prev, { sender: "user", text: label }]);

    if (currentStep === "welcome") {
      if (value === "yes") {
        setCurrentStep("full_name");
        const botMsg =
          "ยินดีเลยครับ! งั้นขอทราบ 'ชื่อและนามสกุล' ของคุณเพื่อเริ่มลงทะเบียนจองสิทธิ์เรียนครับ ✍️";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
        speak(botMsg);
      } else {
        setCurrentStep("general");
        const botMsg =
          "ยินดีครับ! คุณสามารถถามคำถามทั่วไปได้เลยครับ เช่น เวิร์กช็อปจัดวันไหน, ราคาเท่าไหร่ หรือสอนอะไรบ้าง?";
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botMsg,
            options: [
              { label: "จัดวันไหน/สถานที่ไหน? 📅", value: "info_date" },
              { label: "ราคาเท่าไหร่? 💰", value: "info_price" },
              { label: "เวิร์กช็อปนี้สอนอะไรบ้าง? 📚", value: "info_learn" },
              { label: "เริ่มลงทะเบียน 📝", value: "start_register" },
            ],
          },
        ]);
        speak(botMsg);
      }
    } else if (currentStep === "general") {
      if (value === "info_date") {
        const botMsg =
          "เวิร์กช็อปจัดวันเสาร์ที่ 28 มิถุนายน 2569 เวลา 13.30 – 16.30 น. ณ KICE Hall 1-2 ห้องประชุม M4-8 (ในงาน Smart Business Expo 2026) ครับ!";
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botMsg,
            options: [
              { label: "ราคาเท่าไหร่? 💰", value: "info_price" },
              { label: "สอนอะไรบ้าง? 📚", value: "info_learn" },
              { label: "เริ่มลงทะเบียน 📝", value: "start_register" },
            ],
          },
        ]);
        speak(botMsg);
      } else if (value === "info_price") {
        const botMsg =
          "ราคาพิเศษเพียง 2,999 บาท (จากปกติ 5,999 บาท) ลงทะเบียนภายใน 27 มิ.ย. 69 เพื่อรับ Gift Voucher เรียนฟรี 3,000 บาท ที่จุดลงทะเบียนงาน Smart Business Expo ครับ!";
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botMsg,
            options: [
              { label: "จัดที่ไหน? 📅", value: "info_date" },
              { label: "สอนอะไรบ้าง? 📚", value: "info_learn" },
              { label: "เริ่มลงทะเบียน 📝", value: "start_register" },
            ],
          },
        ]);
        speak(botMsg);
      } else if (value === "info_learn") {
        const botMsg =
          "เราจะเรียนการสร้าง AI Agent เชื่อมต่อ LINE OA เพื่อเข้าใจลูกค้า ตอบอัตโนมัติ 24 ชม., การตอบแชทปิดการขายครบวงจร, และการใช้ AI ช่วยคิดคอนเทนต์/ตัดต่อวิดีโอลง TikTok ให้ปังในวันเดียวครับ!";
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botMsg,
            options: [
              { label: "จัดวันไหน? 📅", value: "info_date" },
              { label: "ราคาเท่าไหร่? 💰", value: "info_price" },
              { label: "เริ่มลงทะเบียน 📝", value: "start_register" },
            ],
          },
        ]);
        speak(botMsg);
      } else if (value === "start_register") {
        setCurrentStep("full_name");
        const botMsg =
          "ยอดเยี่ยมครับ! งั้นเรามาเริ่มกรอกข้อมูลกันเลย ขอทราบ 'ชื่อและนามสกุล' ของคุณเพื่อทำการลงทะเบียนครับ 😊";
        setChatMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
        speak(botMsg);
      }
    } else if (currentStep === "done") {
      if (value === "scroll_form") {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setChatOpen(false);
      }
    }
  };

  function handleNext() {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!fullName.trim()) newErrors.full_name = "กรุณากรอกชื่อ-นามสกุล";
      if (!phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
      if (!email.trim()) newErrors.email = "กรุณากรอกอีเมล";
      if (!lineId.trim()) newErrors.line_id = "กรุณากรอก LINE ID";
      if (!province.trim()) newErrors.province = "กรุณากรอกจังหวัดที่อยู่";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (needsReceipt === null) newErrors.needs_receipt = "กรุณาระบุว่าต้องการใบเสร็จหรือไม่";
    if (!consent) newErrors.consent = "กรุณายอมรับเงื่อนไขการสมัคร";
    if (!paymentDatetime.trim()) newErrors.payment_datetime = "กรุณาระบุวันเวลาที่โอนเงิน";
    if (!paymentProofUrl.trim()) newErrors.payment_proof_url = "กรุณาอัปโหลดหลักฐานการโอนเงิน (รูปสลิป)";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    setShowTerminal(true);
    setTerminalVisibleCount(0);
    setSubmitting(true);
    const data = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      line_id: lineId.trim(),
      email: email.trim(),
      province: province.trim(),
      district: district.trim(),
      occupation: occupation.trim(),
      business_name: "",
      interest_topic: interestTopics.join(", "),
      has_line_oa: "",
      ticket_type: "special",
      needs_receipt: needsReceipt === true,
      receipt_name: receiptName.trim(),
      receipt_tax_id: receiptTaxId.trim(),
      receipt_address: receiptAddress.trim(),
      payment_method: paymentMethod.trim(),
      payment_datetime: paymentDatetime.trim(),
      payment_amount: paymentAmount.trim(),
      payment_proof_url: paymentProofUrl.trim(),
      notes: notes.trim(),
      line_user_id: liffUserId,
      system_prompt: systemPrompt.trim(),
      source_channel:
        g === "njv"
          ? "LINE_LIFF_NUMNAKOM"
          : g === "premium"
            ? "LINE_LIFF_PREMIUM"
            : "LINE_LIFF",
      line_display_name: liffUserId ? fullName.trim() : "",
      consent: true as const,
    };
    try {
      const [res] = await Promise.all([
        submit({ data }),
        new Promise<void>((resolve) => setTimeout(resolve, TERMINAL_LINES.length * 350 + 600)),
      ]);
      navigate({ to: "/success", search: { code: res.registration_code, slip: !!paymentProofUrl } });
    } catch (err) {
      console.error(err);
      setShowTerminal(false);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* ── BACKGROUND SLIDESHOW (SIDE-SLIDING) ──────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {BG_IMAGES.map((img, idx) => {
          const isActive = idx === bgIndex;
          const translateVal =
            idx === bgIndex
              ? "translateX(0)"
              : idx < bgIndex
                ? "translateX(-100%)"
                : "translateX(100%)";
          return (
            <div
              key={img}
              className="absolute inset-0 bg-cover bg-center transition-all duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                backgroundImage: `url('${img}')`,
                transform: `${translateVal} scale(${isActive ? 1 : 1.05})`,
                opacity: highContrast ? 0 : isActive ? 0.22 : 0,
              }}
            />
          );
        })}
        {/* Main backdrop blend overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/65 to-background" />
      </div>

      <style>{`
        /* Parallax base */
        .parallax-wrap { overflow: hidden; position: relative; }

        /* Scroll reveal */
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-left.is-visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(30px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
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

        /* Fade-up animation for modals & panels */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-up { animation: fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }

        /* Subtle pulse for accessibility button */
        @keyframes pulse-soft { 0%,100%{box-shadow:0 0 0 0 oklch(0.82 0.15 85 / 0.4)} 50%{box-shadow:0 0 0 8px oklch(0.82 0.15 85 / 0)} }
        .animate-pulse-soft { animation: pulse-soft 2.4s ease-in-out infinite; }

        /* PDPA modal backdrop dark-overlay via CSS so text stays white */
        .pdpa-content-text { color: oklch(0.92 0.01 260); }
        .pdpa-muted-text   { color: oklch(0.72 0.03 260); }
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
                href="https://www.facebook.com/share/1CYyEYkj81/?mibextid=wwXIfr"
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-bold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 ping-gold" />
                <span className="text-red-400">เปิดรับสมัครอย่างเป็นทางการ</span>
                <span className="text-slate-300">• Smart Business Expo 2026</span>
              </div>

              {/* Smart Business Expo Logo */}
              <div className="mb-6">
                <img
                  src="/logo-smart-expo.png"
                  alt="Smart Business Expo 2026"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1] tracking-tight"
                aria-label="สะออนทัวร์ Agent ไทบ้าน ขอนแก่น"
              >
                <span className="block text-foreground/95">สะออนทัวร์</span>
                <span className="block shimmer-text mt-1">Agent ไทบ้าน</span>
                <span className="block text-foreground/80 text-4xl sm:text-5xl lg:text-6xl mt-2 flex items-center gap-2">
                  ขอนแก่น
                  <SpeakButton
                    text="สะออนทัวร์ เวิร์กช็อป เอเจนต์ไทบ้าน ขอนแก่น ยูพีสกิล ไลน์ โอเอ แอนด์ ติ๊กต๊อก ด้วยพลัง เอไอ ในงาน สมาร์ท บิสซิเนส เอ็กซ์โป สองพันยี่สิบหก"
                    enabled={ttsEnabled}
                  />
                </span>
              </h1>

              <div className="neon-line w-24 my-6" />

              <p className="text-lg sm:text-xl font-semibold">
                มาอัปสกิลแบบ<span className="text-gold font-extrabold">ลงมือทำจริง</span>
              </p>
              <p className="mt-3 text-slate-300 text-base max-w-md leading-relaxed">
                เรียนรู้การสร้าง AI Agent เชื่อม LINE OA และใช้ AI ทำคอนเทนต์ TikTok ให้ใช้งานได้จริงในธุรกิจและงานประจำ
              </p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
                {[
                  { label: "วันอบรม", value: "28 มิ.ย. 2569" },
                  { label: "เวลา", value: "13:30-16:30" },
                  { label: "สถานที่", value: "KICE M4-8" },
                  { label: "รูปแบบ", value: "ลงมือทำจริง" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 backdrop-blur"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                ลงทะเบียนภายใน 27 มิ.ย. 69 รับ Gift Voucher เรียนฟรี 3,000 บาท!
              </div>

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
                  { icon: Users, label: "เหมาะกับผู้ประกอบการ" },
                  { icon: Wrench, label: "มี Workshop ทำตามจริง" },
                  { icon: Shield, label: "ยืนยันสิทธิ์เป็นระบบ" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-xs text-slate-200"
                  >
                    <t.icon className="w-3.5 h-3.5 text-gold" />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Chat UI (parallax subtle) */}
            <div className="space-y-4">
              <ChatDemo />
              <div className="glass-card rounded-2xl p-5 border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 grid place-items-center text-gold">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">ขั้นตอนหลังลงทะเบียน</p>
                    <p className="text-xs text-slate-300">ชัดเจน ตรวจสอบได้ ไม่ปล่อยให้รอแบบไม่รู้สถานะ</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {REGISTRATION_STEPS.map((stepLabel, index) => (
                    <div key={stepLabel} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-[11px] font-black text-gold">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed text-foreground/85">{stepLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background slider dots (horizontal translation controls) */}
        {!highContrast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-background/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-border/40 shadow-glow">
            {BG_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBgIndex(idx);
                  speak(`เปลี่ยนภาพพื้นหลังเป็นรูปแบบที่ ${idx + 1}`);
                }}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  idx === bgIndex
                    ? "bg-gold w-8 shadow-glow"
                    : "bg-slate-500/50 hover:bg-slate-400"
                }`}
                aria-label={`เปลี่ยนสไลด์ภาพที่ ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 bounce-y">
          <span className="text-[10px] tracking-widest uppercase">เลื่อนดู</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────── */}
      <div className="neon-line opacity-40" />

      {/* ── URGENCY BANNER ────────────────────────────────── */}
      <section className="py-6 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-5 sm:p-6 border-red-500/30 bg-red-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-soft">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 grid place-items-center shrink-0">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-extrabold text-red-400">🚨 ด่วน! รับจำนวนจำกัด</p>
                <p className="text-xs text-slate-300">
                  ลงทะเบียนภายใน <span className="text-gold font-bold">27 มิถุนายน 2569</span> รับ Gift Voucher เรียนฟรี <span className="text-gold font-bold">3,000 บาท</span> ที่จุดลงทะเบียนงาน Smart Business Expo
                </p>
              </div>
            </div>
            <a
              href="#register"
              className="btn-gradient px-6 py-3 rounded-full text-sm font-extrabold whitespace-nowrap shrink-0"
            >
              สแกนลงทะเบียนเลย →
            </a>
          </div>
        </div>
      </section>

      {/* ── PROFESSIONAL TRUST STRIP ────────────────────────── */}
      <section className="py-10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-4">
              {PROFESSIONAL_TRUST_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-card/45 p-5 shadow-card-soft backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold leading-snug text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── EVENT DETAILS ─────────────────────────────────── */}
      <section id="details" className="py-24 relative overflow-hidden">
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              ข้อมูลงาน
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-12 flex items-center justify-center gap-2 flex-wrap">
              <span>สะออนทัวร์ Workshop: Agent ไทบ้าน ขอนแก่น</span>
              <SpeakButton
                text="ข้อมูลงาน สะออนทัวร์ เวิร์กช็อป เอเจนต์ไทบ้าน ขอนแก่น วันเสาร์ที่ยี่สิบแปดมิถุนายน สองพันห้าร้อยหกสิบเก้า เวลาบ่ายโมงครึ่งถึงสี่โมงครึ่ง จัดที่ ไคซ์ฮอลล์ หนึ่งถึงสอง ขอนแก่น ห้องประชุม เอ็มสี่ขีดแปด ในงาน สมาร์ท บิสซิเนส เอ็กซ์โป"
                enabled={ttsEnabled}
              />
            </h2>
          </RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "วันที่", value: "28 มิ.ย. 2569", sub: "วันเสาร์" },
              { icon: Clock, label: "เวลา", value: "13:30 – 16:30", sub: "น." },
              { icon: MapPin, label: "สถานที่", value: "KICE Hall 1-2", sub: "Smart Business Expo" },
              { icon: Wrench, label: "ห้องประชุม", value: "M4-8", sub: "ภายในงาน" },
            ].map((d, i) => (
              <RevealSection key={d.label} delay={i * 100}>
                <div className="glass-card glass-card-hover rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gold-gradient grid place-items-center mx-auto mb-4 shadow-glow">
                    <d.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">
                    {d.label}
                  </p>
                  <p className="font-extrabold text-lg leading-tight">{d.value}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{d.sub}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU LEARN ────────────────────────────────── */}
      <section id="learn" className="py-24 relative overflow-hidden">
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
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
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-4 flex items-center justify-center gap-2 flex-wrap">
              <span>เปลี่ยน LINE OA และ ติ๊กต๊อก ให้ทำงานเองได้</span>
              <SpeakButton
                text="สิ่งที่คุณจะได้เรียนรู้ เปลี่ยนไลน์ โอเอ และ ติ๊กต๊อกให้ทำงานเองได้ ปลดล็อกการขายอัจฉริยะในหนึ่งวัน โดยเวิร์กช็อปลงมือทำจริง"
                enabled={ttsEnabled}
              />
            </h2>
            <p className="text-center text-slate-300 text-sm max-w-lg mx-auto mb-14">
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
                      <p className="text-sm text-slate-300 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW AI AGENT WORKS ─────────────────────────── */}
      <section id="how-agent" className="py-24 relative overflow-hidden">
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <ParallaxOrb
          speed={0.18}
          className="absolute left-[-10%] top-[20%] w-[500px] h-[500px] bg-primary/6 orb orb-2"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              เข้าใจเทคโนโลยี
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-4 flex items-center justify-center gap-2 flex-wrap">
              <span>AI Agent ทำงานอย่างไร?</span>
              <SpeakButton
                text="เอไอ เอเจนต์ ทำงานอย่างไร? เอเจนต์คือ ปัญญาประดิษฐ์ที่สามารถรับคำสั่ง วิเคราะห์ความต้องการ ใช้เครื่องมือดำเนินการ และส่งผลลัพธ์กลับหาผู้ใช้งานได้อัตโนมัติ"
                enabled={ttsEnabled}
              />
            </h2>
            <p className="text-center text-slate-300 text-sm max-w-xl mx-auto mb-14">
              Agent คือ AI ที่ไม่แค่ "ตอบคำถาม" แต่ "ลงมือทำ" ได้จริง — ตั้งแต่รับคำสั่ง วิเคราะห์
              เลือกเครื่องมือ ไปจนถึงส่งผลลัพธ์กลับ ทั้งหมดนี้ทำงานอัตโนมัติ
            </p>
          </RevealSection>

          {/* Agent Steps Flow */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: 1,
                icon: MessageCircle,
                title: "1. รับคำสั่ง (Input)",
                desc: 'ผู้ใช้งานส่งข้อความ เช่น "จองคิววันพรุ่งนี้", "ช่วยสรุปยอดขาย" ผ่าน LINE, เว็บ, หรือแอปต่างๆ',
                color: "text-line",
                bg: "bg-line/10",
                gradient: "from-[#06C755]/20 to-transparent",
              },
              {
                step: 2,
                icon: Brain,
                title: "2. วิเคราะห์ (Think)",
                desc: "AI เข้าใจความหมาย (NLU) วิเคราะห์เจตนา เลือกกลยุทธ์และขั้นตอนที่เหมาะสมที่สุดในการตอบสนอง",
                color: "text-gold",
                bg: "bg-gold/10",
                gradient: "from-[oklch(0.82_0.15_85)]/20 to-transparent",
              },
              {
                step: 3,
                icon: Cog,
                title: "3. ดำเนินการ (Act)",
                desc: "Agent เรียกใช้เครื่องมือ (Tool) เช่น ค้น DB, จองปฏิทิน, ส่ง API, อ่าน CRM ทำงานเป็นลำดับขั้นอัตโนมัติ",
                color: "text-tiktok",
                bg: "bg-tiktok/10",
                gradient: "from-[#EE1D52]/20 to-transparent",
              },
              {
                step: 4,
                icon: Send,
                title: "4. ส่งผลลัพธ์ (Output)",
                desc: 'ตอบกลับผู้ใช้ทันทีในรูปแบบที่เข้าใจง่าย เช่น "จองสำเร็จ! คิว 10:00 น. พรุ่งนี้ครับ" พร้อมข้อมูลที่จัดเรียงแล้ว',
                color: "text-primary",
                bg: "bg-primary/10",
                gradient: "from-primary/20 to-transparent",
              },
            ].map((item, i) => (
              <RevealSection key={item.step} delay={i * 150}>
                <div className="group glass-card glass-card-hover rounded-2xl p-6 h-full relative overflow-hidden">
                  {/* Glow background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative z-10">
                    {/* Step number badge */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} grid place-items-center shrink-0`}
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full bg-gold-gradient grid place-items-center text-xs font-black text-primary-foreground shadow-glow`}
                      >
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-base font-extrabold mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                  {/* Connector arrow (except last) */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-6 h-6 rounded-full bg-gold/20 grid place-items-center">
                        <ArrowRight className="w-3 h-3 text-gold" />
                      </div>
                    </div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Summary Card */}
          <RevealSection delay={700}>
            <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto text-center border-gold/20">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-gradient grid place-items-center shadow-glow">
                  <Cpu className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-3">
                ในเวิร์กช็อปนี้ คุณจะได้สร้าง Agent ของตัวเอง!
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-5">
                เชื่อมต่อกับ LINE OA ของคุณ ให้ Agent ตอบลูกค้า 24 ชม. จองคิว ปิดการขาย
                และส่งข้อมูลเข้า CRM ได้อัตโนมัติ — ทั้งหมดนี้สร้างเสร็จภายในวันเดียว
              </p>
              <a
                href="#register"
                className="btn-gradient inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm"
              >
                ลงทะเบียนสร้าง Agent ของคุณ <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      <div className="neon-line opacity-40" />

      {/* ── SPEAKERS ──────────────────────────────────────── */}
      <section id="speakers" className="py-24 relative overflow-hidden">
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
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
                image: "/showcase-poramate.png",
                portfolioTitle: "Kapook.com & LINE OA Leader",
                portfolioDesc:
                  "ผู้บุกเบิกสื่อดิจิทัลไทยและระบบบริการ LINE OA ขนาดใหญ่ที่มีผู้ใช้กว่าหลายล้านคน",
              },
              {
                name: "โดม เจริญยศ",
                role: "Speaker",
                tag: "AI / Tech / Digital Strategy",
                accent: "gold" as const,
                letter: "โ",
                link: "https://www.facebook.com/share/18paKcNdeB/?mibextid=wwXIfr",
                buttonText: "ติดตาม Facebook",
                image: "/showcase-dome.png",
                portfolioTitle: "Enterprise AI & Cloud Automation",
                portfolioDesc:
                  "ผู้ออกแบบและพัฒนาสถาปัตยกรรมระบบคลาวด์และระบบ AI Agent อัจฉริยะสำหรับองค์กรชั้นนำ",
              },
              {
                name: "หนุ่มนักออม",
                role: "Special Guest",
                tag: "สอน AI สร้างคลิป TikTok • เพจหนุ่มนักออม",
                accent: "tiktok" as const,
                letter: "ห",
                link: "https://www.tiktok.com/@noomnugaom?_r=1&_t=ZS-97NNRxCges4",
                buttonText: "ติดตาม TikTok",
                image: "/showcase-nugaom.png",
                portfolioTitle: "AI TikTok Creator & Influencer",
                portfolioDesc:
                  "สร้างสรรค์คอนเทนต์วิดีโอสคริปต์สั้นด้วย AI ยอดชมหลักล้าน และผู้ติดตามผู้มีอิทธิพลทางการเงิน",
              },
            ].map((s, i) => (
              <RevealSection key={s.name} delay={i * 150}>
                <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 group relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                  <div>
                    {/* Header: Avatar & Info */}
                    <div className="flex items-center gap-3.5 text-left mb-5">
                      <div className="relative shrink-0">
                        <div
                          className={`w-12 h-12 rounded-xl grid place-items-center text-xl font-black ${
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
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-background ${s.accent === "line" ? "bg-line" : s.accent === "tiktok" ? "bg-tiktok" : "bg-gold"} ping-gold`}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-300 uppercase tracking-widest leading-none mb-1">
                          {s.role}
                        </p>
                        <h3 className="text-base font-black leading-tight truncate">{s.name}</h3>
                        <p className="text-[10px] text-slate-300 leading-tight truncate mt-0.5">
                          {s.tag}
                        </p>
                      </div>
                    </div>

                    {/* Portfolio / Achievement Showcase Image */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/30 mb-4 bg-black/40 group/img">
                      <img
                        src={s.image}
                        alt={s.portfolioTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-3 text-left">
                        <p className="text-[9px] text-gold font-bold uppercase tracking-wider mb-0.5">
                          ผลงานเด่นในวงการ
                        </p>
                        <p className="text-xs font-extrabold text-white leading-tight">
                          {s.portfolioTitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 text-left leading-relaxed min-h-[54px] line-clamp-3">
                      {s.portfolioDesc}
                    </p>
                  </div>
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 w-full relative z-10 ${
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
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
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
                <h2 className="text-3xl sm:text-4xl font-black mb-8">ลงทะเบียนก่อน 27 มิ.ย. 69 เพื่อรับ Voucher</h2>

                {/* Price display */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gold-gradient blur-3xl opacity-20 rounded-full" />
                  <div className="relative flex items-end justify-center gap-3">
                    <span className="text-xl text-slate-300 line-through self-start mt-2">
                      ฿5,999
                    </span>
                    <span className="shimmer-text text-7xl sm:text-8xl font-black leading-none">
                      2,999
                    </span>
                    <span className="text-xl font-bold mb-1 text-slate-300">฿</span>
                  </div>
                </div>

                {/* Perks */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "รับ Gift Voucher เรียนฟรี 3,000 บาท",
                      color: "text-line",
                    },
                    { icon: Zap, text: "รับที่จุดลงทะเบียนงาน Smart Business Expo", color: "text-gold" },
                    { icon: Calendar, text: "ลงทะเบียนด่วน! ภายใน 27 มิ.ย. 69", color: "text-red-400" },
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

                <p className="text-sm text-slate-300 mb-8">
                  สิทธิพิเศษเมื่อจองออนไลน์: ราคาพิเศษเพียง 2,999 บาท (ปกติ 5,999 บาท) ลงทะเบียนภายใน 27 มิ.ย. 69 รับ Gift Voucher เรียนฟรีมูลค่า 3,000 บาท ณ จุดลงทะเบียนงาน Smart Business Expo
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
        {/* Section Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <ParallaxOrb
          speed={0.2}
          className="absolute right-0 top-0 w-[500px] h-[500px] bg-[oklch(0.72_0.22_0)]/8 orb orb-3"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <RevealSection>
            <p className="text-center text-gold font-bold text-xs uppercase tracking-[0.2em] mb-3">
              Secure Registration
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-3">
              ลงทะเบียนเรียน Workshop อย่างเป็นระบบ
            </h2>
            <p className="text-center text-slate-300 text-sm mb-10">
              กรอกข้อมูลครั้งเดียว ระบบจะสร้างเลขอ้างอิงการจองและทีมงานจะใช้ข้อมูลเพื่อตรวจสอบสิทธิ์เท่านั้น
            </p>
          </RevealSection>

          <RevealSection delay={100}>
            <form ref={formRef} onSubmit={onSubmit} className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold">ระบบลงทะเบียนอย่างเป็นทางการ</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-300">
                        ข้อมูลถูกใช้เพื่อออกเลขจอง ติดต่อยืนยันสิทธิ์ ส่ง QR Code และจัดเตรียม Workshop ให้ตรงกับผู้เข้าอบรม
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center sm:w-72">
                    {["ข้อมูล", "AI Agent", "ยืนยัน"].map((label, idx) => (
                      <div key={label} className="rounded-xl bg-white/[0.04] px-2 py-2">
                        <p className="text-[10px] font-black text-gold">{idx + 1}</p>
                        <p className="text-[10px] font-bold text-slate-300">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Step indicator ── */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {([1, 2, 3] as const).map((s) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold border-2 transition-all duration-300
                      ${step === s ? "border-gold bg-gold/20 text-gold scale-110" : step > s ? "border-green-400 bg-green-400/20 text-green-400" : "border-border/60 bg-muted/10 text-slate-400"}`}>
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    <span className={`text-[11px] font-semibold hidden sm:block mr-1 ${step === s ? "text-gold" : step > s ? "text-green-400" : "text-slate-300"}`}>
                      {s === 1 ? "ข้อมูล" : s === 2 ? "AI Agent" : "ยืนยัน"}
                    </span>
                    {s < 3 && <div className={`w-8 h-0.5 mx-1 ${step > s ? "bg-green-400" : "bg-border/50"} transition-all duration-300`} />}
                  </div>
                ))}
              </div>

              {/* ── Step 1: ข้อมูลผู้ดูแล ── */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 grid place-items-center text-gold"><User className="w-4 h-4" /></div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight">ข้อมูลผู้ดูแล (บอท)</h3>
                      <p className="text-xs text-slate-300">ข้อมูลสำหรับติดต่อกลับและเชื่อมต่อ LINE OA</p>
                    </div>
                  </div>

                  <Field label="ชื่อ-นามสกุล" name="full_name" required error={errors.full_name} icon={User}
                    placeholder="เช่น สมชาย ใจดี" value={fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                    highlighted={highlightField === "full_name"} />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="เบอร์โทรศัพท์" name="phone" type="tel" required error={errors.phone} icon={Phone}
                      placeholder="0812345678" value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      highlighted={highlightField === "phone"} />
                    <Field label="อีเมล" name="email" type="email" required error={errors.email} icon={Mail}
                      placeholder="example@email.com" value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      highlighted={highlightField === "email"} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="LINE ID" name="line_id" required error={errors.line_id} icon={Smartphone}
                      placeholder="LINE ID หรือเบอร์ที่ผูก" value={lineId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLineId(e.target.value)}
                      highlighted={highlightField === "line_id"} />
                    <Field label="จังหวัด" name="province" required error={errors.province} icon={Map}
                      placeholder="เช่น ขอนแก่น" value={province}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProvince(e.target.value)}
                      highlighted={highlightField === "province"} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="อำเภอ/เขต" name="district" icon={Map}
                      placeholder="เช่น เมืองขอนแก่น" value={district}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDistrict(e.target.value)} />
                    <Field label="อาชีพ/ธุรกิจ" name="occupation" icon={Briefcase}
                      placeholder="เช่น ค้าขาย, ออฟฟิศ" value={occupation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOccupation(e.target.value)} />
                  </div>
                </div>
              )}

              {/* ── Step 2: เลือกความสามารถ AI ── */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center text-primary"><Brain className="w-4 h-4" /></div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight">เลือกความสามารถ AI Agent</h3>
                      <p className="text-xs text-slate-300">เลือกฟังก์ชันที่ต้องการให้บอทของคุณทำได้</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { value: "สร้าง AI Agent เชื่อมต่อ LINE OA", icon: Bot },
                      { value: "ตอบแชทลูกค้าและจัดการงานประจำอัตโนมัติ", icon: MessageCircle },
                      { value: "สร้างคอนเทนต์ TikTok ให้เร็วขึ้น", icon: Video },
                      { value: "ลดงานซ้ำซ้อน ประหยัดเวลา เพิ่มประสิทธิภาพธุรกิจ", icon: Zap },
                      { value: "อื่นๆ / แจ้งเพิ่มเติมใน System Prompt", icon: Sparkles },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const sel = interestTopics.includes(opt.value);
                      return (
                        <button key={opt.value} type="button"
                          onClick={() => setInterestTopics(prev => sel ? prev.filter(v => v !== opt.value) : [...prev, opt.value])}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${sel ? "border-primary bg-primary/10 text-gold" : "border-border/60 bg-input/40 hover:border-border text-foreground"}`}>
                          <div className={`shrink-0 w-7 h-7 rounded-lg grid place-items-center ${sel ? "bg-gold-gradient text-primary-foreground" : "bg-muted/40 text-slate-300"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-sm font-semibold leading-tight">{opt.value}</span>
                          {sel && <CheckCircle2 className="w-4 h-4 text-gold ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-gold" />
                      <label className="text-sm font-bold text-foreground/80">System Prompt คำสั่งควบคุมบอทของคุณ <span className="text-slate-300 font-normal">(ไม่บังคับ)</span></label>
                    </div>
                    <textarea
                      rows={5}
                      placeholder={"เช่น:\nคุณคือผู้ช่วยขายสินค้าของร้าน X\nตอบภาษาไทย สุภาพ เป็นมิตร\nแนะนำสินค้าเมื่อลูกค้าถามราคา..."}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-input/50 border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground outline-none resize-none text-sm transition-all font-mono"
                    />
                    <p className="text-xs text-slate-300">ทีมงานจะใช้ prompt นี้ตั้งค่าบอท AI Agent ของคุณระหว่าง Workshop</p>
                  </div>
                </div>
              )}

              {/* ── Step 3: ตรวจสอบข้อมูล & มัดจำ ── */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-up">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 grid place-items-center text-gold"><Cog className="w-4 h-4" /></div>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight">ตรวจสอบข้อมูล & มัดจำ</h3>
                      <p className="text-xs text-slate-300">ยืนยันรายละเอียดและชำระเงินมัดจำเพื่อจองสิทธิ์</p>
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className="rounded-2xl p-4 space-y-3 text-sm" style={{ background: "oklch(0.24 0.04 262 / 0.8)", border: "1px solid oklch(0.38 0.04 262 / 0.5)", color: "oklch(0.92 0.01 260)" }}>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "oklch(0.96 0.01 260)" }}>สรุปข้อมูลการลงทะเบียน</p>
                    <div className="grid sm:grid-cols-2 gap-y-1.5 gap-x-4">
                      <span><span style={{ color: "oklch(0.86 0.01 260)" }}>ชื่อ: </span><span className="font-bold text-white">{fullName}</span></span>
                      <span><span style={{ color: "oklch(0.86 0.01 260)" }}>เบอร์: </span><span className="font-bold text-white">{phone}</span></span>
                      <span><span style={{ color: "oklch(0.86 0.01 260)" }}>LINE: </span><span className="font-bold text-white">{lineId}</span></span>
                      <span><span style={{ color: "oklch(0.86 0.01 260)" }}>จังหวัด: </span><span className="font-bold text-white">{province}{district ? ` / ${district}` : ""}</span></span>
                    </div>
                    {interestTopics.length > 0 && (
                      <div className="pt-2 border-t" style={{ borderColor: "oklch(0.38 0.04 262)" }}>
                        <p className="text-[10px] mb-1.5" style={{ color: "oklch(0.86 0.01 260)" }}>ความสามารถ AI ที่เลือก:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {interestTopics.map(t => (
                            <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/20">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bill display */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.7 0.18 50 / 0.5)" }}>
                    <div className="p-5 text-center" style={{ background: "oklch(0.26 0.08 50 / 0.5)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">ใบบิลมัดจำจองสิทธิ์ – ราคาพิเศษ</p>
                      <p className="text-4xl font-black text-gold">2,999 <span className="text-lg font-bold">บาท</span></p>
                      <p className="text-xs line-through mt-0.5 text-slate-400">ราคาปกติ 5,999 บาท</p>
                    </div>
                    <div className="p-4 space-y-3" style={{ background: "oklch(0.22 0.05 262 / 0.9)" }}>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-9 h-9 rounded-xl grid place-items-center bg-green-500/15 shrink-0 font-black text-green-400">K</div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">ธนาคารกสิกรไทย</p>
                          <p className="font-extrabold text-gold text-lg leading-tight">405-3-05346-3</p>
                          <p className="text-xs text-slate-200">อัจฉรีญา โถนารัตน์</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl text-xs font-semibold leading-relaxed"
                        style={{ background: "oklch(0.7 0.18 50 / 0.08)", border: "1px solid oklch(0.7 0.18 50 / 0.25)", color: "oklch(0.88 0.06 50)" }}>
                        💡 โอนเงิน 2,999 บาท เข้าบัญชีด้านบน แล้วแนบหลักฐานด้านล่างเพื่อความรวดเร็วในการยืนยันสิทธิ์!
                      </div>
                    </div>
                  </div>

                  {/* Payment Details Input Fields */}
                  <div className="space-y-4 pt-3 border-t border-border/40">
                    <h4 className="font-bold text-sm text-foreground/80 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gold" />
                      ข้อมูลการชำระเงินมัดจำ
                    </h4>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-slate-300">ช่องทางการชำระเงิน</label>
                        <input
                          type="text"
                          value={paymentMethod}
                          className="w-full px-4 py-2.5 rounded-xl bg-input/40 border border-border/40 text-slate-200 text-sm cursor-not-allowed outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-slate-300">จำนวนเงินโอน (บาท)</label>
                        <input
                          type="text"
                          value={paymentAmount}
                          className="w-full px-4 py-2.5 rounded-xl bg-input/40 border border-border/40 text-slate-200 text-sm cursor-not-allowed outline-none"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-foreground/80">
                        วันและเวลาที่โอนเงิน <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={paymentDatetime}
                        onChange={(e) => setPaymentDatetime(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-input/50 border text-foreground text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 ${
                          errors.payment_datetime ? "border-red-400" : "border-border/60"
                        }`}
                      />
                      {errors.payment_datetime && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-400" />
                          {errors.payment_datetime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-foreground/80">
                        หลักฐานการโอนเงิน (สลิปโอนเงิน) <span className="text-red-400">*</span>
                      </label>
                      
                      {paymentProofUrl ? (
                        <div className="relative rounded-2xl border border-gold/20 overflow-hidden bg-gold/5 p-4 flex flex-col items-center">
                          <img
                            src={paymentProofUrl}
                            alt="Payment Slip Proof"
                            className="max-h-64 object-contain rounded-lg border border-border shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setPaymentProofUrl("")}
                            className="mt-3 px-4 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition-colors"
                          >
                            ลบรูปภาพและอัปโหลดใหม่
                          </button>
                        </div>
                      ) : (
                        <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                          errors.payment_proof_url ? "border-red-400 bg-red-500/5" : "border-border/60 bg-input/30 hover:border-gold/50"
                        }`}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSlipChange}
                            disabled={uploadingSlip}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center justify-center gap-2">
                            {uploadingSlip ? (
                              <>
                                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                <p className="text-xs font-bold text-gold">กำลังอัปโหลดรูปภาพ...</p>
                              </>
                            ) : (
                              <>
                                <UploadCloud className="w-8 h-8 text-gold" style={{ animation: "bounce-y 2s infinite" }} />
                                <p className="text-sm font-bold text-foreground">คลิกหรือลากไฟล์ภาพสลิปเพื่ออัปโหลด</p>
                                <p className="text-[10px] text-muted-foreground">รองรับไฟล์รูปภาพ PNG, JPG, JPEG เท่านั้น</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {errors.payment_proof_url && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-red-400" />
                          {errors.payment_proof_url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Receipt */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                      <div className="w-7 h-7 rounded-lg bg-gold/10 grid place-items-center text-gold"><FileText className="w-3.5 h-3.5" /></div>
                      <h4 className="font-bold text-sm">ต้องการใบเสร็จ? <span className="text-red-400">*</span></h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ value: true, label: "ต้องการ" }, { value: false, label: "ไม่ต้องการ" }].map((opt) => {
                        const sel = needsReceipt === opt.value;
                        return (
                          <button key={String(opt.value)} type="button" onClick={() => setNeedsReceipt(opt.value)}
                            className={`py-2.5 rounded-2xl border text-sm font-bold transition-all ${sel ? "border-gold bg-gold/10 text-gold shadow-glow" : "border-border/60 bg-input/40 hover:border-border text-foreground"}`}>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.needs_receipt && <p className="text-xs text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400" />{errors.needs_receipt}</p>}
                    {needsReceipt === true && (
                      <div className="space-y-4 pt-2 pl-3 border-l-2 border-gold/30">
                        <Field label="ชื่อ/บริษัท สำหรับออกใบเสร็จ" name="receipt_name" icon={Building}
                          placeholder="ชื่อบุคคล หรือชื่อบริษัท" value={receiptName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiptName(e.target.value)} />
                        <Field label="เลขประจำตัวผู้เสียภาษี" name="receipt_tax_id" icon={FileText}
                          placeholder="เช่น 1234567890123" value={receiptTaxId}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReceiptTaxId(e.target.value)} />
                        <div>
                          <label className="block text-sm font-bold mb-2 text-foreground/80">ที่อยู่สำหรับออกใบเสร็จ</label>
                          <textarea rows={3} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                            value={receiptAddress} onChange={(e) => setReceiptAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground outline-none resize-none text-sm transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold mb-2 text-foreground/80">หมายเหตุเพิ่มเติม</label>
                    <textarea rows={2} placeholder="ข้อมูลเพิ่มเติม (ไม่บังคับ)"
                      value={notes} onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-input/50 border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground outline-none resize-none text-sm transition-all" />
                  </div>

                  {/* Terms + Consent */}
                  <div className="pt-2 border-t border-border/40 space-y-4">
                    <div className="rounded-2xl p-4 space-y-2 text-xs" style={{ background: "oklch(0.24 0.04 262 / 0.8)", border: "1px solid oklch(0.38 0.04 262 / 0.5)", color: "oklch(0.78 0.02 260)" }}>
                      {[
                        "การจองสมบูรณ์เมื่อทีมงานได้รับและตรวจสอบสลิปมัดจำ 2,999 บาทแล้ว",
                        "คูปอง Gift Voucher 3,000 บาท จะถูกส่งทาง LINE หลังอนุมัติมัดจำ",
                        "กรุณานำ QR Code จาก LINE มาแสดงที่หน้างานสัมมนา",
                        "ทีมงานจะยืนยันสิทธิ์ภายใน 24 ชั่วโมงหลังได้รับสลิป",
                        "การยกเลิกหรือคืนเงินเป็นไปตามเงื่อนไขของผู้จัดงาน",
                        "ข้อมูลส่วนบุคคลใช้เพื่อการลงทะเบียนและยืนยันสิทธิ์เท่านั้น",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="shrink-0 w-4 h-4 rounded-full bg-gold/20 text-gold text-[9px] font-black grid place-items-center mt-0.5">{i + 1}</span>
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${consent ? "bg-gold/5 border-gold/30" : "bg-muted/30 border-border/30 hover:bg-muted/50"}`}>
                      <input type="checkbox" id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                        className="w-5 h-5 mt-0.5 shrink-0 rounded border-border bg-background accent-gold cursor-pointer" />
                      <label htmlFor="consent" className="text-sm text-foreground/90 leading-relaxed cursor-pointer select-none">
                        ข้าพเจ้ายืนยันว่าข้อมูลถูกต้อง ยอมรับเงื่อนไขการสมัคร และ{" "}
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPdpaOpen(true); }}
                          className="text-gold font-bold underline underline-offset-2 hover:text-gold/80 inline-flex items-center gap-1">
                          <Lock className="w-3 h-3" />นโยบาย PDPA
                        </button>
                        <span className="text-red-400 ml-1">*</span>
                      </label>
                    </div>
                    {errors.consent && <p className="text-xs text-red-400 flex items-center gap-1 -mt-2"><span className="w-1 h-1 rounded-full bg-red-400" />{errors.consent}</p>}
                  </div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                {step > 1 && (
                  <button type="button" onClick={() => { setStep((s) => (s - 1) as 1 | 2 | 3); setErrors({}); }}
                    className="px-5 py-3 rounded-xl border border-border/60 bg-input/40 font-semibold text-sm hover:border-border transition">
                    ← ย้อนกลับ
                  </button>
                )}
                {step < 3 && (
                  <button type="button" onClick={handleNext}
                    className="ml-auto btn-gradient flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-glow">
                    ถัดไป <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {step === 3 && (
                  <button type="submit" disabled={submitting}
                    className="ml-auto btn-gradient flex items-center gap-2 px-6 py-4 rounded-xl text-base font-bold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? (
                      <><span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />กำลังดำเนินการ...</>
                    ) : (
                      <>ยืนยันการจองมัดจำ 2,999.- <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                )}
              </div>

            </form>
          </RevealSection>
        </div>
      </section>

      {/* ── SPONSORS & PARTNERS ───────────────────────────── */}
      <section className="py-16 relative overflow-hidden bg-secondary/20 border-t border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <RevealSection>
            <p className="text-gold font-bold text-xs uppercase tracking-[0.2em] mb-2">
              Partners & Sponsors
            </p>
            <h2 className="text-2xl font-black mb-10">
              ผู้ร่วมจัดงานและผู้สนับสนุน
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-center max-w-4xl mx-auto">
              {/* Organized by */}
              <div className="glass-card rounded-2xl p-6 border-white/5 bg-white/[0.02] flex flex-col items-center justify-center min-h-[160px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">จัดโดย</p>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-black bg-gold-gradient bg-clip-text text-transparent">สะออนทัวร์ (SA-ON Tour)</span>
                  <span className="text-[10px] text-muted-foreground">เวิร์กช็อปความรู้คู่ความสนุกเพื่อชุมชนและผู้ประกอบการ</span>
                </div>
              </div>

              {/* Co-organized by (Logo Smart Expo) */}
              <div className="glass-card rounded-2xl p-6 border-white/5 bg-white/[0.02] flex flex-col items-center justify-center min-h-[160px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">ร่วมจัดโดย</p>
                <img
                  src="/logo-smart-expo.png"
                  alt="Smart Business Expo 2026"
                  className="h-12 object-contain opacity-95 hover:opacity-100 transition-opacity duration-300"
                />
                <span className="text-[10px] text-muted-foreground mt-2">Smart Business Expo 2026</span>
              </div>

              {/* Supported by (Logo NESBIA) */}
              <div className="glass-card rounded-2xl p-6 border-white/5 bg-white/[0.02] flex flex-col items-center justify-center min-h-[160px]">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">สนับสนุนกิจกรรมโดย</p>
                <img
                  src="/logo-nesbia.png"
                  alt="NESBIA"
                  className="h-14 object-contain rounded-lg border border-white/10 shadow-md opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
                <span className="text-[10px] text-muted-foreground mt-2 font-bold text-center leading-tight">
                  สมาคมการค้าซอฟต์แวร์<br />และธุรกิจนวัตกรรมภาคตะวันออกเฉียงเหนือ
                </span>
              </div>
            </div>
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
              href="https://www.facebook.com/share/1CYyEYkj81/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-gold transition-colors inline-flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.08] px-4 py-2 rounded-full border border-white/5"
            >
              🌐 ติดตามเพจ Facebook สะออนทัวร์
            </a>
          </div>
          <p className="text-xs text-slate-300">
            © 2026 สะออนทัวร์ – Workshop Agent ไทบ้าน ขอนแก่น
          </p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              onClick={() => setPdpaOpen(true)}
              className="text-[10px] text-muted-foreground/60 hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <Lock className="w-2.5 h-2.5" />
              นโยบายความเป็นส่วนตัว (PDPA)
            </button>
            <span className="text-slate-600">|</span>
            <a
              href="#how-agent"
              className="text-[10px] text-slate-400 hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <Brain className="w-2.5 h-2.5" />
              Agent ทำงานอย่างไร?
            </a>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            สงวนสิทธิ์ | ข้อมูลการติดต่อตามแบบฟอร์ม
          </p>
        </div>
      </footer>

      {/* ── PDPA CONSENT MODAL ──────────────────────────── */}
      {pdpaOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPdpaOpen(false)}
        >
          <div
            className="glass-card rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-gold/20 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gold-gradient p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground grid place-items-center">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-black text-primary-foreground tracking-tight">
                    นโยบายความเป็นส่วนตัว (PDPA)
                  </h3>
                  <p className="text-[10px] text-primary-foreground/70">
                    พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPdpaOpen(false)}
                className="text-primary-foreground/70 hover:text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 w-9 h-9 rounded-xl grid place-items-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6" style={{ color: "oklch(0.93 0.01 260)" }}>
              {/* Summary Banner */}
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "oklch(0.82 0.15 85 / 0.12)", border: "1px solid oklch(0.82 0.15 85 / 0.3)" }}>
                <Eye className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed font-medium">
                  เราให้ความสำคัญกับข้อมูลส่วนบุคคลของคุณ
                  ข้อมูลที่คุณกรอกในแบบฟอร์มนี้จะถูกเก็บรักษาอย่างปลอดภัยตาม พ.ร.บ.
                  คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
                </p>
              </div>

              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gold/20 grid place-items-center">
                    <FileText className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <h4 className="text-sm font-extrabold" style={{ color: "oklch(0.96 0.01 260)" }}>1. ข้อมูลที่เราเก็บรวบรวม</h4>
                </div>
                <ul className="space-y-2 text-sm leading-relaxed pl-4" style={{ color: "oklch(0.82 0.02 260)" }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-1" />
                    <span>ชื่อ-นามสกุล, เบอร์โทรศัพท์, LINE ID, อีเมล</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-1" />
                    <span>จังหวัด, อำเภอ, อาชีพ, ชื่อธุรกิจ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-1" />
                    <span>หัวข้อที่สนใจเรียนและข้อมูล LINE OA</span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 grid place-items-center">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <h4 className="text-sm font-extrabold" style={{ color: "oklch(0.96 0.01 260)" }}>2. วัตถุประสงค์ในการใช้ข้อมูล</h4>
                </div>
                <ul className="space-y-2 text-sm leading-relaxed pl-4" style={{ color: "oklch(0.82 0.02 260)" }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                    <span>เพื่อยืนยันการลงทะเบียนและติดต่อกลับท่าน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                    <span>เพื่อจัดเตรียมเนื้อหา Workshop ให้เหมาะสมกับผู้เข้าร่วม</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                    <span>เพื่อส่งข้อมูลรายละเอียดงาน ใบตอบรับ และรหัสยืนยัน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                    <span>เพื่อแจ้งข่าวสารกิจกรรมในอนาคต (ท่านสามารถยกเลิกได้ตลอดเวลา)</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: "#06C75520" }}>
                    <Lock className="w-3.5 h-3.5" style={{ color: "#06C755" }} />
                  </div>
                  <h4 className="text-sm font-extrabold" style={{ color: "oklch(0.96 0.01 260)" }}>3. การรักษาความปลอดภัย</h4>
                </div>
                <p className="text-sm leading-relaxed pl-4" style={{ color: "oklch(0.82 0.02 260)" }}>
                  ข้อมูลของท่านจะถูกจัดเก็บอย่างปลอดภัยในระบบที่มีการเข้ารหัส
                  และจะไม่ถูกเปิดเผยต่อบุคคลภายนอกโดยไม่ได้รับอนุญาต
                  เว้นแต่จะเป็นไปตามที่กฎหมายกำหนด
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: "#EE1D5220" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "#EE1D52" }} />
                  </div>
                  <h4 className="text-sm font-extrabold" style={{ color: "oklch(0.96 0.01 260)" }}>4. สิทธิของเจ้าของข้อมูล</h4>
                </div>
                <ul className="space-y-2 text-sm leading-relaxed pl-4" style={{ color: "oklch(0.82 0.02 260)" }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: "#EE1D52" }} />
                    <span>สิทธิในการเข้าถึง แก้ไข ลบข้อมูลส่วนบุคคลของท่าน</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: "#EE1D52" }} />
                    <span>สิทธิในการระงับ หรือคัดค้านการประมวลผลข้อมูล</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: "#EE1D52" }} />
                    <span>สิทธิในการเพิกถอนความยินยอมได้ตลอดเวลา</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: "#EE1D52" }} />
                    <span>สิทธิในการร้องเรียนต่อหน่วยงานที่กำกับดูแล</span>
                  </li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gold/20 grid place-items-center">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <h4 className="text-sm font-extrabold" style={{ color: "oklch(0.96 0.01 260)" }}>5. ช่องทางติดต่อ</h4>
                </div>
                <p className="text-sm leading-relaxed pl-4" style={{ color: "oklch(0.82 0.02 260)" }}>
                  หากมีข้อสงสัยหรือต้องการใช้สิทธิตามกฎหมาย PDPA สามารถติดต่อเราผ่านทาง{" "}
                  <a
                    href="https://www.facebook.com/share/1CYyEYkj81/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold font-bold underline underline-offset-2 hover:text-gold/80 transition-colors"
                  >
                    Facebook Page สะออนทัวร์
                  </a>
                </p>
              </div>

              {/* Period */}
              <div className="rounded-2xl p-4" style={{ background: "oklch(0.26 0.04 262 / 0.8)", border: "1px solid oklch(0.4 0.03 262 / 0.5)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.78 0.02 260)" }}>
                  <span className="font-bold" style={{ color: "oklch(0.96 0.01 260)" }}>ระยะเวลาการเก็บข้อมูล:</span>{" "}
                  ข้อมูลจะถูกเก็บรักษาไว้ตลอดระยะเวลาที่จำเป็นเพื่อบรรลุวัตถุประสงค์ข้างต้น
                  หรือตามที่กฎหมายกำหนด เมื่อพ้นกำหนดแล้วจะดำเนินการลบหรือทำให้ไม่สามารถระบุตัวตนได้
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border/30 bg-card/80 backdrop-blur-md shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setConsent(true);
                  setPdpaOpen(false);
                  speak("ยอมรับนโยบาย PDPA เรียบร้อยแล้วครับ");
                }}
                className="btn-gradient flex-1 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                ยอมรับนโยบายและยินยอม
              </button>
              <button
                onClick={() => setPdpaOpen(false)}
                className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition-colors"
                style={{ borderColor: "oklch(0.5 0.03 262 / 0.6)", background: "oklch(0.26 0.04 262 / 0.6)", color: "oklch(0.88 0.02 260)" }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ACCESSIBILITY FLOATING PANEL ────────────────── */}
      <div className="fixed left-3 bottom-3 z-50 flex flex-col gap-2.5 items-start sm:left-6 sm:bottom-6 sm:gap-3.5">
        {/* Toggle Panel Button */}
        <div className="relative group">
          <button
            onClick={() => {
              const openState = !accOpen;
              setAccOpen(openState);
              speak(openState ? "เปิดแถบตัวช่วยสำหรับผู้สูงอายุแล้วค่ะ" : "ปิดแถบตัวช่วยแล้วค่ะ");
            }}
            className={`w-11 h-11 rounded-full shadow-2xl flex items-center justify-center border transition-all duration-300 sm:h-14 sm:w-14 ${
              accOpen
                ? "bg-gold border-gold text-primary-foreground rotate-90"
                : "bg-card hover:bg-muted border-primary/20 text-gold shadow-glow animate-pulse-soft"
            }`}
            title="เครื่องมือช่วยเหลือผู้สูงอายุ (Accessibility Tools)"
          >
            <Wrench className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          {!accOpen && (
            <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gold text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              👵 ตัวช่วยสำหรับผู้สูงอายุ / ขยายตัวหนังสือ
            </span>
          )}
        </div>

        {/* Panel Options */}
        {accOpen && (
          <div className="glass-card rounded-3xl p-4 flex flex-col gap-4 shadow-2xl border-primary/30 w-56 animate-fade-up">
            <p className="text-sm font-black text-gold border-b border-border/40 pb-2 text-center">
              👵 ตัวช่วยผู้สูงอายุ
            </p>

            {/* Font Scaling */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground">ขนาดตัวหนังสือ</p>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { scale: 0.9, label: "A-" },
                  { scale: 1.0, label: "A" },
                  { scale: 1.25, label: "A+" },
                  { scale: 1.5, label: "A++" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setFontScale(item.scale);
                      speak(
                        `ปรับขนาดตัวอักษรเป็นระดับ ${item.label === "A" ? "ปกติ" : item.label === "A-" ? "เล็ก" : item.label === "A+" ? "ใหญ่" : "ใหญ่พิเศษ"}`,
                      );
                    }}
                    className={`py-1.5 rounded-lg text-xs font-extrabold border transition-all ${
                      fontScale === item.scale
                        ? "bg-gold border-gold text-primary-foreground"
                        : "bg-input/50 border-border/40 hover:border-border text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between border-t border-border/30 pt-3">
              <span className="text-xs font-bold text-muted-foreground">โหมดเน้นความชัด</span>
              <button
                onClick={() => {
                  const val = !highContrast;
                  setHighContrast(val);
                  speak(val ? "เปิดโหมดความคมชัดสูงแล้วค่ะ" : "ปิดโหมดความคมชัดสูงแล้วค่ะ");
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  highContrast
                    ? "bg-gold border-gold text-primary-foreground"
                    : "bg-input/50 border-border/40 text-foreground"
                }`}
              >
                {highContrast ? "เปิด" : "ปิด"}
              </button>
            </div>

            {/* Global Voice Read-aloud */}
            <div className="flex items-center justify-between border-t border-border/30 pt-3">
              <span className="text-xs font-bold text-muted-foreground">ปุ่มกดอ่านข้อความ</span>
              <button
                onClick={() => {
                  const val = !ttsEnabled;
                  setTtsEnabled(val);
                  speak(
                    val
                      ? "เปิดระบบอ่านออกเสียงแล้วค่ะ คุณสามารถกดปุ่มลำโพงถัดจากข้อความเพื่อรับฟังได้ค่ะ"
                      : "ปิดระบบอ่านออกเสียงแล้วค่ะ",
                  );
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  ttsEnabled
                    ? "bg-gold border-gold text-primary-foreground"
                    : "bg-input/50 border-border/40 text-foreground"
                }`}
              >
                {ttsEnabled ? "เปิด" : "ปิด"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── HERMES AGENT FLOATING CHATBOT ────────────────── */}
      <div className="fixed right-3 bottom-3 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
        {/* Chat Drawer */}
        {chatOpen && (
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border-primary/20 w-[calc(100vw-1.5rem)] sm:w-96 h-[min(520px,calc(100vh-7rem))] flex flex-col mb-3 sm:mb-4 animate-fade-up relative">
            {/* Header */}
            <div className="bg-gold-gradient p-4 flex items-center justify-between shadow-glow text-primary-foreground shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-foreground grid place-items-center text-primary relative">
                  <Bot className="w-6 h-6" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border border-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight leading-tight">
                    Hermes Agent ไทบ้าน
                  </p>
                  <p className="text-[10px] opacity-80">พร้อมช่วยลงทะเบียนและตอบคำถาม</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setChatOpen(false);
                  speak("ปิดผู้ช่วยเรียบร้อยครับ หากต้องการติดต่ออีกครั้งกดปุ่มหุ่นยนต์ได้เลยครับ");
                }}
                className="text-primary-foreground/70 hover:text-primary-foreground text-xs bg-primary-foreground/10 hover:bg-primary-foreground/20 px-2.5 py-1.5 rounded-xl font-bold transition-colors"
              >
                ปิด ✖
              </button>
            </div>

            {/* Message Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background/40">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gold-gradient text-primary-foreground font-semibold rounded-tr-sm shadow-md"
                        : "glass-card text-foreground rounded-tl-sm border border-border/40"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Option Buttons */}
                  {msg.sender === "bot" && msg.options && (
                    <div className="mt-2.5 w-full space-y-1.5 max-w-[85%]">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOptionClick(opt.value, opt.label)}
                          className="w-full text-left py-2.5 px-3.5 rounded-xl bg-primary/10 border border-primary/20 hover:border-gold hover:bg-gold/10 text-xs font-extrabold text-gold transition-all duration-200"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserTextSubmit(chatInput);
              }}
              className="p-3 border-t border-border/30 bg-card/80 backdrop-blur-md flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="พิมพ์ข้อความคุยกับบอท..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-input border border-border/60 text-xs focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-foreground transition"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-gold-gradient grid place-items-center shadow-glow font-bold text-primary-foreground text-xs shrink-0"
              >
                ส่ง
              </button>
            </form>
          </div>
        )}

        {/* Chat Toggle Button */}
        <div className="relative group">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`h-12 w-12 rounded-full shadow-2xl flex items-center justify-center bg-gold-gradient text-primary-foreground border-2 border-primary/30 transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16 ${
              chatOpen ? "rotate-12" : "animate-pulse"
            }`}
            title="ให้ Hermes Agent ช่วยลงทะเบียน"
          >
            <Bot className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          {!chatOpen && (
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gold-gradient text-primary-foreground text-xs font-black px-4 py-2 rounded-2xl whitespace-nowrap shadow-xl border border-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              ให้บอทช่วยลงทะเบียน / คุยกับบอท
            </div>
          )}
        </div>
      </div>

      {/* ── TERMINAL ANIMATION OVERLAY ──────────────────── */}
      {showTerminal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-green-500/30 animate-fade-up">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-green-500/20">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-zinc-400 font-mono">SA-ON Agent Deploy Terminal</span>
            </div>
            <div className="bg-zinc-950 p-5 min-h-[220px] font-mono text-sm space-y-1.5">
              {TERMINAL_LINES.slice(0, terminalVisibleCount).map((line, i) => (
                <div key={i} className={`animate-fade-up ${
                  i === 0 ? "text-yellow-400" :
                  line.includes("✓") ? "text-green-400" :
                  line.includes("🚀") ? "text-gold" :
                  "text-green-300"
                }`}>{line}</div>
              ))}
              {terminalVisibleCount < TERMINAL_LINES.length && (
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
