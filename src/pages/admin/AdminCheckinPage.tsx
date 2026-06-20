import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Search, User, CheckCircle2, AlertTriangle, CreditCard, Clock, MessageSquare, ShieldAlert, Check, X } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

type Registration = {
  id: string;
  registration_code: string | null;
  line_user_id: string;
  line_display_name: string | null;
  line_picture_url: string | null;
  full_name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  occupation: string | null;
  business_name: string | null;
  interest_topic: string[] | null;
  has_line_oa: string | null;
  status: string;
  created_at: string;
};

type Coupon = {
  id: string;
  coupon_code: string;
  coupon_token: string;
  coupon_name: string;
  coupon_value: number;
  final_price: number;
  status: string;
};

export default function AdminCheckinPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(true);

  // Scanned record states
  const [record, setRecord] = useState<Registration | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [checkinTime, setCheckinTime] = useState<string | null>(null);

  // Payment update states
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [adminNote, setAdminNote] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Read URL params if accessed directly from a QR link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const token = params.get("token");
    if (code && token) {
      loadData(code, token);
      setShowScanner(false);
    }
  }, []);

  // Initialize QR Scanner
  useEffect(() => {
    if (showScanner) {
      const qrScanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true
      }, false);

      qrScanner.render(
        (decodedText) => {
          try {
            // QR payload can be a URL containing code and token
            const url = new URL(decodedText);
            const code = url.searchParams.get("code");
            const token = url.searchParams.get("token");
            if (code && token) {
              loadData(code, token);
              setShowScanner(false);
              qrScanner.clear().catch(err => console.error("Error clearing scanner", err));
            } else {
              toast.error("รูปแบบ QR Code ไม่ถูกต้อง");
            }
          } catch {
            // Plain text lookup if not a URL
            toast.error("รูปแบบลิงก์ QR ไม่ถูกต้อง");
          }
        },
        () => {
          // Keep scanning silently
        }
      );

      scannerRef.current = qrScanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Error clearing scanner on unmount", err));
      }
    };
  }, [showScanner]);

  const loadData = async (code: string, token: string) => {
    setLoading(true);
    setRecord(null);
    setCoupon(null);
    setIsCheckedIn(false);
    setIsPaid(false);
    setCheckinTime(null);

    try {
      // 1. Load registration
      const { data: reg, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("registration_code", code.trim().toUpperCase())
        .maybeSingle();

      if (regError) throw regError;
      if (!reg) {
        toast.error("ไม่พบข้อมูลรหัสลงทะเบียนนี้");
        setLoading(false);
        return;
      }

      // 2. Load coupon & check token validity
      const { data: cpn, error: cpnError } = await supabase
        .from("coupons")
        .select("*")
        .eq("registration_id", reg.id)
        .maybeSingle();

      if (cpnError) throw cpnError;
      if (!cpn) {
        toast.error("คูปองไม่สมบูรณ์");
        setLoading(false);
        return;
      }

      if (cpn.coupon_token !== token) {
        toast.error("โทเค็นคูปองไม่ตรงกัน! บัตรนี้อาจถูกดัดแปลง");
      }

      // 3. Load check-in status
      const { data: checkins } = await supabase
        .from("checkins")
        .select("*")
        .eq("registration_id", reg.id)
        .maybeSingle();

      // 4. Load payment status
      const { data: payments } = await supabase
        .from("payments")
        .select("*")
        .eq("registration_id", reg.id)
        .maybeSingle();

      setRecord(reg);
      setCoupon(cpn);
      setIsCheckedIn(!!checkins);
      if (checkins) {
        setCheckinTime(new Date(checkins.checked_in_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }));
      }
      setIsPaid(payments?.payment_status === "paid");
      if (payments?.admin_note) {
        setAdminNote(payments.admin_note);
      }
      toast.success("ดึงข้อมูลผู้ลงทะเบียนสำเร็จ");
    } catch (err: any) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async () => {
    if (!searchQuery) {
      toast.error("กรุณากรอกรหัสลงทะเบียน");
      return;
    }

    // Manual search looks up by code; we bypass token match for manual lookups but warn
    setLoading(true);
    try {
      const { data: reg, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .eq("registration_code", searchQuery.trim().toUpperCase())
        .maybeSingle();

      if (regError) throw regError;
      if (!reg) {
        toast.error("ไม่พบรหัสลงทะเบียนนี้");
        setLoading(false);
        return;
      }

      const { data: cpn } = await supabase
        .from("coupons")
        .select("*")
        .eq("registration_id", reg.id)
        .maybeSingle();

      loadData(reg.registration_code || "", cpn?.coupon_token || "");
    } catch {
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    if (!record) return;
    setCheckingIn(true);
    try {
      const { error } = await supabase
        .from("checkins")
        .insert({
          registration_id: record.id,
          checked_in_by: "Admin Staff"
        });

      if (error) throw error;

      await supabase
        .from("registrations")
        .update({ status: "checked_in" })
        .eq("id", record.id);

      setIsCheckedIn(true);
      setCheckinTime(new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }));
      toast.success("เช็คอินผู้เข้าร่วมงานสำเร็จ!");
    } catch (err: any) {
      console.error(err);
      toast.error("ไม่สามารถบันทึกการเช็คอินได้");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!record || !coupon) return;
    setUpdatingPayment(true);
    try {
      // 1. Create or update payment record
      const { error: payError } = await supabase
        .from("payments")
        .insert({
          registration_id: record.id,
          amount: coupon.final_price,
          payment_method: paymentMethod,
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          admin_note: adminNote
        });

      if (payError) throw payError;

      // 2. Update coupon status to 'used'
      await supabase
        .from("coupons")
        .update({ status: "used", used_at: new Date().toISOString() })
        .eq("id", coupon.id);

      setIsPaid(true);
      toast.success("บันทึกการชำระเงินเรียบร้อยแล้ว!");

      // 3. Trigger Line Success Message
      try {
        await supabase.functions.invoke("send-line-message", {
          body: {
            to: record.line_user_id,
            type: "payment_confirmed",
            data: {
              registration_code: record.registration_code,
              full_name: record.full_name,
              amount: coupon.final_price
            }
          }
        });
        toast.success("ส่งข้อความยืนยันสิทธิ์เข้างานทาง LINE สำเร็จ!");
      } catch (lineErr) {
        console.error("Failed to send LINE confirmation:", lineErr);
        toast.warning("ชำระเงินสำเร็จ แต่ส่งข้อความ LINE ยืนยันไม่ได้");
      }

    } catch (err: any) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการบันทึกชำระเงิน");
    } finally {
      setUpdatingPayment(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">เช็คอินเข้างานสัมมนา</h1>
            <p className="font-body text-muted-foreground text-sm">สแกนคูปอง QR Code จาก LINE ของผู้ลงทะเบียนเพื่อตรวจสิทธิ์และเช็คอิน</p>
          </div>
          <Button
            onClick={() => { setShowScanner(!showScanner); setRecord(null); }}
            variant="outline"
            className="rounded-xl flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            {showScanner ? "ปิดกล้องสแกน" : "เปิดกล้องสแกน"}
          </Button>
        </div>

        {/* QR Scanner Element */}
        {showScanner && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-card max-w-md mx-auto overflow-hidden animate-fade-in-up">
            <div id="reader" className="w-full rounded-2xl overflow-hidden border border-border bg-black" />
            <p className="text-center font-body text-xs text-muted-foreground mt-4">
              กรุณานำ QR Code ของผู้สมัครวางไว้ในตำแหน่งหน้ากล้องเพื่อทำการสแกน
            </p>
          </div>
        )}

        {/* Manual Lookup */}
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            placeholder="กรอกรหัสลงทะเบียน (เช่น SAON-KK-0001)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl h-11 text-base font-heading font-semibold"
          />
          <Button onClick={handleManualSearch} className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/95 text-white">
            <Search className="h-4 w-4 mr-1" /> ค้นหา
          </Button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="font-body text-sm text-muted-foreground ml-2">กำลังดึงข้อมูล...</span>
          </div>
        )}

        {/* Checked Record Card Panel */}
        {record && coupon && !loading && (
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card space-y-6 animate-fade-in-up">

            {/* Header info */}
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-4">
                {record.line_picture_url ? (
                  <img src={record.line_picture_url} alt="Profile" className="w-16 h-16 rounded-full border border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-border text-primary">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-heading text-2xl font-bold text-foreground">{record.full_name}</h2>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{record.registration_code}</Badge>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">LINE: {record.line_display_name || "ไม่มีข้อมูล"}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isCheckedIn ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm py-1 px-3">
                    เช็คอินแล้ว ({checkinTime} น.)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-sm py-1 px-3">
                    ยังไม่เช็คอิน
                  </Badge>
                )}

                {isPaid ? (
                  <Badge className="bg-green-600 text-white text-sm py-1 px-3">
                    ชำระเงินแล้ว
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 text-white text-sm py-1 px-3">
                    ยังไม่ชำระเงิน
                  </Badge>
                )}
              </div>
            </div>

            {/* Profile & Form Details */}
            <div className="grid md:grid-cols-2 gap-6 font-body text-base">
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                  👤 ข้อมูลทั่วไป
                </h4>
                <div className="space-y-1 text-muted-foreground text-sm">
                  <p><span className="font-semibold text-foreground">เบอร์โทรศัพท์:</span> {record.phone}</p>
                  <p><span className="font-semibold text-foreground">อีเมล:</span> {record.email}</p>
                  <p><span className="font-semibold text-foreground">จังหวัด/อำเภอ:</span> {record.province} (อ. {record.district})</p>
                  <p><span className="font-semibold text-foreground">อาชีพ/หน่วยงาน:</span> {record.occupation || "-"}</p>
                  <p><span className="font-semibold text-foreground">ชื่อแบรนด์:</span> {record.business_name || "-"}</p>
                  <p><span className="font-semibold text-foreground">มี LINE OA หรือยัง:</span> {record.has_line_oa}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading font-bold text-foreground flex items-center gap-2">
                  🎟️ ข้อมูลสิทธิ์คูปอง
                </h4>
                <div className="space-y-1 text-muted-foreground text-sm">
                  <p><span className="font-semibold text-foreground">คูปอง:</span> {coupon.coupon_name}</p>
                  <p><span className="font-semibold text-foreground">สิทธิ์การจอง:</span> เรียนฟรี AI มูลค่า ฿{Number(coupon.coupon_value).toLocaleString()}</p>
                  <p><span className="font-semibold text-foreground">ราคาจำหน่ายจริง:</span> <strong className="text-primary text-base">฿{Number(coupon.final_price).toLocaleString()} บาท</strong></p>
                  <p><span className="font-semibold text-foreground">สถานะคูปอง:</span> {coupon.status === "used" ? "ใช้งานแล้ว" : "ยังไม่ได้ใช้งาน"}</p>
                </div>
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">

              {/* Checkin Buttons */}
              <div className="space-y-1">
                <Label className="font-heading font-semibold text-sm">สิทธิ์การเข้าร่วมงาน</Label>
                <div className="flex gap-2">
                  <Button
                    disabled={isCheckedIn || checkingIn}
                    onClick={handleCheckin}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-5 px-6 font-heading font-bold"
                  >
                    {checkingIn ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {isCheckedIn ? "เช็คอินเรียบร้อย" : "กดเช็คอินเข้างาน"}
                  </Button>
                </div>
              </div>

              {/* Payment Check out Controls */}
              {!isPaid ? (
                <div className="w-full md:w-auto p-5 rounded-2xl border border-dashed border-red-200 bg-red-50/50 space-y-4 flex-1 max-w-md">
                  <h4 className="font-heading font-bold text-red-700 flex items-center gap-1.5 text-sm">
                    <CreditCard className="h-4 w-4" /> บันทึกชำระค่าบัตรหน้างาน (ยอดชำระ ฿{Number(coupon.final_price).toLocaleString()})
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">วิธีการชำระ</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="bg-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="promptpay">สแกน PromptPay</SelectItem>
                          <SelectItem value="cash">เงินสด</SelectItem>
                          <SelectItem value="transfer">โอนเงินธนาคาร</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">หมายเหตุบันทึก</Label>
                      <Input
                        placeholder="เช่น สลิปเบอร์โอน 08x"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="bg-white rounded-xl text-xs h-10"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmPayment}
                    disabled={updatingPayment}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-heading font-bold rounded-xl h-11"
                  >
                    {updatingPayment ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    กดยืนยันชำระเงินแล้ว
                  </Button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl border border-green-200 bg-green-50/50 flex items-center gap-3 text-green-700 font-heading font-semibold text-sm">
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold">ชำระเงินค่าสมัครเรียบร้อยแล้ว!</p>
                    <p className="font-body text-xs text-green-600/80 mt-0.5">คูปองนี้ผ่านการยืนยันสิทธิ์และเช็คอินเรียบร้อย</p>
                  </div>
                </div>
              )}
            </div>

            {/* Back button */}
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                onClick={() => { setRecord(null); setCoupon(null); setShowScanner(true); }}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                กลับไปสแกนรหัสถัดไป
              </Button>
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}
