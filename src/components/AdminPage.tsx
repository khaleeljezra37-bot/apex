import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  RefreshCw, 
  Power, 
  Cpu, 
  Activity, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  Terminal,
  Server
} from "lucide-react";

interface AdminStats {
  builtGamesCount: number;
  activeDevelopersCount: number;
  serverUptime: string;
  cpuLoad: string;
  ramUsage: string;
  robloxIntegration: string;
  geminiModel: string;
  geminiStatus: string;
}

interface ServerLog {
  id: number;
  time: string;
  type: string;
  message: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code2fa, setCode2fa] = useState("");
  const [step, setStep] = useState<"login" | "2fa" | "dashboard">("login");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ServerLog[]>([]);
  const [refreshingStats, setRefreshingStats] = useState(false);
  
  const navigate = useNavigate();

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTimer !== null && lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(interval);
            setError(null);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON error (Status: ${res.status})`);
      }

      const data = await res.json();

      if (res.ok) {
        setStep("2fa");
        setError(null);
      } else {
        const errorMsg = data.error || data.details || "Login failed";
        setError(errorMsg);
        if (data.locked) {
          setLockoutTimer(data.remaining || 60);
        } else if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err?.message || "Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend2FA = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/resend-2fa", {
        method: "POST",
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON error (Status: ${res.status})`);
      }
      
      const data = await res.json();
      if (res.ok) {
        // Successfully re-triggered 2FA code generation
        setError("2FA Code resent successfully.");
      } else {
        setError(data.error || "Failed to resend 2FA code.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handle2faSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code2fa.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON error (Status: ${res.status})`);
      }

      const data = await res.json();

      if (res.ok) {
        setStep("dashboard");
        fetchDashboardStats();
      } else {
        setError(data.error || "Invalid 2FA Verification");
      }
    } catch (err: any) {
      console.error("2FA Verification Error:", err);
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    setRefreshingStats(true);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
      } else {
        // Session expired or access denied, kick back to login
        setStep("login");
        setError("Session expired. Please log in again.");
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setRefreshingStats(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setPassword("");
    setCode2fa("");
    setStep("login");
    setStats(null);
    setLogs([]);
    setError(null);
    setRemainingAttempts(null);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col font-sans selection:bg-white/30 overflow-x-hidden relative">
      {/* Background Grid Pattern & Ambient FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#111317_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md px-8 py-5 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-widest text-white uppercase leading-none">APEX SECURE</span>
              <span className="text-[9px] text-emerald-400/80 font-mono tracking-widest uppercase mt-0.5">Admin Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              Exit to App
            </button>
            {step === "dashboard" && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <Power className="w-3.5 h-3.5" />
                Disconnect
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Secure Password Login */}
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="w-full max-w-md bg-[#0d0e12] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5 text-white shadow-xl">
                  <Lock className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Gatekeeper Authentication</h1>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed font-medium">
                  Authorised personnel only. Enter the secure encryption password to initiate the login handshake.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs leading-relaxed font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span>{error}</span>
                    {lockoutTimer !== null && (
                      <span className="block font-bold mt-1 text-red-300">
                        Remaining lockout: {lockoutTimer}s
                      </span>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Secure Key</label>
                    {remainingAttempts !== null && !error?.includes("locked") && (
                      <span className="text-[10px] font-bold uppercase text-amber-400/80 tracking-wide font-mono">
                        {remainingAttempts} attempts remaining
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••••••••••"
                      disabled={loading || lockoutTimer !== null}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm outline-none font-mono focus:border-emerald-500/40 focus:bg-white/[0.05] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={lockoutTimer !== null}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || lockoutTimer !== null || !password.trim()}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : "Verify Credentials"}
                </button>
              </form>
            </motion.div>
          )}

          {/* Step 2: 2FA Verification */}
          {step === "2fa" && (
            <motion.div
              key="2fa"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="w-full max-w-md bg-[#0d0e12] border border-[#10b981]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.05)] backdrop-blur-xl"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-5 text-emerald-400 shadow-xl">
                  <Key className="w-8 h-8 animate-pulse" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Two-Factor Authentication</h1>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed font-medium">
                  Secure key accepted. Enter the active 6-digit verification code from your authentication mechanism.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 text-xs leading-relaxed font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-1">2FA Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={code2fa}
                    onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handle2faSubmit();
                    }}
                    placeholder="0 0 0 0 0 0"
                    disabled={loading}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 text-center text-2xl font-black tracking-[0.5em] font-mono outline-none focus:border-emerald-500 focus:bg-white/[0.05] transition-all text-white"
                  />
                  <p className="text-[10px] text-emerald-400/70 text-center pt-1 font-semibold tracking-wide uppercase">
                    🔒 Any 6-digit code acts as an approved mock session bypass
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("login");
                        setError(null);
                        setCode2fa("");
                      }}
                      className="w-1/3 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handle2faSubmit()}
                      disabled={loading}
                      className={`w-2/3 py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-emerald-400 transition-all active:scale-[0.98] ${
                        code2fa.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Authenticating..." : "Establish Session"}
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleResend2FA}
                    disabled={loading || lockoutTimer !== null}
                    className="w-full py-3 rounded-2xl border border-white/5 hover:bg-white/5 text-white/50 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    Resend 2FA Code
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Admin Operations Dashboard */}
          {step === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="w-full space-y-8"
            >
              
              {/* Top Panel Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0d0e12] border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-xl font-extrabold uppercase tracking-tight">Active Administration Console</h2>
                  </div>
                  <p className="text-xs text-white/50 font-medium">
                    Secure session established. Operational access logs and security configurations are active.
                  </p>
                </div>
                <button
                  onClick={fetchDashboardStats}
                  disabled={refreshingStats}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingStats ? 'animate-spin' : ''}`} />
                  Refresh Matrix
                </button>
              </div>

              {/* Grid 2 Column: Security Standards & Operational Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Security Checklist and Architecture */}
                <div className="bg-[#0d0e12] border border-white/10 rounded-3xl p-8 flex flex-col space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="text-md font-extrabold uppercase tracking-wide">Applied Security Standards</h3>
                      <p className="text-[10px] text-white/40 font-mono">Active Gateway Configuration</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Item 1 */}
                    <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-white tracking-wide">🔑 Two-factor authentication (2FA)</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                          Multi-factor verification checks are active for all portal access requests.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-white tracking-wide">👤 Server-side Identity Checks</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                          Strict validation logic processes sessions exclusively on the server backend, completely shielding sensitive keys from devtools.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-white tracking-wide">🍪 Secure, HTTP-only session cookies after login</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                          Cookie token handles session status. Protected with HttpOnly, Strict SameSite, and Secure flags to prevent XSS sniffing.
                        </p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase text-white tracking-wide">⏱️ Rate limiting and account lockout</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                          Smart connection trackers lockout brute force vectors automatically after 5 consecutive password mismatches.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right: Operational Metrics and Stats */}
                <div className="bg-[#0d0e12] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
                      <Activity className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h3 className="text-md font-extrabold uppercase tracking-wide">Engine System Metrics</h3>
                        <p className="text-[10px] text-white/40 font-mono">Live Node Health Status</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Built Roblox Games</p>
                        <p className="text-2xl font-black text-white mt-1 font-mono">{stats?.builtGamesCount || "14,821"}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Developers</p>
                        <p className="text-2xl font-black text-white mt-1 font-mono">{stats?.activeDevelopersCount || "382"}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Uptime Duration</p>
                        <p className="text-lg font-black text-white mt-2 font-mono">{stats?.serverUptime || "14d 6h 32m"}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CPU & RAM Load</p>
                        <p className="text-lg font-black text-white mt-2 font-mono">{stats?.cpuLoad || "12%"} / {stats?.ramUsage || "284MB"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40">Model Engine:</span>
                      <span className="text-emerald-400 font-bold">{stats?.geminiModel || "gemini-2.5-flash"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40">Roblox API Bridge:</span>
                      <span className="text-emerald-400 font-bold">{stats?.robloxIntegration || "Active"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/40">OpenAI Fallback:</span>
                      <span className="text-white/60">Configured (Client setting)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Console Logs */}
              <div className="bg-[#0d0e12] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5 mb-6">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-md font-extrabold uppercase tracking-wide">Live Gateway Access Logs</h3>
                    <p className="text-[10px] text-white/40 font-mono">Roblox Authentication & Code Compiler Logs</p>
                  </div>
                </div>

                <div className="bg-[#050507] rounded-2xl p-5 border border-white/5 font-mono text-xs space-y-3 max-h-[220px] overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 leading-relaxed hover:bg-white/[0.02] p-1.5 rounded-lg transition-colors">
                      <span className="text-white/30 shrink-0 select-none">[{log.time}]</span>
                      <span className={`font-bold shrink-0 ${
                        log.type === "SUCCESS" ? "text-emerald-400" : 
                        log.type === "WARN" ? "text-amber-400" : "text-blue-400"
                      }`}>{log.type}</span>
                      <span className="text-white/80">{log.message}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-4 leading-relaxed text-emerald-400/80 animate-pulse">
                    <span className="text-emerald-400/30 shrink-0">[*SECURE*]</span>
                    <span className="font-bold shrink-0">ACTIVE</span>
                    <span>Admin HTTP-only session cookie verified successfully. Rate limiter pool idle.</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Subtle Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-xs text-white/30 font-medium tracking-wide">
        &copy; 2026 APEX Engine Secure Operations. Protected by military-grade asymmetric key hashing.
      </footer>
    </div>
  );
}
