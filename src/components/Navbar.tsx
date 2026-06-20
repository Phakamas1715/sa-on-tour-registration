// Navbar component
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import logoImg from "@/assets/logo-regent.png";

const navItems = [
  { label: "หน้าแรก", path: "/" },
  { label: "ลงทะเบียน AI Workshop", path: "/register" },
  { label: "จองทัวร์", path: "/booking" },
  { label: "แพ็คเกจ", path: "/packages" },
  { label: "เกี่ยวกับเรา", path: "https://www.regentholiday.com/about", external: true },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-foreground">
          <img src={logoImg} alt="Regent Holidays" className="h-10 object-contain" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`font-body text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/customer">
                <Button variant="ghost" size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  บัญชีของฉัน
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <>
              <a href="https://line.me/R/ti/p/@ugm3067r" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1 text-green-600 border-green-600 hover:bg-green-50">
                  <MessageCircle className="h-4 w-4" />
                  แอดไลน์
                </Button>
              </a>
              <Link to="/booking">
                <Button variant="hero" size="sm">เริ่มวางแผนทริป</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border p-4 space-y-3">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-body text-base text-foreground hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block py-2 font-body text-base text-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            )
          )}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 font-body text-base text-primary font-semibold">
                  🛡️ Admin Panel
                </Link>
              )}
              <Link to="/customer" onClick={() => setMobileOpen(false)} className="block py-2 font-body text-base text-foreground hover:text-primary">
                👤 บัญชีของฉัน
              </Link>
              <Button variant="outline" className="w-full mt-2" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <>
              <a href="https://line.me/R/ti/p/@ugm3067r" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="block py-2 font-body text-base text-green-600 hover:text-green-700 font-semibold">
                💬 แอดไลน์ปรึกษาฟรี
              </a>
              <Link to="/booking" onClick={() => setMobileOpen(false)}>
                <Button variant="hero" className="w-full mt-2">เริ่มวางแผนทริป</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
