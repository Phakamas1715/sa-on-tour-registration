import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, ArrowLeft, Download } from "lucide-react";
import logoImg from "@/assets/logo-regent.png";
import type { Tables } from "@/integrations/supabase/types";

type Quotation = Tables<"quotations">;
type Lead = Tables<"leads">;
type TourProgram = Tables<"tour_programs">;

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
}

export default function QuotationPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [program, setProgram] = useState<TourProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: q } = await supabase.from("quotations").select("*").eq("id", id!).single();
    if (!q) { setLoading(false); return; }
    setQuotation(q);

    if (q.lead_id) {
      const { data: l } = await supabase.from("leads").select("*").eq("id", q.lead_id).single();
      setLead(l || null);
    }
    if (q.tour_program_id) {
      const { data: p } = await supabase.from("tour_programs").select("*").eq("id", q.tour_program_id).single();
      setProgram(p || null);
    }
    setLoading(false);
  };

  const handlePrint = () => window.print();

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatCurrency = (n: number) => `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!quotation) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">ไม่พบใบเสนอราคา</p>
          <Button variant="outline" onClick={() => navigate("/admin")} className="mt-4">กลับ</Button>
        </div>
      </AdminLayout>
    );
  }

  const itinerary: ItineraryDay[] = program?.itinerary
    ? (Array.isArray(program.itinerary) ? program.itinerary as unknown as ItineraryDay[] : [])
    : quotation.custom_itinerary
      ? (Array.isArray(quotation.custom_itinerary) ? quotation.custom_itinerary as unknown as ItineraryDay[] : [])
      : [];

  const tourName = program?.name || lead?.destination || "โปรแกรมทัวร์";
  const tourCode = program?.code || quotation.quotation_number;
  const days = program?.days || 0;
  const nights = program?.nights || 0;
  const airline = program?.airline || "-";
  const highlights = program?.highlights || [];
  const included = program?.included || [
    "ตั๋วเครื่องบินไป-กลับ ชั้นประหยัด",
    "ที่พักโรงแรมตามรายการ",
    "อาหารตามรายการ",
    "รถรับ-ส่งตลอดรายการ",
    "ค่าธรรมเนียมเข้าชมสถานที่ตามรายการ",
    "มัคคุเทศก์ดูแลตลอดการเดินทาง",
    "ประกันภัยการเดินทาง",
  ];
  const excluded = program?.excluded || [
    "ค่าทำหนังสือเดินทาง (Passport)",
    "ค่าใช้จ่ายส่วนตัว เช่น ค่าโทรศัพท์, ค่าซักรีด",
    "ค่าอาหารและเครื่องดื่มที่สั่งเพิ่มนอกเหนือรายการ",
    "ค่าทิปมัคคุเทศก์และคนขับรถ",
    "ภาษีมูลค่าเพิ่ม 7% และภาษีหัก ณ ที่จ่าย 3%",
  ];

  return (
    <AdminLayout>
      {/* Action bar — hidden in print */}
      <div className="p-4 md:p-6 flex items-center gap-3 print:hidden border-b border-border bg-muted/30">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> กลับ
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> พิมพ์ / PDF
        </Button>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="max-w-4xl mx-auto bg-white p-6 md:p-10 print:p-8 print:max-w-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-primary pb-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={logoImg} alt="Regent Holidays" className="h-14 object-contain" />
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Regent Holidays Co., Ltd.</h2>
              <p className="font-body text-xs text-muted-foreground">
                3/85 Prachanivej Prime Square 1, 7th FL., Bangkok 10900
              </p>
              <p className="font-body text-xs text-muted-foreground">
                Tel: 061-635-1491, 062-969-2917 | www.regentholiday.com
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-primary/10 text-primary font-heading font-bold text-sm px-3 py-1 rounded-lg">
              {quotation.quotation_number}
            </span>
            <p className="font-body text-xs text-muted-foreground mt-1">
              วันที่: {formatDate(quotation.created_at)}
            </p>
            <p className="font-body text-xs text-muted-foreground">
              หมดอายุ: {formatDate(quotation.valid_until)}
            </p>
          </div>
        </div>

        {/* Tour Title */}
        <div className="bg-secondary text-secondary-foreground rounded-xl p-5 mb-6 text-center">
          <p className="font-body text-sm opacity-80 mb-1">รหัสทัวร์: {tourCode}</p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">{tourName}</h1>
          {days > 0 && (
            <p className="font-body text-sm mt-1 opacity-90">
              {days} วัน {nights} คืน {airline !== "-" ? `| สายการบิน ${airline}` : ""}
            </p>
          )}
        </div>

        {/* Customer info */}
        {lead && (
          <div className="grid grid-cols-2 gap-4 mb-6 bg-muted/30 rounded-xl p-4">
            <div>
              <p className="font-body text-xs text-muted-foreground">ลูกค้า / องค์กร</p>
              <p className="font-heading font-semibold text-foreground">{lead.org_name}</p>
              <p className="font-body text-sm text-muted-foreground">{lead.contact_name} | {lead.contact_phone}</p>
              {lead.contact_email && <p className="font-body text-sm text-muted-foreground">{lead.contact_email}</p>}
            </div>
            <div className="text-right">
              <p className="font-body text-xs text-muted-foreground">ปลายทาง</p>
              <p className="font-heading font-semibold text-foreground">{lead.destination}</p>
              {lead.travel_date_start && (
                <p className="font-body text-sm text-muted-foreground">
                  {formatDate(lead.travel_date_start)} — {formatDate(lead.travel_date_end)}
                </p>
              )}
              <p className="font-body text-sm text-muted-foreground">{lead.num_travelers} ท่าน</p>
            </div>
          </div>
        )}

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="font-heading font-bold text-foreground mb-2 flex items-center gap-2">
              ⭐ ไฮไลท์โปรแกรม
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <span className="text-primary font-bold">✓</span> {h}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-day Itinerary */}
        {itinerary.length > 0 && (
          <div className="mb-6">
            <h3 className="font-heading font-bold text-foreground mb-3 text-lg">📅 โปรแกรมการเดินทาง</h3>
            <div className="space-y-4">
              {itinerary.map((day, i) => (
                <div key={i} className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-heading font-bold text-foreground">
                    วันที่ {day.day || i + 1}: {day.title}
                  </h4>
                  <p className="font-body text-sm text-foreground mt-1 whitespace-pre-line">{day.description}</p>
                  {day.meals && (
                    <p className="font-body text-xs text-muted-foreground mt-1">🍽️ {day.meals}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Table */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-foreground mb-3 text-lg">💰 ตารางราคา</h3>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="bg-secondary text-secondary-foreground">
                  <th className="text-left p-3 font-heading">รายการ</th>
                  <th className="text-right p-3 font-heading">จำนวน</th>
                  <th className="text-right p-3 font-heading">ราคา/คน</th>
                  <th className="text-right p-3 font-heading">รวม</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="p-3">{tourName}</td>
                  <td className="p-3 text-right">{quotation.num_travelers} ท่าน</td>
                  <td className="p-3 text-right">{formatCurrency(Number(quotation.price_per_person))}</td>
                  <td className="p-3 text-right">{formatCurrency(Number(quotation.total_amount))}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-primary/5 border-t-2 border-primary">
                  <td colSpan={3} className="p-3 font-heading font-bold text-right">ยอดรวมทั้งสิ้น</td>
                  <td className="p-3 text-right font-heading font-bold text-primary text-lg">
                    {formatCurrency(Number(quotation.total_amount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Included / Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-heading font-bold text-foreground mb-2">✅ ค่าบริการรวม</h3>
            <ul className="space-y-1">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <span className="text-green-600 shrink-0">●</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground mb-2">❌ ค่าบริการไม่รวม</h3>
            <ul className="space-y-1">
              {excluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-foreground">
                  <span className="text-destructive shrink-0">●</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notes */}
        {quotation.notes && (
          <div className="mb-6 bg-muted/30 rounded-xl p-4">
            <h3 className="font-heading font-bold text-foreground mb-1">📝 หมายเหตุ</h3>
            <p className="font-body text-sm text-foreground whitespace-pre-line">{quotation.notes}</p>
          </div>
        )}

        {/* Terms */}
        <div className="mb-6 border border-border rounded-xl p-4">
          <h3 className="font-heading font-bold text-foreground mb-2">📋 เงื่อนไขการจอง</h3>
          <ul className="space-y-1 font-body text-xs text-muted-foreground">
            <li>• มัดจำ 50% ของราคาทัวร์ทั้งหมด ภายใน 3 วันหลังยืนยันการจอง</li>
            <li>• ชำระส่วนที่เหลืออีก 50% ก่อนเดินทาง 14 วัน</li>
            <li>• กรณียกเลิกก่อนเดินทาง 30 วัน คืนเงินมัดจำ 100%</li>
            <li>• กรณียกเลิกก่อนเดินทาง 15-29 วัน หักค่าใช้จ่ายจริงที่เกิดขึ้น</li>
            <li>• กรณียกเลิกก่อนเดินทางน้อยกว่า 15 วัน ไม่สามารถคืนเงินได้</li>
            <li>• ราคาอาจมีการเปลี่ยนแปลงตามอัตราแลกเปลี่ยนและค่าน้ำมัน</li>
            <li>• บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงรายการตามความเหมาะสม โดยคำนึงถึงประโยชน์ของลูกค้าเป็นหลัก</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-primary pt-4 text-center">
          <p className="font-heading font-bold text-foreground text-sm">Regent Holidays Co., Ltd.</p>
          <p className="font-body text-xs text-muted-foreground">
            ใบอนุญาตนำเที่ยว TAT License | www.regentholiday.com
          </p>
          <p className="font-body text-xs text-muted-foreground">
            ติดต่อ: 061-635-1491 (คุณนิค) | 062-969-2917 (คุณศรี) | LINE: @ugm3067r
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
