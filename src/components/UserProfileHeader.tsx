import React from "react";

interface UserProfileHeaderProps {
  username: string;
  avatar: string;
}

export function UserProfileHeader({ username, avatar }: UserProfileHeaderProps) {
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
    </div>
  );
}
