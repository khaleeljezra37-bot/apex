import React from "react";
import { 
  BarChart3, 
  Cpu, 
  Puzzle, 
  Globe, 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  MousePointer2,
  Users,
  Smartphone,
  Monitor
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion } from "motion/react";

const aiData = [
  { name: "00:00", prompts: 400, tokens: 2400 },
  { name: "04:00", prompts: 300, tokens: 1398 },
  { name: "08:00", prompts: 2000, tokens: 9800 },
  { name: "12:00", prompts: 2780, tokens: 3908 },
  { name: "16:00", prompts: 1890, tokens: 4800 },
  { name: "20:00", prompts: 2390, tokens: 3800 },
];

const trafficSources = [
  { name: "Direct", value: 45 },
  { name: "Organic", value: 30 },
  { name: "Social", value: 15 },
  { name: "Referral", value: 10 },
];

const COLORS = ["#00E599", "#00A3FF", "#8B5CF6", "#F59E0B"];

export const Analytics: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Advanced Analytics</h1>
        <p className="text-sm text-white/40 font-medium tracking-wide">Deep insights into AI usage, plugin performance and traffic metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-black uppercase tracking-tight text-white">AI Engine Performance</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Token consumption & prompt volume</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Avg Resp Time</p>
              <p className="text-xl font-black text-white mt-1">1.2s</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Tokens</p>
              <p className="text-xl font-black text-white mt-1">4.8M</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Failed Req</p>
              <p className="text-xl font-black text-red-400 mt-1">0.02%</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="tokens" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00E599]/10 border border-[#00E599]/20 flex items-center justify-center text-[#00E599]">
                <Puzzle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-md font-black uppercase tracking-tight text-white">Plugin Ecosystem</h3>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Install growth & sync requests</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#00E599]/5 border border-[#00E599]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-white uppercase tracking-wider">Sync Success Rate</span>
                <span className="text-xl font-black text-[#00E599]">99.8%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "99.8%" }}
                  className="h-full bg-[#00E599]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Connections</p>
                <p className="text-2xl font-black text-white">8,241</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this week
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01]">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Daily Sync Req</p>
                <p className="text-2xl font-black text-white">124k</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.4% today
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00A3FF]/10 border border-[#00A3FF]/20 flex items-center justify-center text-[#00A3FF]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-md font-black uppercase tracking-tight text-white">Website Traffic & Audience</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Visitor demographics & sources</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficSources}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="#00E599" radius={[4, 4, 0, 0]}>
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Total Visitors</span>
              </div>
              <span className="text-sm font-black text-white">1.2M</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Desktop</span>
              </div>
              <span className="text-sm font-black text-white">65%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Mobile</span>
              </div>
              <span className="text-sm font-black text-white">35%</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Avg Session</span>
              </div>
              <span className="text-sm font-black text-white">4m 22s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
