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

// Admin Dashboard Components
import { Sidebar } from "./admin/Sidebar";
import { TopNav } from "./admin/TopNav";
import { Overview } from "./admin/Overview";
import { UserManagement } from "./admin/UserManagement";
import { SecurityCenter } from "./admin/SecurityCenter";
import { LogsView } from "./admin/LogsView";
import { Analytics } from "./admin/Analytics";
import { RevenueView } from "./admin/RevenueView";
import { BroadcastCenter } from "./admin/BroadcastCenter";
import { Settings } from "./admin/Settings";
import { DevTools } from "./admin/DevTools";
import { AdminAuth } from "./admin/AdminAuth";

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
  const [step, setStep] = useState<"auth" | "dashboard">("auth");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ServerLog[]>([]);
  const [refreshingStats, setRefreshingStats] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    setRefreshingStats(true);
    try {
      const res = await fetch("/api/admin/dashboard-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
        setStep("dashboard");
      } else {
        setStep("auth");
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
      setStep("auth");
    } finally {
      setRefreshingStats(false);
    }
  };

  useEffect(() => {
    // Check session on mount
    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    setStep("auth");
    setStats(null);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col font-sans selection:bg-white/30 overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        {step === "auth" ? (
          <AdminAuth 
            key="auth-view"
            onSuccess={() => {
              setStep("dashboard");
              fetchDashboardStats();
            }} 
            onExit={() => navigate("/")}
          />
        ) : (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col"
          >
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
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                </div>
              </div>
            </nav>

            <div className="fixed inset-0 min-h-screen bg-[#070708] text-white flex font-sans selection:bg-[#00E599]/30 z-[100]">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopNav onLogout={handleLogout} />
                
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="h-full"
                    >
                      {activeTab === "dashboard" && <Overview />}
                      {activeTab === "users" && <UserManagement />}
                      {activeTab === "security" && <SecurityCenter />}
                      {activeTab === "logs" && <LogsView />}
                      {activeTab === "analytics" && <Analytics />}
                      {activeTab === "revenue" && <RevenueView />}
                      {activeTab === "broadcast" && <BroadcastCenter />}
                      {activeTab === "settings" && <Settings />}
                      {activeTab === "developer" && <DevTools />}
                    </motion.div>
                  </AnimatePresence>
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-xs text-white/30 font-medium tracking-wide">
        &copy; 2026 APEX Engine Secure Operations. Protected by military-grade asymmetric key hashing.
      </footer>
    </div>
  );
}
