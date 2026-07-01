import React from "react";
import { 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Monitor, 
  ShieldCheck,
  Moon,
  Sun
} from "lucide-react";
import { motion } from "motion/react";

interface TopNavProps {
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onLogout }) => {
  return (
    <header className="h-20 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00E599] transition-colors" />
          <input
            type="text"
            placeholder="Search users, plugins, logs..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-[#00E599]/30 focus:bg-white/[0.05] transition-all placeholder:text-white/20"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/30 font-mono">
            ⌘ K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-white/5 bg-white/5">
          <div className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Server: Online</span>
        </div>

        <div className="flex items-center gap-2 border-l border-white/5 pl-6">
          <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors relative group">
            <Bell className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500 border-2 border-[#0a0a0c]" />
          </button>
          
          <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <Moon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </button>

          <div className="flex items-center gap-3 ml-4 group cursor-pointer p-1.5 rounded-2xl hover:bg-white/5 transition-all">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E599] to-[#00A3FF] p-[1px]">
              <div className="w-full h-full rounded-[11px] bg-[#0a0a0c] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-white leading-none mb-1">Apex Admin</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Security Clearance</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="ml-2 p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
