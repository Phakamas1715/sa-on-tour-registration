import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-regent.png";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logoImg} alt="Regent Holidays" className="h-12 object-contain mx-auto md:mx-0" />
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Regent Holidays Co., Ltd.
              <br />
              บริษัททัวร์คุณภาพ จัดทริปต่างประเทศ
              <br />
              ทั้งทริปส่วนตัว ครอบครัว และกรุ๊ปองค์กร
            </p>
            <div className="flex items-start gap-2 text-xs text-muted-foreground justify-center md:justify-start">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                3/85 Prachanivej Prime Square 1, 7th FL., Tessabannimitnue Rd., Lardyao, Jatujak, Bangkok 10900
              </span>
            </div>
          </div>

          {/* Contact - Personal Trips */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">ทริปครอบครัว & ส่วนตัว</h3>
            <div className="space-y-3">
              <a
                href="tel:0616351491"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <Phone className="h-4 w-4" />
                061-635-1491 (คุณนิค)
              </a>
              <a
                href="https://line.me/R/ti/p/@ugm3067r"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <MessageCircle className="h-4 w-4" />
                แอดไลน์เพื่อปรึกษา
              </a>
            </div>

            <h3 className="font-heading font-semibold text-foreground pt-2">กรุ๊ปเหมา & องค์กร</h3>
            <div className="space-y-3">
              <a
                href="tel:0629692917"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <Phone className="h-4 w-4" />
                062-969-2917 (คุณศรี)
              </a>
              <a
                href="mailto:kraiwitch.pawadee@regentholiday.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors justify-center md:justify-start"
              >
                <Mail className="h-4 w-4" />
                kraiwitch.pawadee@regentholiday.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">ลิงก์ด่วน</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                หน้าแรก
              </Link>
              <Link to="/packages" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                แพ็คเกจทัวร์
              </Link>
              <Link to="/booking" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                จองทัวร์
              </Link>
              <a
                href="https://www.regentholiday.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                เกี่ยวกับเรา
              </a>
              <a
                href="https://www.regentholiday.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ติดต่อเรา
              </a>
            </div>
          </div>

          {/* Office Hours & FAQ */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">เวลาทำการ</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
              <Clock className="h-4 w-4" />
              จันทร์–ศุกร์ 09:00–18:00 น.
            </div>

            <h3 className="font-heading font-semibold text-foreground pt-2">คำถามที่พบบ่อย</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">จองล่วงหน้ากี่วัน?</strong>
                <br />
                แนะนำอย่างน้อย 30 วัน โดยเฉพาะช่วง High Season
              </p>
              <p>
                <strong className="text-foreground">ออกใบกำกับภาษีได้ไหม?</strong>
                <br />
                ออกใบกำกับภาษีเต็มรูปแบบได้ทั้งบุคคลและบริษัท
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Regent Holidays Co., Ltd. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">ใบอนุญาตนำเที่ยว TAT License</p>
        </div>
      </div>
    </footer>
  );
}
