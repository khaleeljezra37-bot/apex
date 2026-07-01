import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Cpu, 
  Puzzle, 
  Globe, 
  TrendingUp, 
  Clock, 
  Smartphone,
  Monitor,
  RefreshCw,
  Search,
  Activity
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
import { fetchAiRequests } from "../../lib/api";

export const Analytics: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAiRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to synchronize analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalTokens = requests.reduce((acc, curr) => acc + (curr.tokens || 0), 0);
  const avgResponseTime = requests.length > 0 
    ? (requests.reduce((acc, curr) => acc + (curr.responseTime || 0), 0) / requests.length).toFixed(2)
    : "0.0";
  const successRate = requests.length > 0
    ? ((requests.filter(r => r.status === "success").length / requests.length) * 100).toFixed(1)
    : "0.0";

  // Group by time for chart (simple mock grouping for now based on actual data if exists)
  const chartData = requests.slice(0, 10).reverse().map((r, i) => ({
    name: r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `T-${i}`,
    tokens: r.tokens || 0,
    time: r.responseTime || 0
  }));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Advanced Analytics</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Deep insights into AI usage, engine performance and model metrics.</p>
        </div>
        <button 
          onClick={loadData}
          className="p-3 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
          <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-[#0d0e12] border border-dashed border-white/10 rounded-[40px] p-32 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Cpu className="w-10 h-10 text-white/10" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-widest">No Intelligence Data recorded</h2>
          <p className="text-sm text-white/40 font-medium max-w-md mt-4 leading-relaxed">
            The AI engine hasn't processed any requests yet. Once users start generating content, deep behavioral analytics and performance metrics will appear here.
          </p>
        </div>
      ) : (
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
                <p className="text-xl font-black text-white mt-1">{avgResponseTime}s</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Tokens</p>
                <p className="text-xl font-black text-white mt-1">{totalTokens.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Success Rate</p>
                <p className={`text-xl font-black mt-1 ${parseFloat(successRate) > 95 ? "text-[#00E599]" : "text-amber-400"}`}>{successRate}%</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-black uppercase tracking-tight text-white">Recent Prompt Stream</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Real-time inference logs</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {requests.slice(0, 5).map((req, i) => (
                <div key={req.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{req.model || "Unknown Model"}</span>
                    <span className="text-[10px] font-bold text-[#00E599] uppercase">{req.tokens} Tokens</span>
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-1 italic text-white/60">"{req.prompt}"</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Status: {req.status}</span>
                    <span className="text-[9px] font-bold text-white/20 uppercase">{req.responseTime}s</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
