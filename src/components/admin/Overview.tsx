import React from "react";
import { 
  Users, 
  Activity, 
  Cpu, 
  DollarSign, 
  Globe, 
  ShieldCheck, 
  Puzzle, 
  Folder, 
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
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

const stats = [
  { label: "Total Users", value: "128,492", change: "+12.5%", trend: "up", icon: Users },
  { label: "Active Today", value: "14,821", change: "+5.2%", trend: "up", icon: Activity },
  { label: "Online Now", value: "842", change: "-2.1%", trend: "down", icon: Globe },
  { label: "AI Generations", value: "1.2M", change: "+18.3%", trend: "up", icon: Cpu },
  { label: "Plugin Installs", value: "42,109", change: "+8.7%", trend: "up", icon: Puzzle },
  { label: "Active Projects", value: "3,842", change: "+4.1%", trend: "up", icon: Zap },
  { label: "API Requests", value: "8.4M", change: "+22.4%", trend: "up", icon: Activity },
  { label: "Revenue", value: "$42,840", change: "+14.2%", trend: "up", icon: DollarSign },
  { label: "Premium Users", value: "12,402", change: "+6.8%", trend: "up", icon: ShieldCheck },
  { label: "Monthly Traffic", value: "2.4M", change: "+3.2%", trend: "up", icon: Activity },
  { label: "Bounce Rate", value: "24.2%", change: "-1.5%", trend: "up", icon: Activity },
  { label: "Uptime", value: "99.99%", change: "stable", trend: "up", icon: ShieldCheck },
];

const growthData = [
  { name: "Mon", users: 4000, api: 2400 },
  { name: "Tue", users: 3000, api: 1398 },
  { name: "Wed", users: 2000, api: 9800 },
  { name: "Thu", users: 2780, api: 3908 },
  { name: "Fri", users: 1890, api: 4800 },
  { name: "Sat", users: 2390, api: 3800 },
  { name: "Sun", users: 3490, api: 4300 },
];

const pieData = [
  { name: "Premium", value: 400 },
  { name: "Free", value: 300 },
  { name: "Enterprise", value: 300 },
];

const COLORS = ["#00E599", "#00A3FF", "#8B5CF6"];

export const Overview: React.FC = () => {
  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Operations Control</h1>
        <p className="text-sm text-white/40 font-medium tracking-wide">Real-time system health and core metrics monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="w-12 h-12 text-[#00E599]" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 group-hover:text-[#00E599] group-hover:border-[#00E599]/20 transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
              </div>

              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-md font-black uppercase tracking-tight text-white">Platform Traffic</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">User growth & API requests</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00E599]" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
                <span className="text-[10px] font-bold text-white/40 uppercase">API</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E599" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00E599" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }}
                  itemStyle={{ fontSize: "12px", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="users" stroke="#00E599" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="api" stroke="#00A3FF" strokeWidth={3} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-md font-black uppercase tracking-tight text-white">Segment Distribution</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">User plan breakdown</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">{item.name}</p>
                    <p className="text-sm font-black text-white">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
