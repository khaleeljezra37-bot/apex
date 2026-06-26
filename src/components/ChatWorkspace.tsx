import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Moon,
  MessageSquare,
  Settings,
  Bot,
  AtSign,
  Image as ImageIcon,
  ChevronDown,
  Database,
  ArrowRight,
  X,
} from "lucide-react";

export default function ChatWorkspace() {
  const [inputText, setInputText] = useState("");
  const [userAvatar, setUserAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527",
  );
  const [username, setUsername] = useState<string | null>(null);
  const [model, setModel] = useState<"Gemini Pro" | "OpenAI GPT-4">(
    "Gemini Pro",
  );
  const [activeSidebar, setActiveSidebar] = useState<
    "history" | "settings" | null
  >(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Uploaded images:", e.target.files);
    }
  };

  useEffect(() => {
    const checkOnboarding = () => {
      const isCompleted = localStorage.getItem("apex_onboarding_completed");
      if (!isCompleted) {
        if (!username && !localStorage.getItem("apex_username")) {
          setOnboardingStep(1);
        } else {
          setOnboardingStep(2);
        }
      } else {
        setOnboardingStep(0);
      }
    };
    const timer = setTimeout(checkOnboarding, 50);
    return () => clearTimeout(timer);
  }, [username]);

  const dismissOnboarding = () => {
    localStorage.setItem("apex_onboarding_completed", "true");
    setOnboardingStep(0);
  };

  useEffect(() => {
    const avatar = localStorage.getItem("apex_avatar");
    const storedUsername = localStorage.getItem("apex_username");
    
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (avatar && !avatar.includes("dicebear.com")) {
      setUserAvatar(avatar);
    } else if (storedUsername) {
      // Proactively try to fetch real avatar if currently using dicebear or missing
      console.log("Proactively fetching avatar for username:", storedUsername);
      fetch(`/api/auth/roblox/avatar-by-username/${storedUsername}`)
        .then(res => {
          console.log("Proactive fetch status:", res.status);
          return res.text();
        })
        .then(text => {
          console.log("Proactive fetch text:", text);
          try {
            const data = JSON.parse(text);
            if (data?.data?.[0]?.imageUrl) {
              const realAvatar = data.data[0].imageUrl;
              setUserAvatar(realAvatar);
              localStorage.setItem("apex_avatar", realAvatar);
              console.log("Proactively set avatar to:", realAvatar);
            } else if (avatar) {
              setUserAvatar(avatar);
            }
          } catch(e) {
            console.error("Failed to parse proactive fetch data:", e);
            if (avatar) setUserAvatar(avatar);
          }
        })
        .catch(err => {
          console.error("Auto-fetch avatar error:", err);
          if (avatar) setUserAvatar(avatar);
        });
    }
  }, []);

  return (
    <div className="flex bg-black min-h-screen text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[60px] bg-[#0a0a0a] border-r border-white/5 flex-col items-center py-6 hidden md:flex z-50">
        <div className="flex flex-col gap-4">
          <div className="relative group flex items-center">
            <button
              onClick={() =>
                setActiveSidebar(activeSidebar === "history" ? null : "history")
              }
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors border ${activeSidebar === "history" ? "bg-white/20 text-white border-white/10" : "bg-white/10 text-white hover:bg-white/20 border-white/5"}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="absolute left-14 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Chat History
            </div>
          </div>

          <div className="relative group flex items-center">
            <button
              onClick={() =>
                setActiveSidebar(
                  activeSidebar === "settings" ? null : "settings",
                )
              }
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors border ${activeSidebar === "settings" ? "bg-white/10 text-white border-white/5" : "text-white/50 hover:text-white hover:bg-white/5 border-transparent"}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="absolute left-14 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Settings
            </div>
          </div>


        </div>
      </aside>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-[60px] h-full bg-[#111111] border-r border-white/5 z-40 transition-transform duration-300 ease-in-out ${activeSidebar ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "300px" }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">
              {activeSidebar === "history" && "Chat History"}
              {activeSidebar === "settings" && "Settings"}
            </h2>
            <button
              onClick={() => setActiveSidebar(null)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSidebar === "history" && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setActiveSidebar(null)}
                  className="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> New Chat
                </button>
                <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-white/30" />
                  </div>
                  <p className="text-sm text-white/60 font-medium">
                    No recent chats
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    Your conversation history will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeSidebar === "settings" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 font-bold uppercase tracking-wider">
                    Theme
                  </label>
                  <select className="bg-[#222] border border-white/10 rounded-lg p-2 text-sm text-white outline-none">
                    <option>Dark Mode</option>
                    <option>Light Mode</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-white/50 font-bold uppercase tracking-wider">
                    Default Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as any)}
                    className="bg-[#222] border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                  >
                    <option>Gemini Pro</option>
                    <option>OpenAI GPT-4</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0">
        {/* Header */}
        <header className="h-[70px] flex items-center justify-between px-6 z-10 w-full">
          {/* Left Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white overflow-hidden">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 12 12 17 22 12" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 tracking-wide">
              beta
            </span>
            <span className="font-semibold text-[15px] text-white">Apex</span>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-4">
            <button className="bg-[#1fc66d] hover:bg-[#1bb363] text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors tracking-wide">
              Store Purchases
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Moon className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 relative">
              <div
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center cursor-pointer overflow-hidden border border-white/10 relative z-10"
                onClick={() => {
                  if (!username) {
                    navigate("/sign-in");
                  }
                }}
              >
                {username ? (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center text-xs">
                    ?
                  </div>
                )}
              </div>
              <AnimatePresence>
                {onboardingStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-[calc(100%+16px)] right-0 w-64 bg-[#111] border border-emerald-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] z-50 flex flex-col gap-2"
                  >
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-[#111] border-l border-t border-emerald-500/30 rotate-45"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-emerald-400 font-bold text-sm">Step 1: Connect Roblox</h3>
                      <button onClick={dismissOnboarding} className="text-white/40 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed relative z-10">
                      Sign in to your account to securely sync your Avatar and prepare your workspace.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 w-full max-w-[850px] mx-auto mt-[-5vh] relative">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="flex items-center justify-center gap-6 mb-4">
              {/* Logo Mark */}
              <div className="w-[80px] h-[80px] text-white flex items-center justify-center rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 12 12 17 22 12" />
                  <polyline points="2 17 12 22 22 17" />
                </svg>
              </div>

              <h1 className="text-[72px] font-extrabold tracking-tight text-white leading-none uppercase">
                Apex
              </h1>
            </div>
            <p className="text-[18px] text-white/50 font-medium tracking-wide">
              What do you want to build?
            </p>
          </div>

          <div className="w-full relative flex flex-col gap-4 max-w-[700px] mx-auto">
            {/* Input Box Area */}
            <div className="flex-1 w-full flex flex-col gap-2 relative">
              <div className="bg-[#111111] border border-white/10 rounded-2xl p-3 flex flex-col focus-within:border-white/30 focus-within:bg-[#151515] transition-all shadow-xl min-h-[140px] relative z-10">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your game idea..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-[16px] resize-none h-[60px] p-2 font-medium"
                />

                <div className="flex items-center justify-between mt-auto px-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/50 text-xs font-semibold hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" /> Add Assets
                    </button>
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative group/model">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/60 text-xs font-semibold hover:text-white hover:bg-white/5 transition-colors">
                        Model:{" "}
                        <span className="font-bold text-white">{model}</span>{" "}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute right-0 bottom-full mb-2 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl opacity-0 group-hover/model:opacity-100 transition-opacity pointer-events-none group-hover/model:pointer-events-auto z-50">
                        <button
                          onClick={() => setModel("Gemini Pro")}
                          className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors first:rounded-t-lg"
                        >
                          Gemini Pro
                        </button>
                        <button
                          onClick={() => setModel("OpenAI GPT-4")}
                          className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors last:rounded-b-lg"
                        >
                          OpenAI GPT-4
                        </button>
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white border border-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors ml-1 shadow-lg relative z-20">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {onboardingStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-[calc(100%+16px)] right-0 w-72 bg-[#111] border border-emerald-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] z-50 flex flex-col gap-2"
                  >
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-[#111] border-l border-t border-emerald-500/30 rotate-45"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-emerald-400 font-bold text-sm">Step 2: Start Building</h3>
                      <button onClick={dismissOnboarding} className="text-white/40 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed relative z-10">
                      Type a prompt like <i>"Make a round-based combat system"</i> and hit send. The AI will start building!
                    </p>
                    <button onClick={dismissOnboarding} className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors">
                      Got it, let's go!
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button className="bg-[#111] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
                🤺 Make a combat system
              </button>
              <button className="bg-[#111] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
                🗺️ Make a plot system
              </button>
              <button className="bg-[#111] border border-white/10 hover:border-white/20 hover:bg-[#1a1a1a] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
                🔁 Make a round system
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
