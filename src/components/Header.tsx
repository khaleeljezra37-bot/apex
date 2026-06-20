import { useState } from "react";
import { User, LogOut, DownloadCloud, Play } from "lucide-react";
import { cn } from "../lib/utils";
import ConnectionModal from "./ConnectionModal";

interface HeaderProps {
  connected: boolean;
  setConnected: (state: boolean) => void;
  user?: { username: string, avatar: string } | null;
}

export default function Header({ connected, setConnected, user }: HeaderProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="h-20 w-full flex items-center justify-between px-6 lg:px-10 shrink-0 border-b border-white/5 bg-transparent relative z-20">
        <div className="flex items-center gap-4">
          {/* Mobile menu space fallback */}
          <h2 className="text-xl font-medium tracking-tight sm:hidden block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Apex Builder
          </h2>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            className="hidden sm:flex group items-center px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md shadow-lg"
          >
            <Play className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" fill="currentColor"/>
            <span className="text-sm font-semibold tracking-wide">Test in Studio</span>
          </button>

          <button 
            className="group flex flex-1 sm:flex-none items-center px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all backdrop-blur-md text-white hover:text-white shadow-lg"
          >
            <DownloadCloud className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold tracking-wide">Export Build</span>
          </button>

          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>

          {!connected ? (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center px-6 py-2.5 bg-white text-black hover:bg-gray-200 border border-white rounded-full transition-all font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95"
            >
              Connect Roblox
            </button>
          ) : (
            <button 
              onClick={() => setConnected(false)}
              title="Click to disconnect"
              className="flex items-center px-2 pr-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md group shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border border-white/20 flex items-center justify-center mr-3 overflow-hidden shadow-inner group/avatar relative">
                {user?.avatar ? (
                   <>
                    <img src={user.avatar} className="w-full h-full object-cover group-hover/avatar:hidden" alt="Profile" />
                    <LogOut className="w-4 h-4 text-red-400 hidden group-hover/avatar:block absolute z-10" />
                   </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-white group-hover/avatar:hidden" />
                    <LogOut className="w-4 h-4 text-red-400 hidden group-hover/avatar:block absolute z-10" />
                  </>
                )}
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[13px] font-bold text-white tracking-wider max-w-[120px] truncate">
                  {user?.username || 'Developer'}
                </span>
                <span className="text-[10px] text-white/70 mt-1 font-bold tracking-widest uppercase flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                  Connected
                </span>
              </div>
            </button>
          )}
        </div>
      </header>

      {showModal && (
        <ConnectionModal 
          onClose={() => setShowModal(false)} 
          onConnect={() => {
            setConnected(true);
            setShowModal(false);
          }} 
        />
      )}
    </>
  );
}
