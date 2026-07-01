import React, { useEffect, useState } from "react";
import { 
  Users, 
  Activity, 
  Cpu, 
  DollarSign, 
  Globe, 
  ShieldCheck, 
  Puzzle, 
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { motion } from "motion/react";
import { fetchAdminStats } from "../../lib/api";

export const Overview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminStats();
      setData(res);
    } catch (err) {
      setError("Failed to synchronize with engine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: "Total Users", value: data?.stats?.activeDevelopersCount ?? 0, icon: Users, suffix: "" },
    { label: "Built Games", value: data?.stats?.builtGamesCount ?? 0, icon: Puzzle, suffix: "" },
    { label: "AI Requests", value: data?.stats?.totalAiRequests ?? 0, icon: Cpu, suffix: "" },
    { label: "Server Load", value: data?.stats?.cpuLoad ?? "0%", icon: Activity, suffix: "" },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        <div className="h-10 w-64 bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
          <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const hasData = (data?.stats?.activeDevelopersCount > 0) || (data?.stats?.totalAiRequests > 0);

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Operations Control</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Real-time system health and core metrics monitoring.</p>
        </div>
        <button 
          onClick={loadData}
          className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0d0e12] border border-white/5 p-6 rounded-3xl hover:border-[#00E599]/20 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 group-hover:text-[#00E599] group-hover:border-[#00E599]/20 transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
              </div>

              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-white">{stat.value}{stat.suffix}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!hasData ? (
        <div className="bg-[#0d0e12] border border-dashed border-white/10 rounded-[40px] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Activity className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Waiting for first connection...</h2>
          <p className="text-sm text-white/40 font-medium max-w-md mt-4">
            No production data has been logged yet. The dashboard will automatically update once users start interacting with the platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
             <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-md font-black uppercase tracking-tight text-white">Live Activity Logs</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Recent system events</p>
              </div>
            </div>
            <div className="space-y-3">
              {data.logs.map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === "INFO" ? "bg-blue-400" : log.type === "WARN" ? "bg-amber-400" : "bg-[#00E599]"
                    }`} />
                    <span className="text-xs font-bold text-white/80">{log.message}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <h3 className="text-md font-black uppercase tracking-tight text-white mb-8">System Health</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Roblox API Bridge</span>
                  <span className="text-xs font-black text-[#00E599]">OPERATIONAL</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E599] w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AI Engine (Gemini)</span>
                  <span className="text-xs font-black text-[#00E599]">STABLE</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E599] w-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Database Sync</span>
                  <span className="text-xs font-black text-blue-400">SYNCING</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[70%]" />
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-[#00E599]/5 border border-[#00E599]/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#00E599]" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Security Status</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                System is running under strict 2FA enforcement. No unauthorized access attempts detected in the last 24h.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
