import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Wallet,
  ArrowRightLeft,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "motion/react";

const revenueHistory = [
  { month: "Jan", revenue: 12400, premium: 8000, ads: 4400 },
  { month: "Feb", revenue: 15600, premium: 10000, ads: 5600 },
  { month: "Mar", revenue: 18900, premium: 12000, ads: 6900 },
  { month: "Apr", revenue: 24200, premium: 18000, ads: 6200 },
  { month: "May", revenue: 21500, premium: 15000, ads: 6500 },
  { month: "Jun", revenue: 32800, premium: 24000, ads: 8800 },
];

const cards = [
  { label: "Monthly Revenue", value: "$32,840", change: "+14.2%", trend: "up", icon: DollarSign },
  { label: "Ad Revenue", value: "$8,820", change: "+5.1%", trend: "up", icon: CreditCard },
  { label: "Premium Subs", value: "$24,020", change: "+18.4%", trend: "up", icon: Wallet },
  { label: "Avg Sale Value", value: "$12.42", change: "-0.5%", trend: "down", icon: ArrowRightLeft },
];

export const RevenueView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Revenue Control</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Financial auditing, subscription tracking and payout status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E599] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00E599]/90 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Stripe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0d0e12] border border-white/5 p-6 rounded-3xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-white/40 group-hover:text-[#00E599] group-hover:border-[#00E599]/20 transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${
                  card.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {card.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </div>
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">{card.label}</p>
              <h3 className="text-2xl font-black text-white mt-1.5">{card.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-md font-black uppercase tracking-tight text-white">Revenue History</h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Growth over time</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E599]" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Ads</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueHistory}>
              <defs>
                <linearGradient id="revenuePremium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E599" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00E599" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="revenueAds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A3FF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00A3FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#ffffff20", fontSize: 10, fontWeight: 700 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0a0a0c", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="premium" stroke="#00E599" strokeWidth={3} fillOpacity={1} fill="url(#revenuePremium)" />
              <Area type="monotone" dataKey="ads" stroke="#00A3FF" strokeWidth={3} fillOpacity={1} fill="url(#revenueAds)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
          <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Payment from alex_dev</p>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Premium Yearly Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">+$99.00</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
          <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Subscription Distribution</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Premium Monthly</span>
                <span className="text-xs font-black text-white">1,242 users</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00E599] w-[45%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Premium Yearly</span>
                <span className="text-xs font-black text-white">842 users</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A3FF] w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Enterprise</span>
                <span className="text-xs font-black text-white">124 users</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[20%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
