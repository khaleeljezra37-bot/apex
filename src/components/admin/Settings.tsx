import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Shield, 
  Zap, 
  Puzzle, 
  MessageSquare, 
  Save, 
  RefreshCw,
  Server,
  Database,
  Key,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "motion/react";

export const Settings: React.FC = () => {
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">System Configuration</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Adjust global parameters, API keys, and platform feature flags.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#00E599] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00E599]/90 transition-all shadow-[0_0_20px_#00E59930]">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Section */}
          <section className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-md font-black uppercase tracking-tight text-white">General Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Website Name</label>
                <input
                  type="text"
                  defaultValue="Apex AI Platform"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-[#00E599]/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Plugin Version</label>
                <input
                  type="text"
                  defaultValue="4.2.0-stable"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 px-5 text-sm outline-none focus:border-[#00E599]/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wide">Maintenance Mode</p>
                <p className="text-[10px] text-white/40 font-medium">Temporarily disable public access and plugin sync.</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-white/5 border border-white/10 relative transition-all">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white/20" />
              </button>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <Key className="w-5 h-5 text-[#00E599]" />
              <h3 className="text-md font-black uppercase tracking-tight text-white">API Integrations</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: "OpenAI Secret Key", value: "sk-proj-••••••••••••••••••••••••" },
                { label: "Gemini Pro API", value: "ai-gen-••••••••••••••••••••••••" },
                { label: "Discord Webhook URL", value: "https://discord.com/api/webhooks/••••••" },
              ].map((key) => (
                <div key={key.label} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">{key.label}</label>
                  <div className="relative">
                    <input
                      type={showKey === key.label ? "text" : "password"}
                      readOnly
                      value={key.value}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-5 pr-12 text-xs font-mono outline-none"
                    />
                    <button 
                      onClick={() => setShowKey(showKey === key.label ? null : key.label)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                      {showKey === key.label ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="text-md font-black uppercase tracking-tight text-white">Security Flags</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: "Enforce 2FA", enabled: true },
                { label: "Audit Logs", enabled: true },
                { label: "Auto-Ban Brute Force", enabled: true },
                { label: "IP Geofencing", enabled: false },
              ].map((flag) => (
                <div key={flag.label} className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{flag.label}</span>
                  <button className={`w-10 h-5 rounded-full relative transition-all ${flag.enabled ? 'bg-[#00E599]/20 border-[#00E599]/30' : 'bg-white/5 border-white/10'}`}>
                    <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${flag.enabled ? 'right-0.5 bg-[#00E599]' : 'left-0.5 bg-white/20'}`} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <RefreshCw className="w-5 h-5 text-amber-400" />
              <h3 className="text-md font-black uppercase tracking-tight text-white">System Tasks</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full py-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-left px-4 flex items-center justify-between group">
                Clear System Cache
                <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white transition-all" />
              </button>
              <button className="w-full py-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-left px-4 flex items-center justify-between group">
                Rebuild Search Index
                <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-white transition-all" />
              </button>
              <button className="w-full py-3 rounded-xl border border-red-500/10 bg-red-500/5 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all text-red-400/60 hover:text-red-400 text-left px-4 flex items-center justify-between group">
                Force Restart All Services
                <RefreshCw className="w-3 h-3 text-red-400/40 group-hover:text-red-400 transition-all" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
