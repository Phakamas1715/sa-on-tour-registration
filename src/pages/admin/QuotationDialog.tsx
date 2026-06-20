import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;
type TourProgram = Tables<"tour_programs">;

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onSuccess: () => void;
}

export function QuotationDialog({ open, onOpenChange, lead, onSuccess }: QuotationDialogProps) {
  const navigate = useNavigate();
  const [tourPrograms, setTourPrograms] = useState<TourProgram[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("none");
  const [pricePerPerson, setPricePerPerson] = useState(lead.budget_per_person ? Number(lead.budget_per_person) : 0);
  const [numTravelers, setNumTravelers] = useState(lead.num_travelers);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const totalAmount = pricePerPerson * numTravelers;

  useEffect(() => {
    if (open) {
      fetchPrograms();
      setPricePerPerson(lead.budget_per_person ? Number(lead.budget_per_person) : 0);
      setNumTravelers(lead.num_travelers);
      setSelectedProgramId("none");
      setNotes("");
      // Default valid_until to 30 days from now
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setValidUntil(d.toISOString().split("T")[0]);
    }
  }, [open, lead]);

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from("tour_programs")
      .select("*")
      .eq("status", "active")
      .order("name");
    setTourPrograms(data || []);
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgramId(programId);
    if (programId !== "none") {
      const program = tourPrograms.find((p) => p.id === programId);
      if (program?.price_per_person) {
        setPricePerPerson(Number(program.price_per_person));
      }
    }
  };

  const generateQuotationNumber = () => {
    const now = new Date();
    const y = now.getFullYear().toString().slice(-2);
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const seq = Math.floor(Math.random() * 9000) + 1000;
    return `QT${y}${m}${d}-${seq}`;
  };

  const handleSave = async () => {
    if (pricePerPerson <= 0 || numTravelers <= 0) {
      toast.error("กรุณากรอกราคาและจำนวนคน");
      return;
    }

    setSaving(true);
    const quotationNumber = generateQuotationNumber();

    const { data, error } = await supabase.from("quotations").insert({
      quotation_number: quotationNumber,
      lead_id: lead.id,
      tour_program_id: selectedProgramId !== "none" ? selectedProgramId : null,
      price_per_person: pricePerPerson,
      num_travelers: numTravelers,
      total_amount: totalAmount,
      valid_until: validUntil || null,
      notes: notes || null,
      status: "draft",
    }).select().single();

    if (error) {
      console.error(error);
      toast.error("สร้างใบเสนอราคาไม่สำเร็จ");
    } else {
      toast.success(`สร้างใบเสนอราคา ${quotationNumber} แล้ว`);
      onOpenChange(false);
      onSuccess();
      if (data?.id) {
        navigate(`/admin/quotations/${data.id}`);
      }
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">ออกใบเสนอราคา</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="font-body text-sm"><strong>{lead.org_name}</strong> — {lead.destination}</p>
            <p className="font-body text-xs text-muted-foreground">{lead.contact_name} | {lead.contact_phone}</p>
          </div>

          <div>
            <Label>เลือกโปรแกรมทัวร์ (ถ้ามี)</Label>
            <Select value={selectedProgramId} onValueChange={handleProgramSelect}>
              <SelectTrigger><SelectValue placeholder="ไม่เลือกโปรแกรม" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— ไม่เลือกโปรแกรม —</SelectItem>
                {tourPrograms.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} — {p.name} ({p.days}D{p.nights}N)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ราคา/คน (฿)</Label>
              <Input
                type="number"
                min={0}
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>จำนวนคน</Label>
              <Input
                type="number"
                min={1}
                value={numTravelers}
                onChange={(e) => setNumTravelers(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 text-center">
            <p className="font-body text-sm text-muted-foreground">ยอดรวม</p>
            <p className="font-heading text-2xl font-bold text-primary">
              ฿{totalAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <Label>ใบเสนอราคาหมดอายุ</Label>
            <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>

          <div>
            <Label>หมายเหตุ</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="หมายเหตุเพิ่มเติม..." />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            สร้างใบเสนอราคา
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
