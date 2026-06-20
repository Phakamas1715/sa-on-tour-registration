import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navbar } from "@/components/Navbar";
import {
  CalendarCheck, Download, MessageCircle, Edit, Eye,
  Plane, Hotel, Utensils, Users, Check, Clock,
  CreditCard, Heart, HelpCircle, Shield, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import phuketImg from "@/assets/destination-phuket.jpg";
import chiangmaiImg from "@/assets/destination-chiangmai.jpg";

const tabs = ["Upcoming (2)", "Past Trips (5)", "Wishlist (8)"];

const progressSteps = [
  { label: "Booked", done: true },
  { label: "Paid", done: true },
  { label: "Confirmed", active: true },
  { label: "Check-in", done: false },
];

const quickInfo = [
  { icon: Hotel, label: "ที่พัก", value: "Pool Villa 5★" },
  { icon: Plane, label: "เดินทาง", value: "เครื่องบิน" },
  { icon: Utensils, label: "อาหาร", value: "ทุกมื้อ" },
  { icon: Users, label: "ไกด์", value: "ไกด์ส่วนตัว" },
];

const payments = [
  { label: "ภูเก็ต — งวดที่ 2", amount: "฿12,500", due: "20 มี.ค. 2026", urgent: false },
  { label: "เชียงใหม่ — ยอดเต็ม", amount: "฿25,000", due: "5 เม.ย. 2026", urgent: true },
];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-primary-foreground font-heading font-bold text-lg">สช</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">สวัสดี, สมชาย!</h1>
                <p className="font-body text-muted-foreground">Gold Member • 2,450 points</p>
              </div>
            </div>
            <Link to="/booking">
              <Button variant="hero" size="sm">+ จองทริปใหม่</Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full font-body text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Booking Cards */}
            <div className="flex-1 space-y-6">
              {/* Expanded Card — Phuket */}
              <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-72 relative">
                    <img src={phuketImg} alt="ภูเก็ต" className="w-full h-48 md:h-full object-cover" />
                    <Badge className="absolute top-4 left-4 bg-success text-success-foreground">Confirmed</Badge>
                  </div>
                  <div className="flex-1 p-6 space-y-5">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground">Phuket Beach Paradise 4D3N</h3>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        22 - 25 มี.ค. 2026 • 2 ผู้เดินทาง • Ref: BK-20260322-001
                      </p>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {quickInfo.map((info) => (
                        <div key={info.label} className="bg-muted/50 rounded-lg p-3 text-center">
                          <info.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                          <p className="font-body text-xs text-muted-foreground">{info.label}</p>
                          <p className="font-body text-sm font-medium text-foreground">{info.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Link to="/itinerary">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Eye className="h-4 w-4" /> ดู Itinerary
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-4 w-4" /> Download Voucher
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <MessageCircle className="h-4 w-4" /> Contact Support
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Edit className="h-4 w-4" /> Modify Booking
                      </Button>
                    </div>

                    {/* Progress Timeline */}
                    <div className="flex items-center gap-2 pt-2">
                      {progressSteps.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.done ? "bg-success text-success-foreground" :
                            step.active ? "bg-primary text-primary-foreground" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {step.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <span className={`font-body text-xs ${step.active ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                          {i < progressSteps.length - 1 && <div className="w-6 h-px bg-border" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsed Card — Chiang Mai (Payment Pending) */}
              <div className="bg-background rounded-2xl border border-border shadow-card p-5">
                <div className="flex items-center gap-4">
                  <img src={chiangmaiImg} alt="เชียงใหม่" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-base font-bold text-foreground">เชียงใหม่ วัฒนธรรมล้านนา 4D3N</h3>
                        <p className="font-body text-sm text-muted-foreground">5 - 8 เม.ย. 2026 • 3 คน</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 shrink-0">Payment Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-heading text-lg font-bold text-primary">฿37,500</span>
                      <Button variant="hero" size="sm">ชำระเงิน</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="xl:w-80 shrink-0 space-y-6">
              {/* Upcoming Payments */}
              <div className="bg-background rounded-2xl border border-border p-5 shadow-card space-y-4">
                <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> การชำระเงิน
                </h3>
                {payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{p.label}</p>
                      <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> กำหนด {p.due}
                      </p>
                    </div>
                    <span className={`font-heading text-sm font-bold ${p.urgent ? "text-destructive" : "text-foreground"}`}>
                      {p.amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="bg-background rounded-2xl border border-border p-5 shadow-card space-y-3">
                <h3 className="font-heading text-sm font-semibold text-foreground">ลิงก์ด่วน</h3>
                {[
                  { icon: Shield, label: "ประกันการเดินทาง" },
                  { icon: CalendarCheck, label: "ตรวจสอบวีซ่า" },
                  { icon: HelpCircle, label: "คำถามที่พบบ่อย" },
                  { icon: Heart, label: "Wishlist" },
                ].map((link) => (
                  <button key={link.label} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
                    <span className="flex items-center gap-3 font-body text-sm text-foreground">
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              {/* Chat Widget */}
              <Button variant="hero" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                แชทกับเรา
              </Button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
