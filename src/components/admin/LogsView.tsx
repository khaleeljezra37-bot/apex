import React, { useState } from "react";
import { 
  Search, 
  Terminal, 
  Filter, 
  Download, 
  Trash2, 
  RefreshCw,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Puzzle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const logTypes = [
  { id: "all", label: "All Logs", icon: Terminal },
  { id: "auth", label: "Authentication", icon: ShieldCheck },
  { id: "plugin", label: "Plugin", icon: Puzzle },
  { id: "api", label: "API Requests", icon: Zap },
  { id: "discord", label: "Discord", icon: Globe },
  { id: "error", label: "Errors", icon: Cpu },
];

const mockLogs = [
  { id: 1, type: "auth", status: "success", message: "Admin session established from 192.168.1.1", time: "2024-06-30 14:22:01" },
  { id: 2, type: "api", status: "info", message: "POST /api/generate-script (200 OK) - duration: 42ms", time: "2024-06-30 14:21:55" },
  { id: 3, type: "error", status: "error", message: "Failed to connect to Discord Webhook: Timeout", time: "2024-06-30 14:21:30" },
  { id: 4, type: "plugin", status: "info", message: "Plugin v4.2.0 sync request received from ROBLOX_ID: 849201", time: "2024-06-30 14:20:12" },
  { id: 5, type: "auth", status: "warn", message: "Failed password attempt for user: super_admin", time: "2024-06-30 14:19:44" },
  { id: 6, type: "discord", status: "success", message: "Security alert broadcast sent to #admin-channel", time: "2024-06-30 14:18:05" },
  { id: 7, type: "api", status: "info", message: "GET /api/user-stats (200 OK) - duration: 12ms", time: "2024-06-30 14:17:22" },
  { id: 8, type: "plugin", status: "success", message: "New plugin install: ROBLOX_ID: 332810", time: "2024-06-30 14:16:55" },
];

export const LogsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = mockLogs.filter(log => {
    const matchesTab = activeTab === "all" || log.type === activeTab;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">System Logs</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Audit trails, error reports and real-time event streaming.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
            <Download className="w-3.5 h-3.5" />
            Download JSON
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {logTypes.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                isActive 
                  ? "bg-[#00E599]/10 border-[#00E599]/20 text-[#00E599]" 
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[#0d0e12] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-xs outline-none focus:border-[#00E599]/30 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
          {filteredLogs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-start gap-4 p-3 rounded-xl border border-white/[0.02] hover:bg-white/[0.02] transition-colors font-mono group"
            >
              <span className="text-[10px] text-white/20 shrink-0 w-40">[{log.time}]</span>
              <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 w-24 ${
                log.status === "error" ? "text-red-400" :
                log.status === "warn" ? "text-amber-400" :
                log.status === "success" ? "text-[#00E599]" :
                "text-blue-400"
              }`}>
                {log.status}
              </span>
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{log.message}</span>
            </motion.div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/20">
              <Terminal className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-xs font-black uppercase tracking-widest">No logs found matching query</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Stream: Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-black text-white/40 uppercase px-2">Page 1 of 42</span>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
