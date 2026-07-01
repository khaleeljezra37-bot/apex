import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Cpu, 
  Puzzle, 
  DollarSign, 
  ShieldAlert, 
  Terminal, 
  Wrench, 
  Radio, 
  Settings,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ai", label: "AI Center", icon: Cpu },
  { id: "plugin", label: "Plugin", icon: Puzzle },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "security", label: "Security", icon: ShieldAlert },
  { id: "logs", label: "Logs", icon: Terminal },
  { id: "developer", label: "Developer", icon: Wrench },
  { id: "broadcast", label: "Broadcast", icon: Radio },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0a0c] flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#00E599]/10 border border-[#00E599]/20 flex items-center justify-center text-[#00E599]">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-black tracking-tight text-white uppercase">Apex AI</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? "bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/10" 
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="text-xs font-bold tracking-wide">{item.label}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="w-1 h-1 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-[#0d0e12] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Load</span>
            <span className="text-[10px] font-bold text-[#00E599]">12%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "12%" }}
              className="h-full bg-[#00E599] shadow-[0_0_8px_#00E599]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
