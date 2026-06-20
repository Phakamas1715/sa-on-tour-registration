import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, FileText, BarChart3,
  Settings, Menu, X, LogOut, Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo-regent.png";

const sidebarItems = [
  { icon: LayoutDashboard, label: "จัดการ Lead", path: "/admin" },
  { icon: Receipt, label: "ใบเสนอราคา", path: "/admin/quotations" },
  { icon: FileText, label: "โปรแกรมทัวร์", path: "/admin/programs" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "ตั้งค่า", path: "/admin/settings" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoImg} alt="Regent" className="h-8" />
            <span className="font-heading font-bold text-sm text-sidebar-foreground">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl font-body text-sm transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <p className="font-body text-xs text-sidebar-foreground/50 mb-2 truncate">{user?.email}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={logoImg} alt="Regent" className="h-7" />
          <span className="font-heading font-bold text-sm">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-64 bg-sidebar text-sidebar-foreground p-3 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl font-body text-sm transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/70 mt-4"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              ออกจากระบบ
            </Button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-14 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
