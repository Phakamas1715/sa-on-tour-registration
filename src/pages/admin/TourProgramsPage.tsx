import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Plane,
} from "lucide-react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type TourProgram = Tables<"tour_programs">;

const statusLabels: Record<string, string> = {
  draft: "ร่าง",
  active: "เปิดขาย",
  archived: "เก็บถาวร",
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  archived: "bg-muted text-muted-foreground",
};

const emptyForm: Omit<TablesInsert<"tour_programs">, "id" | "created_at" | "updated_at"> = {
  code: "",
  name: "",
  country: "",
  destination: "",
  days: 1,
  nights: 0,
  airline: "",
  price_per_person: null,
  highlights: [],
  included: [],
  excluded: [],
  notes: "",
  status: "draft",
  image_url: "",
  itinerary: null,
};

export default function TourProgramsPage() {
  const [programs, setPrograms] = useState<TourProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TourProgram | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [highlightsText, setHighlightsText] = useState("");
  const [includedText, setIncludedText] = useState("");
  const [excludedText, setExcludedText] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("tour_programs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    } else {
      setPrograms(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setHighlightsText("");
    setIncludedText("");
    setExcludedText("");
    setDialogOpen(true);
  };

  const openEdit = (p: TourProgram) => {
    setEditing(p);
    setForm({
      code: p.code,
      name: p.name,
      country: p.country,
      destination: p.destination,
      days: p.days,
      nights: p.nights,
      airline: p.airline || "",
      price_per_person: p.price_per_person,
      highlights: p.highlights || [],
      included: p.included || [],
      excluded: p.excluded || [],
      notes: p.notes || "",
      status: p.status,
      image_url: p.image_url || "",
      itinerary: p.itinerary,
    });
    setHighlightsText((p.highlights || []).join("\n"));
    setIncludedText((p.included || []).join("\n"));
    setExcludedText((p.excluded || []).join("\n"));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name || !form.country || !form.destination) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็น");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
      included: includedText.split("\n").map((s) => s.trim()).filter(Boolean),
      excluded: excludedText.split("\n").map((s) => s.trim()).filter(Boolean),
      price_per_person: form.price_per_person ? Number(form.price_per_person) : null,
    };

    if (editing) {
      const { error } = await supabase
        .from("tour_programs")
        .update(payload as TablesUpdate<"tour_programs">)
        .eq("id", editing.id);
      if (error) {
        toast.error("อัปเดตไม่สำเร็จ");
      } else {
        toast.success("อัปเดตโปรแกรมทัวร์แล้ว");
      }
    } else {
      const { error } = await supabase
        .from("tour_programs")
        .insert(payload as TablesInsert<"tour_programs">);
      if (error) {
        toast.error("สร้างโปรแกรมทัวร์ไม่สำเร็จ");
        console.error(error);
      } else {
        toast.success("สร้างโปรแกรมทัวร์แล้ว");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchPrograms();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบโปรแกรมทัวร์นี้?")) return;
    const { error } = await supabase.from("tour_programs").delete().eq("id", id);
    if (error) {
      toast.error("ลบไม่สำเร็จ");
    } else {
      toast.success("ลบโปรแกรมทัวร์แล้ว");
      fetchPrograms();
    }
  };

  const filtered = programs.filter((p) => {
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">โปรแกรมทัวร์</h1>
              <p className="font-body text-muted-foreground">จัดการโปรแกรมทัวร์ทั้งหมด</p>
            </div>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มโปรแกรม
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหารหัส, ชื่อ, ปลายทาง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {Object.entries(statusLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">ยังไม่มีโปรแกรมทัวร์</h3>
              <p className="font-body text-muted-foreground mb-4">เพิ่มโปรแกรมทัวร์เพื่อเริ่มต้นใช้งาน</p>
              <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />เพิ่มโปรแกรม</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-card rounded-2xl border border-border shadow-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">{p.code}</Badge>
                        <h3 className="font-heading font-bold text-foreground">{p.name}</h3>
                        <Badge className={`${statusColors[p.status]} border-0 text-xs`}>
                          {statusLabels[p.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-body flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.destination}, {p.country}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{p.days} วัน {p.nights} คืน</span>
                        {p.airline && <span className="flex items-center gap-1"><Plane className="h-3.5 w-3.5" />{p.airline}</span>}
                        {p.price_per_person && (
                          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />฿{Number(p.price_per_person).toLocaleString()}/คน</span>
                        )}
                      </div>
                      {p.highlights && p.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {p.highlights.slice(0, 4).map((h) => (
                            <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                          ))}
                          {p.highlights.length > 4 && (
                            <Badge variant="secondary" className="text-xs">+{p.highlights.length - 4}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="icon" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create/Edit Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">
                  {editing ? "แก้ไขโปรแกรมทัวร์" : "เพิ่มโปรแกรมทัวร์ใหม่"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>รหัสโปรแกรม *</Label>
                    <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="เช่น JP-OSK-5D" />
                  </div>
                  <div>
                    <Label>สถานะ</Label>
                    <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>ชื่อโปรแกรม *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="เช่น ทัวร์ญี่ปุ่น โอซาก้า-เกียวโต 5 วัน" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ประเทศ *</Label>
                    <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="เช่น ญี่ปุ่น" />
                  </div>
                  <div>
                    <Label>ปลายทาง *</Label>
                    <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="เช่น โอซาก้า-เกียวโต" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>จำนวนวัน</Label>
                    <Input type="number" min={1} value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>จำนวนคืน</Label>
                    <Input type="number" min={0} value={form.nights} onChange={(e) => setForm({ ...form, nights: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>ราคา/คน (฿)</Label>
                    <Input type="number" value={form.price_per_person ?? ""} onChange={(e) => setForm({ ...form, price_per_person: e.target.value ? Number(e.target.value) : null })} />
                  </div>
                </div>
                <div>
                  <Label>สายการบิน</Label>
                  <Input value={form.airline || ""} onChange={(e) => setForm({ ...form, airline: e.target.value })} placeholder="เช่น Thai Airways" />
                </div>
                <div>
                  <Label>ไฮไลท์ (บรรทัดละ 1 รายการ)</Label>
                  <Textarea rows={3} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder="เยือนวัดคินคะคุจิ&#10;ช้อปปิ้ง Shinsaibashi" />
                </div>
                <div>
                  <Label>สิ่งที่รวม (บรรทัดละ 1 รายการ)</Label>
                  <Textarea rows={3} value={includedText} onChange={(e) => setIncludedText(e.target.value)} placeholder="ตั๋วเครื่องบินไป-กลับ&#10;ที่พัก 4 คืน" />
                </div>
                <div>
                  <Label>สิ่งที่ไม่รวม (บรรทัดละ 1 รายการ)</Label>
                  <Textarea rows={3} value={excludedText} onChange={(e) => setExcludedText(e.target.value)} placeholder="ค่าทิปไกด์&#10;ค่าใช้จ่ายส่วนตัว" />
                </div>
                <div>
                  <Label>หมายเหตุ</Label>
                  <Textarea rows={2} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div>
                  <Label>URL รูปภาพ</Label>
                  <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "บันทึกการแก้ไข" : "สร้างโปรแกรมทัวร์"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
}
