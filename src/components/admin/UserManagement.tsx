import React, { useState, useEffect } from "react";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Download, 
  Filter,
  ShieldCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
  User,
  RefreshCw,
  Inbox
} from "lucide-react";
import { motion } from "motion/react";
import { fetchUsers } from "../../lib/api";

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    (u.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.robloxId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">User Management</h1>
          <p className="text-sm text-white/40 font-medium tracking-wide">Manage platform users, permissions and access status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadUsers}
            className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-white/40 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all text-white/60">
            <Download className="w-3.5 h-3.5" />
            Export
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
              placeholder="Search by name, email or Roblox ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs outline-none focus:border-[#00E599]/30 transition-all text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold text-white/50 hover:text-white transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Inbox className="w-8 h-8 text-white/10" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">No users found</h3>
            <p className="text-xs text-white/30 font-medium mt-2 max-w-xs">
              {searchTerm ? "Adjust your search filters to find what you're looking for." : "The platform hasn't recorded any user registrations yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Roblox ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Plan</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">Status</th>
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
                          {user.displayName?.[0] || user.email?.[0] || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{user.displayName || "Unknown"}</p>
                          <p className="text-[10px] text-white/30 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-white/5 text-xs font-mono text-white/40">{user.robloxId || "N/A"}</td>
                    <td className="px-6 py-4 border-b border-white/5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                        user.isPremium ? "bg-[#00E599]/10 border-[#00E599]/20 text-[#00E599]" : "bg-white/5 border-white/10 text-white/40"
                      }`}>
                        {user.isPremium ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-[#00E599]" : "bg-red-500"}`} />
                        <span className="text-xs font-bold text-white/60 uppercase">{user.status}</span>
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
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="p-6 bg-white/[0.01] flex items-center justify-between border-t border-white/5">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Showing {filteredUsers.length} users</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-xl bg-[#00E599]/10 border border-[#00E599]/20 text-[#00E599] text-xs font-black">1</button>
              <button className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
