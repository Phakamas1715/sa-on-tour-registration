import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import logoImg from "@/assets/logo-regent.png";
import loginBg from "@/assets/login-bg.png";


export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("เข้าสู่ระบบสำเร็จ!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("สมัครสำเร็จ! กรุณายืนยันอีเมลของคุณ");
      }
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="Background" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950" />
      </div>

      {/* Floating Glowing Decorative Spheres */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float z-0 pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float z-0 pointer-events-none" style={{ animationDuration: '9s' }} />

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 inline-block">
              <img src={logoImg} alt="Regent Holiday" className="h-12 mx-auto" />
            </div>
          </Link>
          <h1 className="font-heading text-3xl font-extrabold text-white mt-6 drop-shadow-md">
            {isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </h1>
          <p className="font-body text-slate-300 mt-2 text-sm drop-shadow-sm">
            {isLogin ? "ยินดีต้อนรับกลับสู่ Regent Holiday" : "เริ่มต้นเดินทางและสร้างบัญชีใหม่กับเรา"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 dark:bg-slate-950/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-5 border border-white/20">
          {!isLogin && (
            <div className="space-y-2">
              <Label className="font-heading font-semibold text-white">ชื่อ-สกุล</Label>
              <Input
                placeholder="ชื่อ นามสกุล"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-xl text-base bg-white/20 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/30 focus:border-white/50 transition-all backdrop-blur-sm"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-heading font-semibold text-white">อีเมล</Label>
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl text-base bg-white/20 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/30 focus:border-white/50 transition-all backdrop-blur-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-heading font-semibold text-white">รหัสผ่าน</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl text-base bg-white/20 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/30 focus:border-white/50 transition-all backdrop-blur-sm"
              required
              minLength={6}
            />
          </div>

          <Button variant="hero" type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98] mt-2">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isLogin ? <LogIn className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />}
            {loading ? "กำลังดำเนินการ..." : isLogin ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </form>

        <p className="text-center font-body text-sm text-slate-300 mt-6 drop-shadow-sm">
          {isLogin ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-white hover:text-primary-foreground font-semibold underline underline-offset-4 transition-colors"
          >
            {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </p>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
