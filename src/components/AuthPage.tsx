import { useState } from 'react';
import { ArrowLeft, ChevronDown, CheckCircle2, Lock, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function AuthPage({ onLogin, onBack }: { onLogin: (user: any) => void, onBack: () => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSimulatedOauth = () => {
    setIsConnecting(true);
    
    // Simulate successful connection immediately without opening a new window or redirecting.
    // This perfectly mimics the flow while preventing redirect URL issues in prototypes.
    setTimeout(() => {
      setIsConnecting(false);
      onLogin({
        username: "RobloxianDev_01",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527"
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative flex flex-col items-center pt-16">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-sm font-semibold"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl w-full px-6 flex flex-col items-center"
      >
        {/* App Logo/Icon Placeholder at top */}
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h1 className="text-[32px] font-bold text-slate-900 mb-8 tracking-tight">
          Welcome to Apex
        </h1>

        <button 
          onClick={handleSimulatedOauth}
          disabled={isConnecting}
          className="w-[320px] bg-[#00A2FF] text-white font-semibold text-[17px] py-4 rounded-full shadow-md hover:bg-[#008ce0] active:scale-[0.98] transition-all flex justify-center items-center h-[56px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isConnecting ? (
             <span className="flex items-center gap-2">
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
             </span>
          ) : (
             "Sign in with Roblox"
          )}
        </button>

        <div className="w-full max-w-[480px] mt-12 flex flex-col items-center">
          <div className="flex items-center w-full mb-8">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="px-4 text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase">Grant Permission For</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          <ul className="space-y-4 text-[15px] text-slate-600 mb-10 w-full pl-2">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-4 shrink-0"></span>
              We will take you to the official Roblox website.
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-4 shrink-0"></span>
              We only see your display name and avatar.
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 mr-4 shrink-0"></span>
              Check the image below to see how it works.
            </li>
          </ul>

          <div className="w-full border border-slate-200 rounded-[24px] overflow-hidden bg-slate-50">
            <div className="p-10 flex items-center justify-center relative bg-white">
               {/* Visual Diagram */}
               <div className="flex items-center justify-center w-full max-w-[280px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-slate-900 flex items-center justify-center shrink-0 z-10 
                      shadow-[0_0_0_6px_white,0_4px_12px_rgba(0,0,0,0.1)] left-icon z-20 relative">
                     <svg className="w-8 h-8 text-lime-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
                     </svg>
                  </div>
                  <div className="flex-1 h-[32px] bg-gradient-to-r from-blue-100 to-blue-500 relative flex items-center justify-center -mx-4 z-0">
                     <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="w-[64px] h-[64px] rounded-full bg-white shrink-0 z-10 overflow-hidden 
                      shadow-[0_0_0_6px_white,0_4px_12px_rgba(0,0,0,0.1)] z-20 relative border-2 border-slate-100">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=b6e3f4" alt="Roblox Avatar" className="w-full h-full object-cover scale-110 translate-y-1" />
                  </div>
               </div>
            </div>

            <div className="border-t border-slate-200 p-6 bg-white">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between font-semibold text-slate-800 text-[17px] mb-2"
              >
                Your personal profile
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              
              {expanded && (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center text-[13px] font-medium text-slate-400 pb-2 border-b border-slate-100">
                    <div className="flex-1">Permission</div>
                    <div className="flex-[2]">Description</div>
                    <div className="w-[100px] text-right flex items-center justify-end gap-1"><Shield className="w-3.5 h-3.5"/> Risk Level</div>
                  </div>

                  <div className="flex items-start text-[14px]">
                    <div className="flex-1 text-slate-800 font-medium pt-0.5">Read User ID</div>
                    <div className="flex-[2] text-slate-500 px-2 leading-relaxed">
                      View your Roblox User ID to know who you are.
                    </div>
                    <div className="w-[100px] text-right text-slate-600 flex items-center justify-end font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> Low
                    </div>
                  </div>

                  <div className="flex items-start text-[14px]">
                    <div className="flex-1 text-slate-800 font-medium pt-0.5">Read User Profile</div>
                    <div className="flex-[2] text-slate-500 px-2 leading-relaxed">
                      View your username, display name, and avatar.
                    </div>
                    <div className="w-[100px] text-right text-slate-600 flex items-center justify-end font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span> Low
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
