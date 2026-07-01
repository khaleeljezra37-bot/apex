import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminAuthProps {
  onSuccess: () => void;
  onExit: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess, onExit }) => {
  const [step, setStep] = useState<"password" | "2fa" | "success">("password");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("2fa");
        // Start cooldown on first send
        setCooldown(60);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handle2faSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("success");
        setTimeout(onSuccess, 1500);
      } else {
        setError(data.error || "Invalid verification code");
        // Shake animation handled by motion
      }
    } catch (err) {
      setError("Verification failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setError(null);
    setResendSuccess(false);

    try {
      const res = await fetch("/api/admin/resend-2fa", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setCooldown(60);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        if (res.status === 401 || res.status === 400) {
          setError("Your session has expired. Please log in again.");
          setTimeout(() => setStep("password"), 2000);
        } else {
          setError(data.error || "Failed to resend code");
        }
      }
    } catch (err) {
      setError("Resend failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code.every(digit => digit !== "")) {
      handle2faSubmit();
    }
  }, [code]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#070708] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <AnimatePresence mode="wait">
        {step === "password" ? (
          <motion.div
            key="password-screen"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="w-full max-w-md p-8 relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-2xl space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white">Secure Access</h1>
                  <p className="text-xs text-white/40 font-medium tracking-wide">Enter your administrative credentials</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin Password"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500/30 focus:bg-black/60 transition-all text-white placeholder:text-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-2 text-red-400 text-[11px] font-bold uppercase tracking-wider px-2"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="w-full py-4 rounded-2xl bg-[#10b981] text-black font-black uppercase tracking-widest text-[11px] hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify Identity"}
                  </button>
                  <button
                    type="button"
                    onClick={onExit}
                    className="w-full py-4 rounded-2xl border border-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel Access
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : step === "2fa" ? (
          <motion.div
            key="2fa-screen"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="w-full max-w-md p-8 relative z-10"
          >
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-2xl space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-[24px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Key className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white">Verification</h1>
                  <p className="text-xs text-white/40 font-medium tracking-wide">Sent to your Discord secure channel</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => inputRefs.current[i] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-12 h-16 bg-black/40 border border-white/5 rounded-2xl text-center text-2xl font-black text-white focus:border-blue-500/50 focus:bg-black/60 outline-none transition-all"
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      className="flex items-center gap-2 text-red-400 text-[11px] font-bold uppercase tracking-wider justify-center"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </motion.div>
                  )}
                  {resendSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-wider justify-center"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      New code sent successfully
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4 pt-2">
                  <button
                    onClick={handle2faSubmit}
                    disabled={loading || code.some(d => !d)}
                    className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Establish Session"}
                  </button>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={handleResend}
                      disabled={loading || cooldown > 0}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
                    >
                      {cooldown > 0 ? (
                        `Resend Code in ${cooldown}s`
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          Resend Verification Code
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setStep("password")}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-6 relative z-10"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle2 className="w-16 h-16" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">Authentication Verified</h1>
              <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em]">Welcome back, Administrator</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
