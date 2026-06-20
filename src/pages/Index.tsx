import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Compass, ArrowRight, Star } from "lucide-react";
import heroImage from "@/assets/hero-travel.png";
import loginBg from "@/assets/login-bg.png";
import shanghaiImg from "@/assets/destination-shanghai.jpg";
import japanImg from "@/assets/destination-japan.jpg";
import koreaImg from "@/assets/destination-korea.jpg";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const features = [
  { icon: Sparkles, title: "ทัวร์คุณภาพ", desc: "โปรแกรมทัวร์ต่างประเทศคัดสรรพิเศษ จัดโดยทีมงานมืออาชีพ ดูแลท่านในทุกขั้นตอน" },
  { icon: Shield, title: "ราคาคุ้มค่า", desc: "การันตีราคาที่ดีที่สุด คุ้มค่าเงิน พร้อมบริการอาหารและเครื่องดื่มครบวงจร" },
  { icon: Compass, title: "ปรับแต่งทริปได้", desc: "ออกแบบโปรแกรมท่องเที่ยวส่วนตัวตามใจคุณ ปรับแต่งได้ทุกรายละเอียดตามที่ต้องการ" },
];

const popularDestinations = [
  { name: "เซี่ยงไฮ้", country: "จีน", image: shanghaiImg, price: "จาก ฿19,900", rating: 4.9 },
  { name: "โตเกียว-โอซาก้า", country: "ญี่ปุ่น", image: japanImg, price: "จาก ฿29,900", rating: 4.8 },
  { name: "โซล-เกาหลี", country: "เกาหลีใต้", image: koreaImg, price: "จาก ฿22,900", rating: 4.7 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Ambient background with grid overlays */}
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-10 fixed" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden z-10">
        <div className="absolute inset-0">
          <img src={heroImage} alt="ท่องเที่ยวต่างประเทศ" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Floating Glowing Sphere in Hero */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse pointer-events-none -z-10" style={{ animationDuration: '8s' }} />

        <div className="container relative z-10 pt-24 px-4 mx-auto max-w-6xl">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary font-heading text-xs font-semibold border border-primary/25">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              Regent Holiday — ทัวร์ต่างประเทศระดับพรีเมียม
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-black leading-tight text-white">
              ค้นพบตัวตนใหม่<br />
              <span className="text-gradient-primary">ในทุกการเดินทาง</span>
            </h1>
            <p className="font-body text-sm md:text-base text-slate-300 max-w-lg leading-relaxed">
              เปิดประสบการณ์การท่องเที่ยวต่างประเทศแบบพรีเมียมคัดสรรพิเศษ ญี่ปุ่น เกาหลี จีน ยุโรป และอีกมากมาย ให้เราคอยอำนวยความสะดวกในทุกย่างก้าว
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/booking">
                <Button variant="hero" size="lg" className="text-sm px-8 py-6 shadow-lg shadow-primary/20 hover:shadow-primary/45 transition-all w-full sm:w-auto">
                  เริ่มวางแผนทริป
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/packages">
                <Button variant="outline" size="lg" className="text-sm px-8 py-6 border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto">
                  ดูแพ็คเกจทัวร์
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Workshop Promotion Banner */}
      <section className="py-16 relative z-10 border-t border-b border-white/5 bg-slate-950/80">
        {/* Ambient glow orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="container max-w-4xl px-4 mx-auto">
          <div className="relative border border-primary/20 bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden">
            {/* Corner tech accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] font-heading font-bold uppercase tracking-wider py-1 px-3.5 rounded-full animate-pulse">
                    🔥 รับจำนวนจำกัด
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-heading font-bold uppercase tracking-wider py-1 px-3.5 rounded-full">
                    ⚡ มัดจำเพียง 2,999 บาท
                  </Badge>
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-black text-white leading-tight">
                  Smart Business AI Workshop 2026<br />
                  <span className="text-gradient-primary">ปฏิบัติการสร้าง AI Agent สำหรับธุรกิจ</span>
                </h2>

                <p className="font-body text-slate-350 text-xs md:text-sm leading-relaxed">
                  หลักสูตรพิเศษเพื่อยกระดับธุรกิจท่องเที่ยวและบริการด้วยปัญญาประดิษฐ์ สร้างระบบตอบลูกค้าออโต้ ปิดการขาย บิวท์บอทประจำการ LINE OA ของคุณจริงใน 1 วัน!
                </p>

                <div className="space-y-2.5 font-body text-xs text-slate-300 bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <p>ผู้ลงทะเบียนจองสิทธิ์ ต้องชำระเงินมัดจำจำนวน <strong className="text-yellow-500 font-extrabold text-sm">2,999 บาท</strong> เพื่อยืนยันการจองที่นั่งสัมมนา (รับสิทธิ์ส่วนลดเวิร์กช็อปเรียนฟรี AI มูลค่า 3,000 บ.)</p>
                  </div>
                  <div className="flex items-start gap-2 border-t border-white/5 pt-2.5">
                    <span className="text-primary font-bold">2.</span>
                    <p><strong>เงื่อนไขสิทธิ์ส่วนลด:</strong> ก่อนเข้างานสัมมนา ผู้สมัครต้องแสดง/ยื่นคูปอง QR Code จากในระบบ LINE ต่อเจ้าหน้าที่เพื่อยืนยันสิทธิ์ลดในการเข้าห้องสัมมนา</p>
                  </div>
                  <div className="flex items-start gap-2 border-t border-white/5 pt-2.5">
                    <span className="text-primary font-bold">3.</span>
                    <p className="text-red-400 font-semibold">รับจำนวนจำกัดเฉพาะผู้ที่ทำรายการจองและโอนชำระเงินมัดจำล่วงหน้าตามลำดับคิวเท่านั้น</p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto text-center">
                <Link to="/register">
                  <Button variant="hero" size="lg" className="w-full md:w-auto text-sm px-8 py-7 shadow-lg shadow-primary/25 hover:shadow-primary/45 transition-all font-heading font-black tracking-wider flex items-center justify-center gap-2">
                    ลงทะเบียนจองสิทธิ์ AI
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-[10px] text-slate-500 font-body mt-2.5">
                  * ต้องดำเนินการยืนยันตัวตนผ่านบัญชี LINE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 relative z-10 border-t border-white/5">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute right-0 top-10 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }} />

        <div className="container max-w-6xl px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 shadow-2xl transition-all duration-500 border border-white/5 hover:border-primary/20"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors border border-primary/10">
                  <f.icon className="h-7 w-7 text-primary animate-float" style={{ animationDuration: `${3 + i}s` }} />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="font-body text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 relative z-10 border-t border-white/5 bg-slate-950/40">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Badge className="bg-accent/15 text-accent border-accent/25 py-1 px-4 text-[10px] font-heading font-bold uppercase rounded-full">
              Recommended Destinations
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white">
              ทัวร์ต่างประเทศยอดนิยม
            </h2>
            <p className="font-body text-slate-400 text-xs max-w-md mx-auto leading-relaxed">เลือกจุดหมายปลายทางยอดนิยม แล้วออกเดินทางไปพบความอัศจรรย์ใจกับแพ็คเกจคุณภาพสูง</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {popularDestinations.map((dest) => (
              <Link to="/booking" key={dest.name} className="group">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  </div>

                  <div className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-heading text-xl font-bold text-white group-hover:text-primary transition-colors">{dest.name}</h3>
                        <p className="font-body text-xs text-slate-400">{dest.country} · <span className="text-primary font-bold">{dest.price}</span></p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold font-heading">
                        <Star className="h-3.5 w-3.5 fill-current text-white" />
                        {dest.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10 border-t border-white/5 bg-slate-900/20 overflow-hidden text-center">
        {/* Neon glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-2xl px-4 mx-auto relative z-10 space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white">
            พร้อมเริ่มต้นการเดินทางครั้งใหม่?
          </h2>
          <p className="font-body text-sm md:text-base text-slate-300 leading-relaxed">
            ให้ Regent Holiday ดูแลทุกรายละเอียดทริปของคุณ — จองง่าย สะดวก ปลอดภัย ด้วยการดูแลจากมืออาชีพ
          </p>
          <Link to="/booking" className="inline-block">
            <Button variant="hero" size="lg" className="text-xs px-10 py-6 mt-4 shadow-xl shadow-primary/25 hover:shadow-primary/45 transition-all">
              เริ่มวางแผนเลย
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
