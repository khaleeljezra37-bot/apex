import React, { useState } from "react";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Download, 
  Filter,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  Mail,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const users = [
  { id: "1", username: "alex_dev", email: "alex@apex.ai", robloxId: "849201", plan: "Premium", status: "Active", country: "US", joinDate: "2024-03-12", lastLogin: "2 mins ago", avatar: "A" },
  { id: "2", username: "sarah_k", email: "sarah@apex.ai", robloxId: "382910", plan: "Free", status: "Active", country: "CA", joinDate: "2024-04-05", lastLogin: "14 mins ago", avatar: "S" },
  { id: "3", username: "neo_matrix", email: "neo@cyber.com", robloxId: "110293", plan: "Enterprise", status: "Active", country: "DE", joinDate: "2023-11-20", lastLogin: "Just now", avatar: "N" },
  { id: "4", username: "roblox_pro", email: "pro@rbx.net", robloxId: "992837", plan: "Premium", status: "Suspended", country: "UK", joinDate: "2024-01-15", lastLogin: "2 days ago", avatar: "R" },
  { id: "5", username: "pixel_master", email: "pixel@gmail.com", robloxId: "448291", plan: "Free", status: "Active", country: "JP", joinDate: "2024-05-01", lastLogin: "1 hour ago", avatar: "P" },
  { id: "6", username: "admin_tester", email: "test@apex.ai", robloxId: "000001", plan: "Enterprise", status: "Active", country: "US", joinDate: "2023-01-01", lastLogin: "5 mins ago", avatar: "T" },
];

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">User Management</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Manage platform users, permissions and access status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E599] text-black text-xs font-black uppercase tracking-widest hover:bg-[#00E599]/90 transition-all">
            <UserPlus className="w-3.5 h-3.5" />
            New User
          </button>
        </div>
      </div>

      <div className="bg-[#0d0e12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4 bg-white/[0.01]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-[#00E599]/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Roblox ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Plan</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Location</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white/60">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{user.username}</p>
                        <p className="text-[10px] text-white/30 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5 text-xs font-mono text-white/40">{user.robloxId}</td>
                  <td className="px-6 py-4 border-b border-white/5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                      user.plan === "Enterprise" ? "bg-purple-500/10 border-purple-500/20 text-purple-400" :
                      user.plan === "Premium" ? "bg-[#00E599]/10 border-[#00E599]/20 text-[#00E599]" :
                      "bg-white/5 border-white/10 text-white/40"
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-[#00E599]" : "bg-red-500"}`} />
                      <span className="text-xs font-bold text-white/60">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-white/20" />
                      <span className="text-xs font-bold text-white/60">{user.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-white/5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-[#00E599] transition-all">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-white/[0.01] flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Showing 1-6 of 1,284 users</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-[#00E599]/10 border border-[#00E599]/20 text-[#00E599] text-xs font-black">1</button>
            <button className="w-8 h-8 rounded-xl hover:bg-white/5 text-white/30 text-xs font-black transition-all">2</button>
            <button className="w-8 h-8 rounded-xl hover:bg-white/5 text-white/30 text-xs font-black transition-all">3</button>
            <button className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Globe: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
