import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/AdminLayout";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Target, Star,
  Users, ArrowRight,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  Legend,
} from "recharts";

const kpis = [
  { label: "Total Revenue", value: "฿2.4M", change: "+18%", up: true, icon: DollarSign },
  { label: "Conversion Rate", value: "32%", change: "+5%", up: true, icon: Target },
  { label: "Avg Deal Size", value: "฿45K", change: "+12%", up: true, icon: BarChart3 },
  { label: "Customer Satisfaction", value: "4.8/5", change: "-0.1", up: false, icon: Star },
];

const revenueData = [
  { month: "ต.ค.", phuket: 280, bangkok: 180, chiangmai: 120 },
  { month: "พ.ย.", phuket: 350, bangkok: 200, chiangmai: 160 },
  { month: "ธ.ค.", phuket: 420, bangkok: 250, chiangmai: 200 },
  { month: "ม.ค.", phuket: 380, bangkok: 220, chiangmai: 180 },
  { month: "ก.พ.", phuket: 450, bangkok: 280, chiangmai: 220 },
  { month: "มี.ค.", phuket: 520, bangkok: 310, chiangmai: 260 },
];

const destinationData = [
  { name: "ภูเก็ต", value: 35, color: "hsl(193, 100%, 43%)" },
  { name: "กรุงเทพ", value: 25, color: "hsl(18, 100%, 60%)" },
  { name: "เชียงใหม่", value: 20, color: "hsl(145, 63%, 49%)" },
  { name: "กระบี่", value: 12, color: "hsl(270, 60%, 55%)" },
  { name: "อื่นๆ", value: 8, color: "hsl(210, 20%, 80%)" },
];

const agentData = [
  { name: "พิมพ์", revenue: 850, color: "hsl(145, 63%, 49%)" },
  { name: "ณัฐ", revenue: 720, color: "hsl(145, 63%, 49%)" },
  { name: "สมศรี", revenue: 580, color: "hsl(45, 100%, 50%)" },
  { name: "วิชัย", revenue: 420, color: "hsl(45, 100%, 50%)" },
  { name: "อรุณ", revenue: 310, color: "hsl(0, 70%, 55%)" },
];

const funnelSteps = [
  { label: "Leads", value: 250, width: "100%" },
  { label: "Requirements", value: 180, width: "72%" },
  { label: "Proposals", value: 120, width: "48%" },
  { label: "Negotiations", value: 65, width: "26%" },
  { label: "Won", value: 45, width: "18%" },
];

const topTours = [
  { name: "Phuket Beach Paradise", bookings: 48, revenue: "฿1.2M", rating: 4.9, margin: "32%" },
  { name: "Chiang Mai Culture", bookings: 35, revenue: "฿780K", rating: 4.8, margin: "28%" },
  { name: "Krabi Island Hopping", bookings: 28, revenue: "฿650K", rating: 4.7, margin: "35%" },
  { name: "Bangkok Food Tour", bookings: 22, revenue: "฿440K", rating: 4.6, margin: "40%" },
  { name: "Samui Luxury Escape", bookings: 15, revenue: "฿520K", rating: 4.9, margin: "25%" },
];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("6m");

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-foreground">Analytics</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 เดือน</SelectItem>
              <SelectItem value="3m">3 เดือน</SelectItem>
              <SelectItem value="6m">6 เดือน</SelectItem>
              <SelectItem value="1y">1 ปี</SelectItem>
            </SelectContent>
          </Select>
        </div>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-background rounded-xl border border-border p-5 shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-heading text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className={`font-body text-xs flex items-center gap-1 mt-1 ${kpi.up ? "text-success" : "text-destructive"}`}>
                  {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-heading text-base font-semibold text-foreground mb-4">Revenue Trend (฿K)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="phuket" stroke="hsl(193, 100%, 43%)" strokeWidth={2} name="ภูเก็ต" />
                  <Line type="monotone" dataKey="bangkok" stroke="hsl(18, 100%, 60%)" strokeWidth={2} name="กรุงเทพ" />
                  <Line type="monotone" dataKey="chiangmai" stroke="hsl(145, 63%, 49%)" strokeWidth={2} name="เชียงใหม่" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Destination Donut */}
            <div className="bg-background rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-heading text-base font-semibold text-foreground mb-4">Bookings by Destination</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={destinationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {destinationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {destinationData.map((d) => (
                  <span key={d.name} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name} {d.value}%
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sales by Agent */}
            <div className="bg-background rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-heading text-base font-semibold text-foreground mb-4">Sales by Agent (฿K)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={agentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                    {agentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-background rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-heading text-base font-semibold text-foreground mb-4">Lead → Deal Funnel</h3>
              <div className="space-y-3">
                {funnelSteps.map((step, i) => (
                  <div key={step.label} className="space-y-1">
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-foreground">{step.label}</span>
                      <span className="text-muted-foreground font-semibold">{step.value}</span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden flex items-center justify-center" style={{ width: step.width }}>
                      <div className="w-full h-full bg-gradient-cta rounded-lg opacity-80" />
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <p className="font-body text-xs text-muted-foreground pl-2">
                        ↓ {Math.round(((funnelSteps[i].value - funnelSteps[i + 1].value) / funnelSteps[i].value) * 100)}% dropout
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Tours Table */}
          <div className="bg-background rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-heading text-base font-semibold text-foreground">Top Performing Tours</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-4 text-left font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tour</th>
                    <th className="p-4 text-left font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bookings</th>
                    <th className="p-4 text-left font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                    <th className="p-4 text-left font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                    <th className="p-4 text-left font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {topTours.map((tour, i) => (
                    <tr key={tour.name} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4 font-body text-sm font-medium text-foreground">{i + 1}. {tour.name}</td>
                      <td className="p-4 font-body text-sm text-foreground">{tour.bookings}</td>
                      <td className="p-4 font-body text-sm font-semibold text-foreground">{tour.revenue}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 font-body text-sm text-foreground">
                          <Star className="h-3.5 w-3.5 text-primary fill-primary" />{tour.rating}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{tour.margin}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}
