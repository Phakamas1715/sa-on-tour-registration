import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CalendarIcon, Minus, Plus, Users, Wallet, Building2, GraduationCap, Send, Loader2, UserRound, UsersRound, Phone, Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-international.png";

const destinations = [
  "เซี่ยงไฮ้ (จีน)", "ปักกิ่ง (จีน)", "กวางโจว (จีน)", "โตเกียว (ญี่ปุ่น)", "โอซาก้า (ญี่ปุ่น)",
  "โซล (เกาหลีใต้)", "ไทเป (ไต้หวัน)", "ฮานอย (เวียดนาม)", "สิงคโปร์",
  "ฮ่องกง", "ลอนดอน (อังกฤษ)", "ปารีส (ฝรั่งเศส)", "โรม (อิตาลี)",
];

const popularDestinations = [
  "เซี่ยงไฮ้ (จีน)", "โตเกียว (ญี่ปุ่น)", "โซล (เกาหลีใต้)", "ไทเป (ไต้หวัน)", "ฮานอย (เวียดนาม)", "สิงคโปร์",
];

const orgTypes = [
  { value: "government", label: "ราชการ", icon: Building2 },
  { value: "corporate", label: "เอกชน", icon: Building2 },
  { value: "education", label: "การศึกษา", icon: GraduationCap },
  { value: "association", label: "สมาคม/ชมรม", icon: Users },
  { value: "other", label: "อื่นๆ", icon: Users },
];

const studyTopicOptions = [
  "เทคโนโลยี", "การศึกษา", "สาธารณสุข", "เกษตรกรรม",
  "อุตสาหกรรม", "การท่องเที่ยว", "พลังงาน/สิ่งแวดล้อม", "การปกครอง",
];

const accommodationLevels = [
  { value: "ประหยัด (3 ดาว)", label: "3 ดาว", desc: "ประหยัด" },
  { value: "สแตนดาร์ด (4 ดาว)", label: "4 ดาว", desc: "สแตนดาร์ด" },
  { value: "พรีเมี่ยม (5 ดาว)", label: "5 ดาว", desc: "พรีเมี่ยม" },
];

const mealPrefs = [
  { value: "ทุกมื้อ", label: "ทุกมื้อ" },
  { value: "เช้า-เย็น", label: "เช้า-เย็น" },
  { value: "เช้าเท่านั้น", label: "เช้าอย่างเดียว" },
  { value: "ไม่แน่ใจ", label: "ไม่แน่ใจ" },
];

const specialRequestOptions = [
  "มีผู้สูงอายุร่วมคณะ",
  "ต้องการล่ามภาษา",
  "ต้องการรถวีลแชร์",
  "อาหารฮาลาล",
  "อาหารมังสวิรัติ",
  "ต้องการใบเสนอราคาด่วน",
];

const tripTypes = [
  { value: "group", label: "กรุ๊ปทัวร์", icon: UsersRound, desc: "จัดกรุ๊ปส่วนตัว" },
  { value: "solo", label: "ทริปเดี่ยว", icon: UserRound, desc: "เดินทางคนเดียว" },
  { value: "join", label: "จอยทริป", icon: Users, desc: "ร่วมกรุ๊ปที่เปิดรับ" },
];

const budgetPresets = [
  { value: 20000, label: "฿20,000" },
  { value: 30000, label: "฿30,000" },
  { value: 50000, label: "฿50,000" },
  { value: 80000, label: "฿80,000" },
];

const travelerPresets = [15, 20, 30, 40, 50];

export default function BookingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactLineId, setContactLineId] = useState("");

  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");

  const [tripType, setTripType] = useState("group");
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState(30);
  const [budget, setBudget] = useState([25000]);

  const [studyObjectives, setStudyObjectives] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [preferredVisits, setPreferredVisits] = useState("");

  const [accommodation, setAccommodation] = useState("");
  const [meal, setMeal] = useState("");
  const [selectedSpecialRequests, setSelectedSpecialRequests] = useState<string[]>([]);
  const [pdpaConsent, setPdpaConsent] = useState(false);

  const toggleTopic = (t: string) =>
    setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const toggleSpecialReq = (t: string) =>
    setSelectedSpecialRequests((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleSubmit = async () => {
    const finalDestination = destination === "__other__" ? customDestination : destination;
    const needsOrg = tripType === "group";
    if (!contactName || !contactPhone || !finalDestination) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, เบอร์โทร, ปลายทาง)");
      return;
    }
    if (needsOrg && !orgName) {
      toast.error("กรุณากรอกชื่อหน่วยงาน/องค์กร");
      return;
    }
    if (!pdpaConsent) {
      toast.error("กรุณายินยอมนโยบายความเป็นส่วนตัว (PDPA) ก่อนส่งข้อมูล");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail || null,
        contact_line_id: contactLineId || null,
        org_name: orgName || contactName,
        org_type: (orgType || "other") as any,
        destination: finalDestination,
        transport_preference: tripType,
        travel_date_start: startDate ? format(startDate, "yyyy-MM-dd") : null,
        travel_date_end: endDate ? format(endDate, "yyyy-MM-dd") : null,
        num_travelers: travelers,
        budget_per_person: budget[0],
        study_objectives: studyObjectives || null,
        study_topics: selectedTopics.length > 0 ? selectedTopics : null,
        preferred_visits: preferredVisits || null,
        accommodation_level: accommodation || null,
        meal_preference: meal || null,
        special_requests: selectedSpecialRequests.length > 0 ? selectedSpecialRequests.join(", ") : null,
      });

      if (error) throw error;

      // Send Discord notification (fire-and-forget)
      supabase.functions.invoke("notify-discord", {
        body: {
          contact_name: contactName,
          org_name: orgName || contactName,
          destination: finalDestination,
          num_travelers: travelers,
          budget_per_person: budget[0],
          contact_phone: contactPhone,
        },
      }).catch((err) => console.error("Discord notify failed:", err));

      toast.success("ส่งคำขอเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับภายใน 24 ชม.");
      navigate("/packages");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col lg:flex-row">
        {/* Left image panel */}
        <div className="hidden lg:block lg:w-2/5 relative min-h-screen">
          <div className="sticky top-0 h-screen">
            <img src={heroImage} alt="ทัวร์ต่างประเทศ" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-hero opacity-40" />
            <div className="absolute bottom-12 left-8 right-8 z-10">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-2">
                ขอใบเสนอราคาทัวร์
              </h2>
              <p className="font-body text-primary-foreground/80 text-lg">
                แค่เลือก-แตะ ไม่ต้องพิมพ์มาก
              </p>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 p-4 sm:p-6 md:p-12 lg:p-16 relative overflow-hidden bg-background">
          {/* Subtle glowing mesh blobs behind the form */}
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-1/4 left-10 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-xl mx-auto space-y-8 sm:space-y-10 relative z-10">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">ขอใบเสนอราคา</h1>
              <p className="font-body text-muted-foreground text-base">แค่เลือกตัวเลือก แล้วกรอกข้อมูลติดต่อ ทีมงานจัดให้ภายใน 24 ชม.</p>
            </div>

            {/* === Trip Type === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">✈️ ประเภททริป</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {tripTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTripType(t.value)}
                    className={cn(
                      "rounded-2xl border-2 p-3 sm:p-4 text-center transition-all active:scale-[0.97]",
                      tripType === t.value
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <t.icon className={cn("h-8 w-8 mx-auto mb-2", tripType === t.value ? "text-primary" : "text-muted-foreground")} />
                    <p className="font-heading text-sm sm:text-base font-semibold">{t.label}</p>
                    <p className="font-body text-[11px] sm:text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* === Destination === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">🌍 ปลายทาง</h3>
              <p className="font-body text-sm text-muted-foreground">แตะเลือกปลายทางที่ต้องการ</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {popularDestinations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { setDestination(d); setCustomDestination(""); }}
                    className={cn(
                      "rounded-xl border-2 px-3 py-4 sm:px-4 sm:py-5 text-center font-body text-sm sm:text-base font-medium transition-all active:scale-[0.97] min-h-[52px]",
                      destination === d
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDestination("__other__")}
                  className={cn(
                    "rounded-xl border-2 border-dashed px-3 py-4 sm:px-4 sm:py-5 text-center font-body text-sm sm:text-base font-medium transition-all active:scale-[0.97] min-h-[52px]",
                    destination === "__other__"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  อื่นๆ...
                </button>
              </div>

              {destination === "__other__" && (
                <Input
                  placeholder="พิมพ์ปลายทางที่ต้องการ"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  className="text-base h-12 rounded-xl"
                />
              )}

              {!popularDestinations.includes(destination) && destination !== "__other__" && destination && (
                <p className="font-body text-sm text-muted-foreground">หรือเลือกจากรายการเพิ่มเติม:</p>
              )}
              {destinations.filter(d => !popularDestinations.includes(d)).length > 0 && (
                <details className="group">
                  <summary className="font-body text-sm text-primary cursor-pointer hover:underline">ดูปลายทางทั้งหมด ({destinations.length} แห่ง)</summary>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {destinations.filter(d => !popularDestinations.includes(d)).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => { setDestination(d); setCustomDestination(""); }}
                        className={cn(
                          "rounded-xl border-2 px-3 py-3 text-center font-body text-sm transition-all active:scale-95",
                          destination === d
                            ? "border-primary bg-primary/10 text-primary shadow-md"
                            : "border-border text-foreground hover:border-primary/50"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </details>
              )}
            </div>

            {/* === Dates === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">📅 วันเดินทาง</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base">วันไป</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left h-12 rounded-xl text-base", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {startDate ? format(startDate, "d MMM yyyy", { locale: th }) : "เลือกวัน"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base">วันกลับ</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left h-12 rounded-xl text-base", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        {endDate ? format(endDate, "d MMM yyyy", { locale: th }) : "เลือกวัน"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* === Travelers (group) === */}
            {tripType === "group" && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">👥 จำนวนผู้เดินทาง</h3>
                <p className="font-body text-sm text-muted-foreground">แตะเลือกจำนวน หรือกด +/- ปรับเอง</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                  {travelerPresets.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTravelers(n)}
                      className={cn(
                        "rounded-xl border-2 px-3 py-4 font-heading text-base sm:text-lg font-bold transition-all active:scale-[0.97] min-h-[52px]",
                        travelers === n
                          ? "border-primary bg-primary/10 text-primary shadow-md"
                          : "border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {n} คน
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 bg-card rounded-2xl border border-border p-5">
                  <Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 5))} className="h-14 w-14 rounded-full text-lg shrink-0">
                    <Minus className="h-6 w-6" />
                  </Button>
                  <div className="text-center">
                    <span className="font-heading text-4xl font-bold text-foreground">{travelers}</span>
                    <p className="font-body text-sm text-muted-foreground">คน</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setTravelers(Math.min(200, travelers + 5))} className="h-14 w-14 rounded-full text-lg shrink-0">
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            )}

            {/* === Budget === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">
                <Wallet className="inline h-5 w-5 mr-1" /> งบประมาณต่อคน
              </h3>
              <p className="font-body text-sm text-muted-foreground">แตะเลือกงบ หรือเลื่อนปรับเอง</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {budgetPresets.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setBudget([b.value])}
                    className={cn(
                      "rounded-xl border-2 px-4 py-4 font-heading text-base font-bold transition-all active:scale-[0.97] min-h-[52px]",
                      budget[0] === b.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <Slider value={budget} onValueChange={setBudget} min={15000} max={100000} step={5000} className="py-2" />
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>฿15,000</span>
                <span className="text-primary font-heading font-bold text-xl">฿{budget[0].toLocaleString()}</span>
                <span>฿100,000</span>
              </div>
            </div>

            {/* === Organization (group only) === */}
            {tripType === "group" && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">🏢 ข้อมูลองค์กร</h3>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base">ชื่อหน่วยงาน *</Label>
                  <Input placeholder="ชื่อหน่วยงาน" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="text-base h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base">ประเภทองค์กร</Label>
                  <div className="flex flex-wrap gap-2">
                    {orgTypes.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setOrgType(o.value)}
                        className={cn(
                          "rounded-xl border-2 px-4 py-3 font-body text-base transition-all active:scale-95 flex items-center gap-2",
                          orgType === o.value
                            ? "border-primary bg-primary/10 text-primary shadow-md"
                            : "border-border text-foreground hover:border-primary/50"
                        )}
                      >
                        <o.icon className="h-4 w-4" />
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === Study Topics (group only) === */}
            {tripType === "group" && (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">📚 หัวข้อศึกษาดูงาน</h3>
                <p className="font-body text-sm text-muted-foreground">แตะเลือกได้หลายหัวข้อ</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  {studyTopicOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTopic(t)}
                      className={cn(
                        "rounded-xl border-2 px-3 py-4 font-body text-base text-center transition-all active:scale-[0.97] min-h-[52px]",
                        selectedTopics.includes(t)
                          ? "border-primary bg-primary/10 text-primary shadow-md"
                          : "border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* === Accommodation & Meal === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">🏨 ที่พักและอาหาร <span className="font-body text-xs text-muted-foreground font-normal">(ไม่บังคับ)</span></h3>
              
              <div className="space-y-2">
                <Label className="font-heading font-semibold text-base">ระดับที่พัก</Label>
                <div className="grid grid-cols-3 gap-3">
                  {accommodationLevels.map((h) => (
                    <button
                      key={h.value}
                      type="button"
                      onClick={() => setAccommodation(h.value)}
                      className={cn(
                        "rounded-xl border-2 p-4 text-center transition-all active:scale-95",
                        accommodation === h.value
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-heading text-lg font-bold text-foreground">{h.label}</p>
                      <p className="font-body text-xs text-muted-foreground">{h.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-heading font-semibold text-base">อาหาร</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {mealPrefs.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMeal(m.value)}
                      className={cn(
                        "rounded-xl border-2 px-4 py-3 font-body text-base text-center transition-all active:scale-95",
                        meal === m.value
                          ? "border-primary bg-primary/10 text-primary shadow-md"
                          : "border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* === Special Requests === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">💬 คำขอพิเศษ <span className="font-body text-xs text-muted-foreground font-normal">(ไม่บังคับ)</span></h3>
              <p className="font-body text-sm text-muted-foreground">แตะเลือกได้หลายข้อ</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {specialRequestOptions.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleSpecialReq(r)}
                    className={cn(
                      "rounded-xl border-2 px-4 py-4 font-body text-base text-left transition-all active:scale-[0.97] min-h-[52px] flex items-center gap-2",
                      selectedSpecialRequests.includes(r)
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    <span className="text-lg">{selectedSpecialRequests.includes(r) ? "✅" : "⬜"}</span>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* === Contact Info === */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground border-b border-border pb-2">📞 ข้อมูลผู้ติดต่อ</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base">ชื่อ-สกุล *</Label>
                  <Input placeholder="ชื่อผู้ประสานงาน" value={contactName} onChange={(e) => setContactName(e.target.value)} className="text-base h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base flex items-center gap-2">
                    <Phone className="h-4 w-4" /> เบอร์โทรศัพท์ *
                  </Label>
                  <Input placeholder="08x-xxx-xxxx" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="text-base h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" /> อีเมล <span className="text-muted-foreground text-xs font-normal">(ไม่บังคับ)</span>
                  </Label>
                  <Input type="email" placeholder="email@org.go.th" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="text-base h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-heading font-semibold text-base flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> LINE ID <span className="text-muted-foreground text-xs font-normal">(ไม่บังคับ)</span>
                  </Label>
                  <Input placeholder="@lineid" value={contactLineId} onChange={(e) => setContactLineId(e.target.value)} className="text-base h-12 rounded-xl" />
                </div>
              </div>
            </div>

            {/* PDPA Consent */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-muted/30">
              <Checkbox
                id="pdpa"
                checked={pdpaConsent}
                onCheckedChange={(checked) => setPdpaConsent(checked === true)}
                className="mt-1 h-6 w-6"
              />
              <label htmlFor="pdpa" className="font-body text-base text-muted-foreground leading-relaxed cursor-pointer">
                ข้าพเจ้ายินยอมให้เก็บข้อมูลส่วนบุคคลเพื่อจัดทำใบเสนอราคาและติดต่อประสานงาน
                ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) <span className="text-destructive">*</span>
              </label>
            </div>

            {/* Submit — sticky on mobile for easy access */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 pb-6 -mx-4 px-4 sm:static sm:mx-0 sm:px-0 sm:pt-0 sm:pb-0 sm:bg-transparent sm:backdrop-blur-none border-t border-border/50 sm:border-0 space-y-3 z-20">
              <Button variant="hero" size="lg" className="w-full text-xl py-7 rounded-2xl shadow-lg" onClick={handleSubmit} disabled={isSubmitting || !pdpaConsent}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Send className="mr-2 h-6 w-6" />
                )}
                {isSubmitting ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">หรือปรึกษาทีมงานโดยตรง</p>
                <a
                  href="https://line.me/R/ti/p/@ugm3067r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  แอดไลน์ @ugm3067r
                </a>
              </div>
            </div>

            <p className="text-center font-body text-sm text-muted-foreground pb-8">
              ทีมงาน Regent Holiday จะติดต่อกลับภายใน 24 ชั่วโมง ทางโทรศัพท์หรือ LINE
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
