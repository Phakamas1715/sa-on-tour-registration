import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import {
  Check, X, MapPin, Clock, Camera, Utensils,
  Plane, Hotel, Sun, Moon, ArrowRight, Train,
} from "lucide-react";
import shanghaiImg from "@/assets/destination-shanghai.jpg";

const itinerary = [
  {
    day: 1,
    title: "กรุงเทพฯ – เซี่ยงไฮ้ + หาดไว่ทาน",
    activities: [
      { time: "07:00", icon: Plane, label: "พร้อมกันที่สนามบินสุวรรณภูมิ เคาน์เตอร์ China Eastern (MU)" },
      { time: "10:45", icon: Plane, label: "ออกเดินทางสู่เซี่ยงไฮ้ เที่ยวบิน MU548" },
      { time: "16:00", icon: MapPin, label: "ถึงสนามบินผู่ตง เซี่ยงไฮ้ ผ่านพิธีตรวจคนเข้าเมือง" },
      { time: "18:00", icon: Utensils, label: "อาหารเย็น ณ ภัตตาคาร อาหารเซี่ยงไฮ้" },
      { time: "19:30", icon: Camera, label: "ชมวิวหาดไว่ทาน (The Bund) ยามค่ำ แสงสีตระการตา" },
      { time: "21:00", icon: Hotel, label: "Check-in โรงแรม Holiday Inn Express หรือเทียบเท่า 4 ดาว" },
    ],
  },
  {
    day: 2,
    title: "เดอะบันด์ + ถนนนานจิง + หอไข่มุก",
    activities: [
      { time: "07:00", icon: Sun, label: "อาหารเช้าที่โรงแรม (บุฟเฟ่ต์)" },
      { time: "09:00", icon: Camera, label: "เดอะบันด์ (The Bund) ชมอาคารสถาปัตยกรรมยุโรปริมแม่น้ำหวงผู่" },
      { time: "10:30", icon: MapPin, label: "ถนนนานจิง (Nanjing Road) ถนนช้อปปิ้งชื่อดัง" },
      { time: "12:00", icon: Utensils, label: "อาหารกลางวัน เสี่ยวหลงเปา (ซาลาเปาน้ำ)" },
      { time: "14:00", icon: Camera, label: "หอไข่มุก (Oriental Pearl Tower) ชมวิว 360° เมืองเซี่ยงไฮ้" },
      { time: "16:00", icon: MapPin, label: "ตลาดเฉิงหวังเมี่ยว (City God Temple) ชมบรรยากาศจีนโบราณ" },
      { time: "18:30", icon: Utensils, label: "อาหารเย็น ณ ภัตตาคาร" },
      { time: "20:00", icon: Moon, label: "กลับโรงแรม พักผ่อนตามอัธยาศัย" },
    ],
  },
  {
    day: 3,
    title: "เมืองโบราณจูเจียเจี่ยว + Shanghai Tower",
    activities: [
      { time: "07:00", icon: Sun, label: "อาหารเช้าที่โรงแรม" },
      { time: "08:30", icon: Train, label: "เดินทางสู่เมืองโบราณจูเจียเจี่ยว (Zhujiajiao Water Town)" },
      { time: "10:00", icon: Camera, label: "ล่องเรือชมเมืองโบราณริมน้ำ สะพานโบราณ 400 ปี" },
      { time: "11:30", icon: MapPin, label: "เดินชมตรอกซอย ร้านค้าโบราณ วัฒนธรรมท้องถิ่น" },
      { time: "12:30", icon: Utensils, label: "อาหารกลางวัน อาหารท้องถิ่นจูเจียเจี่ยว" },
      { time: "14:30", icon: Train, label: "เดินทางกลับเซี่ยงไฮ้" },
      { time: "16:00", icon: Camera, label: "Shanghai Tower ตึกสูงอันดับ 2 ของโลก (632 เมตร)" },
      { time: "18:30", icon: Utensils, label: "อาหารเย็น ณ ภัตตาคาร อาหารกวางตุ้ง" },
      { time: "20:00", icon: Moon, label: "กลับโรงแรม พักผ่อน" },
    ],
  },
  {
    day: 4,
    title: "อิสระช้อปปิ้ง + เซี่ยงไฮ้ – กรุงเทพฯ",
    activities: [
      { time: "07:00", icon: Sun, label: "อาหารเช้าที่โรงแรม" },
      { time: "09:00", icon: MapPin, label: "อิสระช้อปปิ้ง หรือเที่ยวตามอัธยาศัย" },
      { time: "11:00", icon: Hotel, label: "Check-out จากโรงแรม" },
      { time: "12:00", icon: Utensils, label: "อาหารกลางวัน" },
      { time: "14:00", icon: Plane, label: "เดินทางสู่สนามบินผู่ตง" },
      { time: "17:15", icon: Plane, label: "ออกเดินทางกลับกรุงเทพฯ เที่ยวบิน MU547" },
      { time: "21:20", icon: MapPin, label: "ถึงสนามบินสุวรรณภูมิ โดยสวัสดิภาพ" },
    ],
  },
];

const included = [
  "ตั๋วเครื่องบิน ไป-กลับ China Eastern (MU) รวมน้ำหนักกระเป๋า 23 กก.",
  "ที่พัก 3 คืน โรงแรม 4 ดาว (พักห้องละ 2 ท่าน)",
  "อาหารตามรายการ (7 มื้อ)",
  "รถบัสปรับอากาศนำเที่ยวตลอดการเดินทาง",
  "ค่าเข้าชมสถานที่ตามรายการ",
  "หัวหน้าทัวร์ไทย + ไกด์ท้องถิ่น",
  "ประกันอุบัติเหตุ วงเงิน 1,000,000 บาท",
];
const excluded = [
  "ค่าทิปไกด์ท้องถิ่น + คนขับรถ (1,500 บาท/ท่าน ตลอดทริป)",
  "ค่าใช้จ่ายส่วนตัว เช่น ค่าโทรศัพท์ ค่าซักรีด",
  "ค่าวีซ่าจีน (กรณีไม่ได้รับยกเว้น)",
  "ค่าน้ำหนักกระเป๋าเกิน",
];

const steps = [
  { label: "เลือกแพ็คเกจ", done: true },
  { label: "ตรวจสอบรายละเอียด", active: true },
  { label: "ชำระเงิน", done: false },
];

export default function ItineraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading ${
                  s.done ? "bg-success text-success-foreground" : s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {s.done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`font-body text-sm ${s.active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
                {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Timeline */}
            <div className="flex-1 space-y-6">
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <img src={shanghaiImg} alt="เซี่ยงไฮ้" className="w-full h-48 md:h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className="mb-2">RHMU050926</Badge>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground">
                    เซี่ยงไฮ้ ไม่ลงร้าน 4 วัน 3 คืน
                  </h1>
                  <p className="font-body text-primary-foreground/80">สายการบิน China Eastern (MU) · ไม่ลงร้านช้อป</p>
                </div>
              </div>

              {itinerary.map((day) => (
                <div key={day.day} className="bg-card rounded-2xl border border-border p-6 shadow-card">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    <Badge className="mr-2">Day {day.day}</Badge>
                    {day.title}
                  </h3>
                  <div className="space-y-3 ml-2 border-l-2 border-primary/20 pl-6">
                    {day.activities.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                        <span className="font-body text-sm text-muted-foreground w-12 shrink-0">{act.time}</span>
                        <act.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="font-body text-foreground">{act.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Included / Excluded */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h4 className="font-heading font-semibold text-foreground mb-3">✅ รวมในแพ็คเกจ</h4>
                  <ul className="space-y-2">
                    {included.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-sm text-foreground">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h4 className="font-heading font-semibold text-foreground mb-3">❌ ไม่รวม</h4>
                  <ul className="space-y-2">
                    {excluded.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <aside className="lg:w-80 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card sticky top-24 space-y-5">
                <h3 className="font-heading text-lg font-bold text-foreground">สรุปการจอง</h3>

                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">แพ็คเกจ</span><span className="text-foreground font-medium">เซี่ยงไฮ้ 4D3N</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">รหัสทัวร์</span><span className="text-foreground">RHMU050926</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">สายการบิน</span><span className="text-foreground">China Eastern (MU)</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ระยะเวลา</span><span className="text-foreground">4 วัน 3 คืน</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ผู้เดินทาง</span><span className="text-foreground">2 คน</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">ที่พัก</span><span className="text-foreground">โรงแรม 4 ดาว</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">อาหาร</span><span className="text-foreground">7 มื้อ</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">พิเศษ</span><span className="text-foreground font-medium text-primary">ไม่ลงร้านช้อป</span></div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">ราคา/คน</span>
                    <span className="text-foreground">฿19,900</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-muted-foreground">2 คน</span>
                    <span className="text-foreground">฿39,800</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border">
                    <span className="text-foreground">รวมทั้งหมด</span>
                    <span className="text-primary">฿39,800</span>
                  </div>
                </div>

                <Button variant="success" size="lg" className="w-full text-lg py-6">
                  ยืนยันการจอง
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center font-body text-xs text-muted-foreground">
                  ไม่มีค่าใช้จ่ายจนกว่าจะยืนยัน · Powered by Regent Holiday
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
