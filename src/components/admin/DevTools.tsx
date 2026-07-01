import React, { useState } from "react";
import { 
  Wrench, 
  Terminal, 
  Database, 
  Server, 
  Zap, 
  RefreshCw, 
  Cpu, 
  Activity,
  Play,
  Trash2,
  Bug,
  Globe
} from "lucide-react";
import { motion } from "motion/react";

export const DevTools: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);

  const runTest = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Developer Utilities</h1>
        <p className="text-sm text-white/40 font-medium tracking-wide">Internal system diagnostics, API testers, and low-level engine controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Status Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="text-md font-black uppercase tracking-tight text-white">Instance Status</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CPU Usage</span>
                  <span className="text-xs font-black text-white">12.4%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[12.4%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/20 font-mono">
                  <span>8 Cores / 16 Threads</span>
                  <span>Intel Xeon Gold</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Memory Allocation</span>
                  <span className="text-xs font-black text-white">2.4GB / 32GB</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[7.5%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/20 font-mono">
                  <span>DDR5-4800 ECC</span>
                  <span>Usage: 7.5%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Database", status: "Healthy", icon: Database },
                { label: "Cache", status: "Optimal", icon: Zap },
                { label: "Network", status: "1.2Gbps", icon: Globe },
                { label: "Storage", status: "14% Full", icon: Server },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col items-center text-center">
                    <Icon className="w-5 h-5 text-white/20 mb-2" />
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">{item.label}</p>
                    <p className="text-xs font-black text-white mt-1">{item.status}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Webhook Tester */}
          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <Bug className="w-5 h-5 text-amber-400" />
              <h3 className="text-md font-black uppercase tracking-tight text-white">Webhook Tester</h3>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-xs font-mono outline-none focus:border-[#00E599]/30 transition-all"
                />
                <button 
                  onClick={runTest}
                  disabled={isTesting}
                  className="px-6 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#00E599] transition-all flex items-center gap-2"
                >
                  {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Test
                </button>
              </div>

              <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-[11px] space-y-2 overflow-x-auto">
                <p className="text-[#00E599]">&gt; Initializing test sequence...</p>
                <p className="text-white/40">&gt; Target: Discord API Hook</p>
                <p className="text-white/40">&gt; Payload: {"{ \"content\": \"System Health Check\" }"}</p>
                {isTesting ? (
                  <p className="text-amber-400 animate-pulse">&gt; Transmitting...</p>
                ) : (
                  <p className="text-[#00E599]">&gt; Success: 204 No Content (OK)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Service Controls</h3>
            <div className="space-y-3">
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-[#00E599]/10 hover:border-[#00E599]/20 hover:text-[#00E599] transition-all flex items-center justify-between px-6 group">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-white/30 group-hover:text-[#00E599]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Restart Engine</span>
                </div>
                <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 transition-all flex items-center justify-between px-6 group">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-white/30 group-hover:text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Flush Cache</span>
                </div>
                <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-between px-6 group">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-500/40 group-hover:text-red-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Purge Logs</span>
                </div>
                <ShieldAlert className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-[#00E599]/5 border border-[#00E599]/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-[#00E599]" />
              <h3 className="text-sm font-black uppercase tracking-tight text-white">Debug Mode</h3>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed mb-6">
              Enable verbose logging and exposed error stacks for all platform processes. Recommended only for active development.
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Debug Console</span>
              <div className="w-10 h-5 rounded-full bg-white/5 border border-white/10 relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldAlert: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
