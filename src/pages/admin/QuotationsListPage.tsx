import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, FileText } from "lucide-react";

interface QuotationRow {
  id: string;
  quotation_number: string;
  status: string;
  num_travelers: number;
  price_per_person: number;
  total_amount: number;
  valid_until: string | null;
  created_at: string;
  lead_id: string | null;
  tour_program_id: string | null;
  lead_name?: string;
  lead_org?: string;
  lead_destination?: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  draft: "ร่าง",
  sent: "ส่งแล้ว",
  accepted: "ตอบรับ",
  rejected: "ปฏิเสธ",
};

export default function QuotationsListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data: quotations } = await supabase
      .from("quotations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!quotations) { setLoading(false); return; }

    // fetch lead names
    const leadIds = [...new Set(quotations.filter(q => q.lead_id).map(q => q.lead_id!))];
    let leadMap: Record<string, { contact_name: string; org_name: string; destination: string }> = {};
    if (leadIds.length > 0) {
      const { data: leads } = await supabase.from("leads").select("id, contact_name, org_name, destination").in("id", leadIds);
      if (leads) {
        leads.forEach(l => { leadMap[l.id] = l; });
      }
    }

    const enriched: QuotationRow[] = quotations.map(q => ({
      ...q,
      lead_name: q.lead_id && leadMap[q.lead_id] ? leadMap[q.lead_id].contact_name : undefined,
      lead_org: q.lead_id && leadMap[q.lead_id] ? leadMap[q.lead_id].org_name : undefined,
      lead_destination: q.lead_id && leadMap[q.lead_id] ? leadMap[q.lead_id].destination : undefined,
    }));

    setRows(enriched);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("quotations").update({ status: newStatus }).eq("id", id);
    fetchQuotations();
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-foreground">ใบเสนอราคา</h1>
            <p className="font-body text-muted-foreground">รายการใบเสนอราคาทั้งหมด</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">ยังไม่มีใบเสนอราคา</h3>
              <p className="font-body text-muted-foreground">ออกใบเสนอราคาจากหน้า Lead ได้เลย</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((q) => (
                <div key={q.id} className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-heading font-bold text-foreground">{q.quotation_number}</span>
                      <Badge className={`${statusColors[q.status] || statusColors.draft} border-0 text-xs`}>
                        {statusLabels[q.status] || q.status}
                      </Badge>
                    </div>
                    <p className="font-body text-sm text-muted-foreground truncate">
                      {q.lead_org || "ไม่ระบุ"} — {q.lead_destination || "-"} | {q.lead_name || "-"}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {q.num_travelers} คน × ฿{Number(q.price_per_person).toLocaleString()} = <strong className="text-foreground">฿{Number(q.total_amount).toLocaleString()}</strong>
                      {q.valid_until && ` | หมดอายุ ${new Date(q.valid_until).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {q.status === "draft" && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(q.id, "sent")}>
                        ส่งแล้ว
                      </Button>
                    )}
                    {q.status === "sent" && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-700" onClick={() => updateStatus(q.id, "accepted")}>
                          ตอบรับ
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive" onClick={() => updateStatus(q.id, "rejected")}>
                          ปฏิเสธ
                        </Button>
                      </>
                    )}
                    <Button size="sm" onClick={() => navigate(`/admin/quotations/${q.id}`)}>
                      <Eye className="mr-1 h-4 w-4" /> ดู
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
