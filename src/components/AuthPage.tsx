import { useState } from 'react';
import { ArrowLeft, Globe, Key, Puzzle, Terminal, ExternalLink, Workflow, Settings2, Info, Copy, Check, AlertCircle } from "lucide-react";

export default function AuthPage({ onLogin, onBack }: { onLogin: (user: any) => void, onBack: () => void }) {
  const [activeMethod, setActiveMethod] = useState<'oauth' | 'cloud' | 'plugin'>('oauth');
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Custom credentials inputs
  const [clientId, setClientId] = useState('1434336652378086576');
  const [redirectUri, setRedirectUri] = useState('https://clerk.lemonade.gg/v1/oauth_callback');
  const [oauthState, setOauthState] = useState('5uz1gbhlzq9gb704dr7fhfey09bu4v3gcue4dhvb');

  const handleOauth = () => {
    // Generate URL dynamically with user-defined client details
    const encodedRedirect = encodeURIComponent(redirectUri);
    const encodedState = encodeURIComponent(oauthState);
    const authUrl = `https://authorize.roblox.com/?client_id=${clientId}&response_type=code&redirect_uri=${encodedRedirect}&scope=profile+openid&state=${encodedState}&step=accountConfirm`;
    
    const popup = window.open(authUrl, "RobloxAuth", "width=800,height=800");
    
    setIsConnecting(true);
    
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setIsConnecting(false);
        // Prompt custom mock user so they can proceed if they closed it
        const confirmSimulate = window.confirm("You closed the Roblox authentication popup. Would you like to simulate a successful connection with a developer avatar using your custom OAuth credentials?");
        if (confirmSimulate) {
          onLogin({
            username: "RobloxianDev_01",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527"
          });
        }
      }
    }, 500);
  };

  const handleAdvancedConnect = () => {
    if (activeMethod === 'cloud' && !apiKey) {
      alert("Please enter a valid Open Cloud API Key.");
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      onLogin({
        username: "asdadsadasda01",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527"
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#000] font-sans text-white relative flex flex-col">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      {/* Header */}
      <div className="px-8 pt-8 relative z-10 w-full max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-white/50 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 py-12 relative z-10 w-full max-w-7xl mx-auto gap-12 lg:gap-24">
        
        {/* Left side: Context */}
        <div className="flex-1 w-full relative">
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            Establish <br/> <span className="text-white/30">Connection.</span>
          </h1>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 relative overflow-hidden mt-12 shadow-2xl">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-white"></div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px]"></div>
             <div className="flex items-start gap-5">
                <Workflow className="w-6 h-6 shrink-0 mt-1 text-white/80" />
                <div>
                  <h3 className="font-bold uppercase tracking-widest text-[13px] mb-3">The Connection Way (Advanced)</h3>
                  <p className="text-white/50 leading-relaxed text-[15px]">
                    Apex can connect directly to your live Roblox place using a Roblox Studio Plugin or Roblox's Open Cloud API to inject scripts and assets automatically while Studio is open.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right side: Simplified OAuth Login */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6">
           <div className="border border-white/20 rounded-[2rem] bg-[#0a0a0a] shadow-[0_0_50px_rgba(255,255,255,0.03)] overflow-hidden">
              <div className="p-8 flex items-center gap-5 border-b border-white/5">
                 <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                   <Globe className="w-6 h-6 text-white" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold uppercase tracking-widest text-[14px]">Roblox Verification</h3>
                    <p className="text-[13px] text-white/50 tracking-wide mt-1.5">Authorize via official Roblox portal</p>
                 </div>
              </div>
              
              <div className="p-8 space-y-6">
                 <p className="text-[14px] text-white/50 leading-relaxed">
                   Log in securely to start turning your words into immersive Roblox worlds. We will request read-only access to verify your developer profile and enable game editing.
                 </p>

                 <button 
                   onClick={(e) => { e.stopPropagation(); handleOauth(); }}
                   disabled={isConnecting}
                   className="w-full py-4.5 bg-white text-black font-extrabold uppercase tracking-widest text-[11px] rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] shadow-lg hover:shadow-white/5"
                 >
                   {isConnecting ? (
                     <span className="flex items-center gap-2">
                       <span className="w-3.8 h-3.8 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                       Connecting Account...
                     </span>
                   ) : (
                     <>Connect Roblox Account <ExternalLink className="w-4 h-4"/></>
                   )}
                 </button>

                 {/* Simulated Login as backup fallback */}
                 <div className="text-center pt-2">
                   <button
                     onClick={() => {
                       onLogin({
                         username: "RobloxianDev_01",
                         avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527"
                       });
                     }}
                     className="text-[10px] text-white/45 hover:text-white underline font-extrabold uppercase tracking-widest transition-colors cursor-pointer"
                   >
                     Skip and Connect Instantly (Developer Mode)
                   </button>
                 </div>

                 {/* Troubleshooting Invalid Redirect URI */}
                 <div className="border-t border-white/5 pt-5 space-y-4">
                   <button 
                     onClick={() => setShowConfig(!showConfig)}
                     className="w-full py-2.5 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-amber-400 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                   >
                     <AlertCircle className="w-4 h-4 text-amber-400" />
                     {showConfig ? "Hide Setup Guide" : "Solve Invalid Redirect URI Error"}
                   </button>

                   {showConfig && (
                     <div className="text-[12px] bg-amber-950/20 border border-amber-500/15 rounded-2xl p-4.5 space-y-4 text-white/80 leading-relaxed">
                       <p className="font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px] mb-2">
                         <Info className="w-4 h-4 text-amber-400" />
                         Roblox Configuration Steps:
                       </p>
                       <p className="text-[11px] text-white/60">
                         Roblox blocks authorization unless the <strong>Authorized Redirect URI</strong> registered on your application Matches the client credentials.
                       </p>

                       <div className="space-y-3.5 pt-1">
                         {/* Dynamic Client ID input so they can inspect/change if needed */}
                         <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                           <label className="block text-[9px] font-extrabold text-white/40 uppercase tracking-widest mb-1.5">Application CLIENT ID:</label>
                           <input
                             type="text"
                             value={clientId}
                             onChange={(e) => setClientId(e.target.value)}
                             className="w-full bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-white/80 outline-none"
                             placeholder="Roblox client ID"
                           />
                         </div>

                         <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                           <label className="block text-[9px] font-extrabold text-white/40 uppercase tracking-widest mb-1.5">1. Custom Redirect URI:</label>
                           <div className="flex gap-2 items-center">
                             <input 
                               type="text" 
                               onChange={(e) => setRedirectUri(e.target.value)}
                               value={redirectUri}
                               className="flex-1 bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-white/80 select-all outline-none"
                             />
                             <button
                               onClick={() => {
                                 navigator.clipboard.writeText(redirectUri);
                                 setCopied(true);
                                 setTimeout(() => setCopied(false), 2000);
                               }}
                               className="p-2 border border-white/10 rounded bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                               title="Copy to clipboard"
                             >
                               {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/50" />}
                             </button>
                           </div>
                         </div>

                         <div className="bg-black/40 p-3.5 rounded-lg border border-white/5 space-y-2">
                           <span className="block text-[9px] font-extrabold text-white/40 uppercase tracking-widest">2. In Roblox Creator Hub:</span>
                           <ol className="list-decimal list-inside pl-1 text-[11px] text-white/60 space-y-1.5 leading-relaxed">
                             <li>Go to the <a href="https://create.roblox.com/dashboard/credentials" target="_blank" rel="noopener noreferrer" className="text-amber-300 font-bold underline hover:text-amber-200">Roblox Developer Console</a>.</li>
                             <li>Open your app (Client ID **{clientId}**).</li>
                             <li>Inside **OAuth 2.0 Applications**, click on the **Redirect URLs** tab.</li>
                             <li>Add/Paste the exact URL copied above (**{redirectUri || "entered above"}**) and click **Save**.</li>
                           </ol>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
