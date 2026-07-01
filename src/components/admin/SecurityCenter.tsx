import React from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Globe, 
  Eye, 
  Activity,
  AlertTriangle,
  History,
  Terminal,
  Crosshair
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { motion } from "motion/react";

const threatData = [
  { subject: 'Brute Force', A: 120, fullMark: 150 },
  { subject: 'DDoS', A: 98, fullMark: 150 },
  { subject: 'XSS', A: 86, fullMark: 150 },
  { subject: 'SQLi', A: 99, fullMark: 150 },
  { subject: 'Malware', A: 85, fullMark: 150 },
  { subject: 'Phishing', A: 65, fullMark: 150 },
];

const loginAttempts = [
  { time: "12:00", attempts: 12 },
  { time: "13:00", attempts: 45 },
  { time: "14:00", attempts: 32 },
  { time: "15:00", attempts: 88 },
  { time: "16:00", attempts: 24 },
  { time: "17:00", attempts: 15 },
  { time: "18:00", attempts: 54 },
];

const securityAlerts = [
  { id: 1, type: "CRITICAL", message: "Multiple failed login attempts from IP 192.168.1.105", time: "2 mins ago", icon: AlertTriangle },
  { id: 2, type: "WARNING", message: "New admin login detected from unknown location: Berlin, DE", time: "14 mins ago", icon: Globe },
  { id: 3, type: "INFO", message: "Security patch v2.4.1 applied successfully", time: "1 hour ago", icon: ShieldCheck },
  { id: 4, type: "WARNING", message: "Rate limit exceeded for user: roblox_pro", time: "2 hours ago", icon: Activity },
];

export const SecurityCenter: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Security Defense</h1>
        <p className="text-sm text-white/40 font-medium tracking-wide">Infrastructure hardening, threat mitigation, and access auditing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-[#0d0e12] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-md font-black uppercase tracking-tight text-white">Threat Landscape</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active vector monitoring</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">High Alert</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#ffffff40", fontSize: 10, fontWeight: 700 }} />
                  <Radar
                    name="Threats"
                    dataKey="A"
                    stroke="#00E599"
                    fill="#00E599"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">DDoS Mitigation</p>
                    <p className="text-sm font-black text-white">Active (Filtering)</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-[#00E599] uppercase tracking-widest hover:underline">Config</button>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">2FA Enforcement</p>
                    <p className="text-sm font-black text-white">Global (100%)</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-[#00E599] uppercase tracking-widest hover:underline">Config</button>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">IP Whitelisting</p>
                    <p className="text-sm font-black text-white">32 Active Rules</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-[#00E599] uppercase tracking-widest hover:underline">Config</button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-md font-black uppercase tracking-tight text-white">Security Alerts</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Incident timeline</p>
            </div>
            <History className="w-4 h-4 text-white/20" />
          </div>

          <div className="flex-1 space-y-4">
            {securityAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="p-4 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                      alert.type === "CRITICAL" ? "bg-red-500/10 text-red-400" :
                      alert.type === "WARNING" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                          alert.type === "CRITICAL" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                          alert.type === "WARNING" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                          "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        }`}>
                          {alert.type}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{alert.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white/80 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full py-3 mt-6 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            View All Security Logs
          </button>
        </motion.div>
      </div>

      <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-md font-black uppercase tracking-tight text-white">Login Attempts (24h)</h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Authentication requests audit</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold text-white/50">
               Successful: 14.2k
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-bold text-red-400">
               Failed: 182
             </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loginAttempts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }}
              />
              <Bar dataKey="attempts" fill="#00E599" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
