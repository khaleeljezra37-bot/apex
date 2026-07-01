import React, { useState } from "react";
import { 
  Radio, 
  Send, 
  Mail, 
  Globe, 
  MessageSquare, 
  Clock, 
  Bell, 
  ShieldAlert,
  Calendar,
  Layers,
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";

const channels = [
  { id: "app", label: "In-App Notification", icon: Bell },
  { id: "plugin", label: "Plugin Alert", icon: Layers },
  { id: "email", label: "Direct Email", icon: Mail },
  { id: "discord", label: "Discord Broadcast", icon: MessageSquare },
  { id: "global", label: "Global Maintenance", icon: ShieldAlert },
];

export const BroadcastCenter: React.FC = () => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["app"]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Broadcast Center</h1>
        <p className="text-sm text-white/40 font-medium tracking-wide">Push announcements, schedule maintenance and mass notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">1. Target Channels</label>
              <div className="flex flex-wrap gap-3">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  const isActive = selectedChannels.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all ${
                        isActive 
                          ? "bg-[#00E599]/10 border-[#00E599]/20 text-[#00E599]" 
                          : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{channel.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40">2. Compose Message</label>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject Header"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#00E599]/30 transition-all placeholder:text-white/20"
                />
                <textarea
                  placeholder="Your announcement message goes here. Support markdown and emojis."
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl py-4 px-6 text-sm outline-none focus:border-[#00E599]/30 transition-all placeholder:text-white/20 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                    isScheduled ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-white/5 border-white/5 text-white/40"
                  }`}
                 >
                   <Calendar className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{isScheduled ? "Scheduled" : "Send Now"}</span>
                 </button>
              </div>
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#00E599] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00E599]/90 transition-all shadow-[0_0_20px_#00E59930]">
                <Send className="w-4 h-4" />
                Initialize Broadcast
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d0e12] border border-white/5 rounded-3xl p-8">
            <h3 className="text-md font-black uppercase tracking-tight text-white mb-6">Recent Broadcasts</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-[#00E599]/20 bg-[#00E599]/10 text-[#00E599]">SENT</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">2 hours ago</span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1">Infrastructure Upgrade v4.2</p>
                  <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">We have successfully deployed the latest security patches to the core engine...</p>
                </div>
              ))}
            </div>
            <button className="w-full py-3 mt-6 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              View History
            </button>
          </div>

          <div className="bg-[#00E599]/5 border border-[#00E599]/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-5 h-5 text-[#00E599]" />
              <h3 className="text-sm font-black uppercase tracking-tight text-white">Audience Reach</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white/40">Total Reach:</span>
                <span className="text-white">128,492 users</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white/40">Est. Delivery:</span>
                <span className="text-white">~45 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
