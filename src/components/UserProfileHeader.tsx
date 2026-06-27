import React from "react";
import { LogOut } from "lucide-react";

interface UserProfileHeaderProps {
  username: string;
  avatar: string;
  onLogOut?: () => void;
}

export function UserProfileHeader({ username, avatar, onLogOut }: UserProfileHeaderProps) {
  if (!username) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
      <div className="relative">
        <img
          src={avatar}
          alt={username}
          className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-lg"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=232527`;
          }}
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0A0B] rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">
          Connected As
        </span>
        <span className="text-sm font-bold text-white tracking-tight leading-none">
          {username}
        </span>
      </div>
      {onLogOut && (
        <button 
          onClick={onLogOut}
          className="ml-2 p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors flex items-center justify-center border border-white/5"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
