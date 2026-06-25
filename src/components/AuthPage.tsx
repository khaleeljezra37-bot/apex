import { useState } from "react";
import { ArrowLeft, ChevronDown, Blocks } from "lucide-react";
import { motion } from "motion/react";

export default function AuthPage({
  onLogin,
  onBack,
}: {
  onLogin: (user: any) => void;
  onBack: () => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Custom credentials inputs
  const clientId = "1434336652378086576";
  const redirectUri = "https://apex-rblx.vercel.app/dashboard";
  const oauthState = "5uz1gbhlzq9gb704dr7fhfey09bu4v3gcue4dhvb";
  const scopes = "openid profile";

  const handleOauth = () => {
    setIsConnecting(true);

    // Generate URL dynamically with user-defined client details
    const encodedRedirect = encodeURIComponent(redirectUri);
    const encodedState = encodeURIComponent(oauthState);
    const encodedScopes = encodeURIComponent(scopes);
    const authUrl = `https://authorize.roblox.com/?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirect}&scope=${encodedScopes}&state=${encodedState}&step=accountConfirm`;

    // Open in a new tab to avoid iframe security constraints (X-Frame-Options)
    window.open(authUrl, '_blank');
    setIsConnecting(false);
  };

  return (
    <div className="min-h-screen bg-[#000] font-sans text-white relative flex flex-col items-center pt-16 selection:bg-white/30 overflow-x-hidden">
      {/* Background FX Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest z-20 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full px-6 flex flex-col items-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase text-center mt-4 drop-shadow-xl">
          Establish Connection
        </h1>

        {/* Luminous High contrast sign in button */}
        <button
          onClick={handleOauth}
          disabled={isConnecting}
          className="w-[325px] bg-white text-black font-extrabold uppercase tracking-widest text-[11px] py-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-gray-100 active:scale-[0.98] transition-all flex justify-center items-center h-[56px] disabled:opacity-50 disabled:cursor-not-allowed mb-8 z-10"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
            </span>
          ) : (
            "Sign in with Roblox"
          )}
        </button>

        <div className="w-full max-w-[480px] flex flex-col items-center">
          <div className="flex items-center w-full mb-8">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="px-4 text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase">
              Grant Permission For
            </span>
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

          <div className="w-full border border-white/10 rounded-[24px] overflow-hidden bg-white/5 backdrop-blur-md mt-4">
            <div className="p-10 flex items-center justify-center relative backdrop-blur-3xl bg-black/20">
              <div className="flex items-center justify-center w-full max-w-[280px]">
                <div className="w-[64px] h-[64px] rounded-full bg-white/5 flex items-center justify-center shrink-0 z-10 border border-white/20 shadow-xl backdrop-blur-md">
                  <Blocks className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-white/10 via-white/50 to-white/10 relative -mx-2 z-0"></div>
                <div className="w-[64px] h-[64px] rounded-full bg-white/5 shrink-0 z-10 overflow-hidden border border-white/20 shadow-xl backdrop-blur-md flex items-center justify-center">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=b6e3f4"
                    alt="Roblox Avatar"
                    className="w-[120%] h-[120%] object-cover translate-y-1 mix-blend-luminosity opacity-80"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-6 bg-black/10 backdrop-blur-md">
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between font-bold text-white uppercase tracking-widest text-[12px] mb-2"
              >
                Your personal profile
                <ChevronDown
                  className={`w-4 h-4 text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>

              {expanded && (
                <div className="mt-6 space-y-5">
                  <div className="flex items-center text-[11px] font-bold text-white/30 uppercase tracking-widest pb-3 border-b border-white/5">
                    <div className="flex-1">Permission</div>
                    <div className="flex-[2]">Description</div>
                  </div>
                  <div className="flex items-start text-[13px]">
                    <div className="flex-1 text-white font-medium pt-0.5">
                      Read User ID
                    </div>
                    <div className="flex-[2] text-white/50 px-2 leading-relaxed">
                      View your Roblox User ID.
                    </div>
                  </div>
                  <div className="flex items-start text-[13px]">
                    <div className="flex-1 text-white font-medium pt-0.5">
                      Read Profile
                    </div>
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
