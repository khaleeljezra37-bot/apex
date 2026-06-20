import { cn } from "../lib/utils";
import { LayoutDashboard, CodeXml, Box, Settings, Sparkles, Layers } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Layers, id: "layers", label: "Hierarchy" },
  { icon: LayoutDashboard, id: "workspace", label: "Workspace" },
  { icon: Box, id: "assets", label: "Assets" },
  { icon: CodeXml, id: "scripts", label: "Scripts" },
  { icon: Sparkles, id: "ai", label: "AI Assistant" },
  { icon: Settings, id: "settings", label: "Settings" },
];

export default function Sidebar({ user, active, setActive }: { user?: { username: string, avatar: string } | null, active: string, setActive: (v: string) => void }) {
  return (
    <aside className="w-[80px] h-full flex flex-col border-r border-[#1a1a1a] bg-[#0A0A0A] shrink-0 transition-all duration-300 z-10 hidden sm:flex items-center">
      <div className="p-6 flex items-center justify-center">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-lg shadow-black/50">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <nav className="flex-1 mt-6 flex flex-col space-y-4 w-full px-3 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative flex items-center justify-center w-full group outline-none"
            >
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ease-out",
                isActive 
                  ? "bg-gradient-to-b from-white/15 to-white/5 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-white" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}>
                <Icon className="w-[22px] h-[22px] shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              </div>
              
              {/* Custom Tooltip */}
              <div className="absolute left-[calc(100%+10px)] px-3 py-1.5 bg-[#1a1a1a] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all z-50 whitespace-nowrap shadow-xl pointer-events-none origin-left">
                  {item.label}
              </div>

              {isActive && (
                <div className="absolute -left-3 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pb-6 mt-auto">
        <button className="w-10 h-10 rounded-full border border-white/10 bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center group relative hover:scale-105 transition-all">
          <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="Profile" className="w-8 h-8 rounded-full mix-blend-luminosity group-hover:mix-blend-normal transition-all object-cover" />
           {/* Custom Tooltip */}
           <div className="absolute left-[calc(100%+10px)] px-3 py-1.5 bg-[#1a1a1a] border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all z-50 whitespace-nowrap shadow-xl pointer-events-none origin-left">
              {user?.username || "Guest"}
          </div>
        </button>
      </div>
    </aside>
  );
}
