import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, CheckCircle2, Lock, Shield, Globe, Terminal, AlertCircle, Info, Copy, Check, Blocks } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AuthPage({ onLogin, onBack }: { onLogin: (user: any) => void, onBack: () => void }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showConfig, setShowConfig] = useState(true); // Open by default to help user set it up
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  // Custom credentials inputs
  const [clientId, setClientId] = useState('1434336652378086576');
  const [redirectUri, setRedirectUri] = useState(window.location.origin + '/');
  const [oauthState, setOauthState] = useState('5uz1gbhlzq9gb704dr7fhfey09bu4v3gcue4dhvb');
  const [scopes, setScopes] = useState('openid profile');

  const handleOauth = () => {
    setIsConnecting(true);
    
    // Generate URL dynamically with user-defined client details
    const encodedRedirect = encodeURIComponent(redirectUri);
    const encodedState = encodeURIComponent(oauthState);
    const encodedScopes = encodeURIComponent(scopes);
    const authUrl = `https://authorize.roblox.com/?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirect}&scope=${encodedScopes}&state=${encodedState}&step=accountConfirm`;
    
    // Open in same tab per user request
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-[#000] font-sans text-white relative flex flex-col items-center pt-16">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl w-full px-6 flex flex-col items-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase text-center mt-4">
          Establish Connection
        </h1>

        <button 
          onClick={handleOauth}
          disabled={isConnecting}
          className="w-[320px] bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-200 active:scale-[0.98] transition-all flex justify-center items-center h-[56px] disabled:opacity-70 disabled:cursor-not-allowed mb-6"
        >
          {isConnecting ? (
             <span className="flex items-center gap-2">
               <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
             </span>
          ) : (
             "Sign in with Roblox"
          )}
        </button>
        
        <div className="w-full max-w-[480px] flex flex-col items-center mt-2">
           <button 
             onClick={() => setShowConfig(!showConfig)}
             className="w-full py-2.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer mb-8"
           >
             <AlertCircle className="w-4 h-4 text-amber-400" />
             {showConfig ? "Hide Setup Guide" : "Solve Invalid Redirect URI Error"}
           </button>

           <AnimatePresence>
             {showConfig && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full text-[12px] bg-amber-950/20 border border-amber-500/15 rounded-2xl p-4.5 space-y-4 text-white/80 leading-relaxed mb-10 overflow-hidden">
                 <p className="font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px] mb-2 p-4 pt-1">
                   <Info className="w-4 h-4 text-amber-400" />
                   How to fix "Redirect URI is invalid":
                 </p>
                 <div className="px-4 pb-2 text-[11px] text-white/60">
                   1. Go to your <a href="https://create.roblox.com/dashboard/credentials" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Roblox Creator Dashboard</a>.<br/>
                   2. Select your OAuth Application (or create one).<br/>
                   3. Under <b>Redirect URIs</b>, add the exact URL below and save.
                 </div>
                 <div className="space-y-3.5 px-4 pb-4">
                   <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                     <label className="block text-[9px] font-extrabold text-white/40 uppercase tracking-widest mb-1.5">Application CLIENT ID:</label>
                     <input
                       type="text"
                       value={clientId}
                       onChange={(e) => setClientId(e.target.value)}
                       className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-white/80 outline-none"
                     />
                   </div>
                   <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                     <label className="block text-[9px] font-extrabold text-white/40 uppercase tracking-widest mb-1.5">REDIRECT URI:</label>
                     <div className="flex gap-2 items-center">
                       <input 
                         type="text" 
                         onChange={(e) => setRedirectUri(e.target.value)}
                         value={redirectUri}
                         className="flex-1 bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-white/80 select-all outline-none"
                       />
                       <button onClick={() => { navigator.clipboard.writeText(redirectUri); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 border border-white/10 rounded bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer">
                         {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
                       </button>
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

          <div className="flex items-center w-full mb-8">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="px-4 text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase">Grant Permission For</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <ul className="space-y-4 text-[14px] text-white/60 mb-10 w-full pl-6">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 mr-4 shrink-0"></span>
              We will take you to the official Roblox website.
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2 mr-4 shrink-0"></span>
              We only see your display name and avatar.
            </li>
          </ul>

          <div className="w-full border border-white/10 rounded-[24px] overflow-hidden bg-[#0A0A0A]">
            <div className="p-10 flex items-center justify-center relative bg-black">
               <div className="flex items-center justify-center w-full max-w-[280px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-[#111] flex items-center justify-center shrink-0 z-10 border border-white/10">
                     <Blocks className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-white/10 via-white/40 to-white/10 relative -mx-2 z-0"></div>
                  <div className="w-[64px] h-[64px] rounded-full bg-[#111] shrink-0 z-10 overflow-hidden border border-white/10 flex items-center justify-center">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=b6e3f4" alt="Roblox Avatar" className="w-[120%] h-[120%] object-cover translate-y-1" />
                  </div>
               </div>
            </div>

            <div className="border-t border-white/5 p-6 bg-[#050505]">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between font-bold text-white uppercase tracking-widest text-[12px] mb-2"
              >
                Your personal profile
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              
              {expanded && (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center text-[11px] font-bold text-white/30 uppercase tracking-widest pb-3 border-b border-white/5">
                    <div className="flex-1">Permission</div>
                    <div className="flex-[2]">Description</div>
                  </div>
                  <div className="flex items-start text-[13px]">
                    <div className="flex-1 text-white font-medium pt-0.5">Read User ID</div>
                    <div className="flex-[2] text-white/50 px-2 leading-relaxed">
                      View your Roblox User ID.
                    </div>
                  </div>
                  <div className="flex items-start text-[13px]">
                    <div className="flex-1 text-white font-medium pt-0.5">Read Profile</div>
                    <div className="flex-[2] text-white/50 px-2 leading-relaxed">
                      View your username, display name, and avatar.
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
