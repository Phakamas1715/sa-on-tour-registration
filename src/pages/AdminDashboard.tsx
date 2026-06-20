import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users, DollarSign, FileText, TrendingUp,
  Phone, Mail, Building2, MapPin, Calendar,
  ChevronDown, ChevronUp, Loader2, Plus,
  MessageSquare, Search,
} from "lucide-react";
import { QuotationDialog } from "@/pages/admin/QuotationDialog";

type Lead = {
  id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  contact_line_id: string | null;
  org_name: string;
  org_type: string;
  destination: string;
  travel_date_start: string | null;
  travel_date_end: string | null;
  num_travelers: number;
  budget_per_person: number | null;
  study_objectives: string | null;
  study_topics: string[] | null;
  preferred_visits: string | null;
  accommodation_level: string | null;
  meal_preference: string | null;
  special_requests: string | null;
  ai_generated_program: any;
  status: string;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  proposal_sent: "bg-purple-100 text-purple-800",
  negotiating: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  proposal_sent: "ส่งใบเสนอราคาแล้ว",
  negotiating: "เจรจา",
  won: "ปิดดีล",
  lost: "ไม่สำเร็จ",
};

const orgTypeLabels: Record<string, string> = {
  government: "ราชการ",
  corporate: "เอกชน",
  education: "การศึกษา",
  association: "สมาคม/ชมรม",
  other: "อื่นๆ",
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);
  const [quotationLead, setQuotationLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
      console.error(error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus as any })
      .eq("id", leadId);

    if (error) {
      toast.error("อัปเดตสถานะไม่สำเร็จ");
    } else {
      toast.success("อัปเดตสถานะแล้ว");
      fetchLeads();
    }
  };

  const generateAIProgram = async (lead: Lead) => {
    setGeneratingAI(lead.id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-tour", {
        body: {
          destination: lead.destination,
          num_travelers: lead.num_travelers,
          budget_per_person: lead.budget_per_person,
          study_objectives: lead.study_objectives,
          study_topics: lead.study_topics,
          preferred_visits: lead.preferred_visits,
          travel_date_start: lead.travel_date_start,
          travel_date_end: lead.travel_date_end,
        },
      });

      if (error) throw error;

      await supabase
        .from("leads")
        .update({ ai_generated_program: data.program })
        .eq("id", lead.id);

      toast.success("AI สร้างโปรแกรมทัวร์เรียบร้อยแล้ว!");
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("ไม่สามารถสร้างโปรแกรมได้ กรุณาลองใหม่");
    } finally {
      setGeneratingAI(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      lead.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    proposalSent: leads.filter((l) => l.status === "proposal_sent").length,
    won: leads.filter((l) => l.status === "won").length,
    totalRevenue: leads
      .filter((l) => l.status === "won")
      .reduce((sum, l) => sum + (l.budget_per_person || 0) * l.num_travelers, 0),
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="font-body text-muted-foreground">จัดการ leads และใบเสนอราคาทัวร์กรุ๊ป</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Leads ใหม่", value: stats.newLeads, icon: Users, color: "text-yellow-600" },
              { label: "ส่งใบเสนอราคา", value: stats.proposalSent, icon: FileText, color: "text-blue-600" },
              { label: "ปิดดีล", value: stats.won, icon: TrendingUp, color: "text-green-600" },
              { label: "รายได้รวม", value: `฿${(stats.totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-purple-600" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-card rounded-2xl border border-border p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="font-body text-sm text-muted-foreground">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาชื่อ, องค์กร, ปลายทาง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="สถานะทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด ({leads.length})</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label} ({leads.filter((l) => l.status === key).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lead List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">ยังไม่มี Lead</h3>
              <p className="font-body text-muted-foreground">Lead จะปรากฏที่นี่เมื่อลูกค้าส่งคำขอใบเสนอราคา</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  {/* Lead Header */}
                  <div
                    className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-heading font-bold text-foreground truncate">{lead.org_name}</h3>
                            <Badge className={`${statusColors[lead.status]} border-0 text-xs`}>
                              {statusLabels[lead.status]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{orgTypeLabels[lead.org_type]}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground font-body flex-wrap">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.destination}</span>
                            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{lead.num_travelers} คน</span>
                            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.contact_name}</span>
                            {lead.budget_per_person && (
                              <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />฿{lead.budget_per_person.toLocaleString()}/คน</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-xs text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                        </span>
                        {expandedLead === lead.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Lead Details (expanded) */}
                  {expandedLead === lead.id && (
                    <div className="border-t border-border p-5 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-heading font-semibold text-foreground">📞 ข้อมูลติดต่อ</h4>
                          <div className="space-y-2 font-body text-sm">
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{lead.contact_phone}</p>
                            {lead.contact_email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{lead.contact_email}</p>}
                            {lead.contact_line_id && <p className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-muted-foreground" />LINE: {lead.contact_line_id}</p>}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-heading font-semibold text-foreground">✈️ รายละเอียดทริป</h4>
                          <div className="space-y-2 font-body text-sm">
                            {lead.travel_date_start && (
                              <p className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {lead.travel_date_start} — {lead.travel_date_end || "ยังไม่กำหนด"}
                              </p>
                            )}
                            {lead.accommodation_level && <p>🏨 {lead.accommodation_level}</p>}
                            {lead.meal_preference && <p>🍽️ {lead.meal_preference}</p>}
                          </div>
                        </div>
                      </div>

                      {(lead.study_objectives || (lead.study_topics && lead.study_topics.length > 0)) && (
                        <div className="space-y-3">
                          <h4 className="font-heading font-semibold text-foreground">📚 ศึกษาดูงาน</h4>
                          {lead.study_objectives && <p className="font-body text-sm text-foreground">{lead.study_objectives}</p>}
                          {lead.study_topics && lead.study_topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {lead.study_topics.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                            </div>
                          )}
                          {lead.preferred_visits && <p className="font-body text-sm text-muted-foreground">🏛️ {lead.preferred_visits}</p>}
                        </div>
                      )}

                      {lead.special_requests && (
                        <div className="space-y-2">
                          <h4 className="font-heading font-semibold text-foreground">📝 คำขอพิเศษ</h4>
                          <p className="font-body text-sm text-foreground">{lead.special_requests}</p>
                        </div>
                      )}

                      {lead.ai_generated_program && (
                        <div className="space-y-3 bg-muted/50 rounded-xl p-4">
                          <h4 className="font-heading font-semibold text-foreground">🤖 โปรแกรมจาก AI</h4>
                          <pre className="font-body text-sm text-foreground whitespace-pre-wrap overflow-x-auto">
                            {typeof lead.ai_generated_program === "string"
                              ? lead.ai_generated_program
                              : JSON.stringify(lead.ai_generated_program, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                        <Select value={lead.status} onValueChange={(val) => updateLeadStatus(lead.id, val)}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={() => generateAIProgram(lead)} disabled={generatingAI === lead.id}>
                          {generatingAI === lead.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-2 h-4 w-4" />
                          )}
                          {generatingAI === lead.id ? "กำลังสร้าง..." : "AI สร้างโปรแกรม"}
                        </Button>

                        <Button variant="outline" onClick={() => setQuotationLead(lead)}>
                          <FileText className="mr-2 h-4 w-4" />
                          ออกใบเสนอราคา
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quotation Dialog */}
          {quotationLead && (
            <QuotationDialog
              open={!!quotationLead}
              onOpenChange={(open) => !open && setQuotationLead(null)}
              lead={quotationLead as any}
              onSuccess={() => {
                setQuotationLead(null);
                fetchLeads();
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
