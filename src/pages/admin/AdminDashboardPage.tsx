// Re-export existing AdminDashboard with AdminLayout wrapper
import { AdminLayout } from "@/components/AdminLayout";
import AdminDashboardContent from "@/pages/AdminDashboard";

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
