import React from "react";
import { LogOut } from "lucide-react";

interface UserProfileHeaderProps {
  username: string;
  avatar: string;
  onLogOut?: () => void;
  theme?: "dark" | "white" | "gray";
}

export function UserProfileHeader({ username, avatar, onLogOut, theme = "dark" }: UserProfileHeaderProps) {
  if (!username) return null;

  return (
    <div className={`flex items-center gap-3 px-4 py-2 backdrop-blur-md border rounded-full transition-colors ${
      theme === "white" ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"
    }`}>
      <div className="relative">
        <img
          src={avatar}
          alt={username}
          className={`w-8 h-8 rounded-full object-cover border shadow-lg ${
            theme === "white" ? "border-gray-300" : "border-white/20"
          }`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=232527`;
          }}
        />
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
          theme === "white" ? "border-white" : "border-[#0A0A0B]"
        }`} />
      </div>
      <div className="flex flex-col">
        <span className={`text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1 ${
          theme === "white" ? "text-gray-400" : "text-white/40"
        }`}>
          Connected As
        </span>
        <span className={`text-sm font-bold tracking-tight leading-none ${
          theme === "white" ? "text-gray-900" : "text-white"
        }`}>
          {username}
        </span>
      </div>
      {onLogOut && (
        <button 
          onClick={onLogOut}
          className={`ml-2 p-1.5 rounded-full transition-colors flex items-center justify-center border ${
            theme === "white" 
              ? "bg-gray-200 border-gray-300 text-gray-500 hover:text-black" 
              : "bg-white/5 border-white/5 text-white/40 hover:text-white"
          }`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
