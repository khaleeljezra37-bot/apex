import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  CreditCard, 
  Calendar,
  Wallet,
  ArrowRightLeft,
  RefreshCw,
  MoreVertical,
  TrendingUp,
  Inbox
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
import { fetchRevenue } from "../../lib/api";

export const RevenueView: React.FC = () => {
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchRevenue();
      setRevenue(data);
    } catch (err) {
      setError("Failed to fetch financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = revenue.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const premiumRevenue = revenue.filter(r => r.type === "subscription").reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const adRevenue = revenue.filter(r => r.type === "ad").reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const cards = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "Ad Revenue", value: `$${adRevenue.toLocaleString()}`, icon: CreditCard },
    { label: "Premium Subs", value: `$${premiumRevenue.toLocaleString()}`, icon: Wallet },
    { label: "Transactions", value: revenue.length.toString(), icon: ArrowRightLeft },
  ];

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Revenue Control</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Financial auditing, subscription tracking and payout status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all text-white/60">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 Days
          </button>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E599] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00E599]/90 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync Data
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
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">{card.label}</p>
              <h3 className="text-2xl font-black text-white mt-1.5">{loading ? "..." : card.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {loading ? (
        <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
      ) : revenue.length === 0 ? (
        <div className="bg-[#0d0e12] border border-dashed border-white/10 rounded-[40px] p-32 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-white/10" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">No Financial activity recorded</h2>
          <p className="text-sm text-white/40 font-medium max-w-md mt-4 leading-relaxed">
            The platform hasn't processed any transactions yet. Revenue, subscriptions, and payout data will populate here as the ecosystem grows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {revenue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{item.type === "subscription" ? "Premium Subscription" : "Ad Revenue Entry"}</p>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{item.userId || "System Pool"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">+${item.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Revenue Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Premium Subscriptions</span>
                  <span className="text-xs font-black text-white">${premiumRevenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00E599]" style={{ width: `${(premiumRevenue / (totalRevenue || 1)) * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Ad Revenue</span>
                  <span className="text-xs font-black text-white">${adRevenue.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00A3FF]" style={{ width: `${(adRevenue / (totalRevenue || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
