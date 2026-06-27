import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  Settings,
  Bot,
  AtSign,
  Image as ImageIcon,
  ChevronDown,
  Database,
  ArrowRight,
  X,
  Palette,
} from "lucide-react";
import { UserProfileHeader } from "./UserProfileHeader";

type Theme = "dark" | "white" | "gray";

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
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("apex_theme");
      if (saved === "dark" || saved === "white" || saved === "gray") return saved;
    }
    return "dark";
  });
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

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
    const robloxId = localStorage.getItem("apex_roblox_id");
    
    console.log("ChatWorkspace init:", { storedUsername, avatar, robloxId });

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If no username, we might be in a broken state
      console.warn("No username in ChatWorkspace, redirecting to sign-in");
      // Optionally navigate back if really needed, but let's try to recover first
    }

    if (avatar) {
      setUserAvatar(avatar);
    }
    
    // Proactively fetch real avatar if missing or generic
    const isGenericAvatar = !avatar || avatar.includes("dicebear.com") || avatar === "";
    
    if (robloxId && isGenericAvatar) {
      console.log("Proactively fetching avatar for robloxId:", robloxId);
      fetch(`/api/proxy/roblox/avatar/${robloxId}`)
        .then(res => res.json())
        .then(data => {
          if (data?.data?.[0]?.imageUrl) {
            const realAvatar = data.data[0].imageUrl;
            console.log("Found real avatar via ID:", realAvatar);
            setUserAvatar(realAvatar);
            localStorage.setItem("apex_avatar", realAvatar);
          }
        })
        .catch(err => console.error("Auto-fetch avatar error:", err));
    } else if (storedUsername && isGenericAvatar) {
      // Fallback to username search if ID is missing
      console.log("Proactively searching avatar for username:", storedUsername);
      fetch(`/api/auth/roblox/avatar-by-username/${storedUsername}`)
        .then(res => res.json())
        .then(data => {
          if (data?.data?.[0]?.imageUrl) {
            const realAvatar = data.data[0].imageUrl;
            console.log("Found real avatar via username search:", realAvatar);
            setUserAvatar(realAvatar);
            localStorage.setItem("apex_avatar", realAvatar);
          }
        })
        .catch(err => console.error("Auto-fetch avatar error (username):", err));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeOpen(false);
      }
    };
    if (isThemeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeOpen]);

  const handleThemeChange = (newTheme: Theme) => {
    console.log("Changing theme to:", newTheme);
    setTheme(newTheme);
    localStorage.setItem("apex_theme", newTheme);
    setIsThemeOpen(false);
  };

  const handleLogOut = () => {
    localStorage.removeItem("apex_username");
    localStorage.removeItem("apex_avatar");
    localStorage.removeItem("apex_roblox_id");
    localStorage.removeItem("apex_code_verifier");
    window.location.reload();
  };

  return (
    <div className={`flex min-h-screen font-sans overflow-hidden transition-colors duration-500 ${
      theme === "dark" ? "bg-black text-white" : 
      theme === "white" ? "bg-white text-gray-900" : 
      "bg-[#151719] text-gray-100"
    }`}>
      {/* Sidebar */}
      <aside className={`w-[60px] border-r flex-col items-center py-6 hidden md:flex z-50 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a] border-white/5" :
        theme === "white" ? "bg-gray-50 border-gray-200" :
        "bg-[#1c1e20] border-white/10"
      }`}>
        <div className="flex flex-col gap-4">
          <div className="relative group flex items-center">
            <button
              onClick={() =>
                setActiveSidebar(activeSidebar === "history" ? null : "history")
              }
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors border ${
                activeSidebar === "history" 
                  ? (theme === "white" ? "bg-gray-200 text-black border-gray-300" : "bg-white/20 text-white border-white/10") 
                  : (theme === "white" ? "bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200" : "bg-white/10 text-white hover:bg-white/20 border-white/5")
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className={`absolute left-14 px-2 py-1 border text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl ${
              theme === "white" ? "bg-white border-gray-200 text-gray-900" : "bg-[#1a1a1a] border-white/10 text-white"
            }`}>
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
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors border ${
                activeSidebar === "settings" 
                  ? (theme === "white" ? "bg-gray-200 text-black border-gray-300" : "bg-white/10 text-white border-white/5") 
                  : (theme === "white" ? "text-gray-400 hover:text-black hover:bg-gray-100 border-transparent" : "text-white/50 hover:text-white hover:bg-white/5 border-transparent")
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className={`absolute left-14 px-2 py-1 border text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl ${
              theme === "white" ? "bg-white border-gray-200 text-gray-900" : "bg-[#1a1a1a] border-white/10 text-white"
            }`}>
              Settings
            </div>
          </div>


        </div>
      </aside>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-[60px] h-full border-r z-40 transition-all duration-300 ease-in-out ${activeSidebar ? "translate-x-0" : "-translate-x-full"} ${
          theme === "dark" ? "bg-[#111111] border-white/5" :
          theme === "white" ? "bg-white border-gray-200 shadow-2xl" :
          "bg-[#1c1e22] border-white/10"
        }`}
        style={{ width: "300px" }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-lg font-bold uppercase tracking-wider transition-colors ${
              theme === "white" ? "text-gray-900" : "text-white"
            }`}>
              {activeSidebar === "history" && "Chat History"}
              {activeSidebar === "settings" && "Settings"}
            </h2>
            <button
              onClick={() => setActiveSidebar(null)}
              className={`transition-colors ${theme === "white" ? "text-gray-400 hover:text-black" : "text-white/50 hover:text-white"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSidebar === "history" && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setActiveSidebar(null)}
                  className={`w-full font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-lg ${
                    theme === "white" ? "bg-gray-900 text-white hover:bg-black" : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> New Chat
                </button>
                <div className="flex flex-col items-center justify-center mt-10 text-center px-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    theme === "white" ? "bg-gray-100" : "bg-white/5"
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${theme === "white" ? "text-gray-300" : "text-white/30"}`} />
                  </div>
                  <p className={`text-sm font-medium transition-colors ${theme === "white" ? "text-gray-500" : "text-white/60"}`}>
                    No recent chats
                  </p>
                  <p className={`text-xs mt-1 transition-colors ${theme === "white" ? "text-gray-400" : "text-white/40"}`}>
                    Your conversation history will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeSidebar === "settings" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    theme === "white" ? "text-gray-400" : "text-white/50"
                  }`}>
                    Theme Appearance
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark", icon: Moon, label: "Dark" },
                      { id: "white", icon: Sun, label: "White" },
                      { id: "gray", icon: Palette, label: "Gray" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id as Theme)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                          theme === t.id
                            ? (theme === "white" ? "bg-gray-900 text-white border-black" : "bg-white text-black border-white")
                            : (theme === "white" ? "bg-white border-gray-200 text-gray-500 hover:border-gray-300" : "bg-[#1a1a1a] border-white/5 text-white/40 hover:border-white/20")
                        }`}
                      >
                        <t.icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                    theme === "white" ? "text-gray-400" : "text-white/50"
                  }`}>
                    Default Model
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { name: "Gemini Pro", icon: Bot },
                      { name: "OpenAI GPT-4", icon: Database },
                    ].map((m) => (
                      <button
                        key={m.name}
                        onClick={() => setModel(m.name as any)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
                          model === m.name
                            ? (theme === "white" ? "bg-gray-100 border-gray-300 text-black" : "bg-white/10 border-white/10 text-white")
                            : (theme === "white" ? "bg-white border-gray-100 text-gray-400 hover:border-gray-200" : "bg-transparent border-white/5 text-white/30 hover:border-white/10")
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <m.icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{m.name}</span>
                        </div>
                        {model === m.name && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`mt-auto pt-6 border-t ${theme === "white" ? "border-gray-100" : "border-white/5"}`}>
                  <button 
                    onClick={handleLogOut}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    Sign Out Account
                  </button>
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
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden transition-colors ${
              theme === "white" ? "bg-gray-100 text-gray-900" : "text-white"
            }`}>
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
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide transition-colors ${
              theme === "white" ? "bg-gray-100 text-gray-500" : "bg-white/10 text-white/80"
            }`}>
              beta
            </span>
            <span className={`font-semibold text-[15px] transition-colors ${
              theme === "white" ? "text-gray-900" : "text-white"
            }`}>Apex</span>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-4">
            <button className="bg-[#1fc66d] hover:bg-[#1bb363] text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors tracking-wide">
              Store Purchases
            </button>
            
            <div className="relative" ref={themeRef}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsThemeOpen(!isThemeOpen);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  theme === "white" ? "border-gray-200 text-gray-500 hover:bg-gray-100" : "border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {theme === "dark" && <Moon className="w-4 h-4" />}
                {theme === "white" && <Sun className="w-4 h-4" />}
                {theme === "gray" && <Palette className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {isThemeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute top-full right-0 mt-2 w-32 rounded-xl border p-1 shadow-xl z-50 ${
                      theme === "white" ? "bg-white border-gray-200" : "bg-[#111] border-white/10"
                    }`}
                  >
                    {[
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "white", label: "White", icon: Sun },
                      { id: "gray", label: "Gray", icon: Palette },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id as Theme)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          theme === t.id 
                            ? (theme === "white" ? "bg-gray-100 text-black" : "bg-white/10 text-white")
                            : (theme === "white" ? "hover:bg-gray-50 text-gray-500" : "hover:bg-white/5 text-white/50")
                        }`}
                      >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              {username ? (
                <UserProfileHeader theme={theme} username={username} avatar={userAvatar} onLogOut={handleLogOut} />
              ) : (
                <button 
                  onClick={() => navigate("/sign-in")}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors shadow-lg shadow-white/5"
                >
                  Sign In
                </button>
              )}
              <AnimatePresence>
                {onboardingStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute top-[calc(100%+16px)] right-0 w-64 border rounded-xl p-4 shadow-2xl z-50 flex flex-col gap-2 transition-colors ${
                      theme === "white" ? "bg-white border-emerald-500/50 shadow-emerald-500/10" : "bg-[#111] border-emerald-500/30 shadow-emerald-500/5"
                    }`}
                  >
                    <div className={`absolute -top-2 right-3 w-4 h-4 border-l border-t rotate-45 ${
                      theme === "white" ? "bg-white border-emerald-500/50" : "bg-[#111] border-emerald-500/30"
                    }`}></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-emerald-500 font-bold text-sm">Step 1: Connect Roblox</h3>
                      <button onClick={dismissOnboarding} className={`transition-colors ${theme === "white" ? "text-gray-400 hover:text-black" : "text-white/40 hover:text-white"}`}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={`text-xs leading-relaxed relative z-10 transition-colors ${theme === "white" ? "text-gray-600" : "text-white/70"}`}>
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
              <div className={`w-[80px] h-[80px] flex items-center justify-center rounded-3xl border shadow-lg overflow-hidden transition-colors ${
                theme === "white" ? "bg-white border-gray-200 text-gray-900" : 
                theme === "gray" ? "bg-[#1c1e22] border-white/10 text-white shadow-black/20" :
                "bg-[#111] border-white/10 text-white shadow-white/5"
              }`}>
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

              <h1 className={`text-[72px] font-extrabold tracking-tight leading-none uppercase transition-colors ${
                theme === "white" ? "text-gray-900" : "text-white"
              }`}>
                Apex
              </h1>
            </div>
            <p className={`text-[18px] font-medium tracking-wide transition-colors ${
              theme === "white" ? "text-gray-500" : "text-white/50"
            }`}>
              What do you want to build?
            </p>
          </div>

          <div className="w-full relative flex flex-col gap-4 max-w-[700px] mx-auto">
            {/* Input Box Area */}
            <div className="flex-1 w-full flex flex-col gap-2 relative">
              <div className={`border rounded-2xl p-3 flex flex-col transition-all shadow-xl min-h-[140px] relative z-10 ${
                theme === "white" 
                  ? "bg-gray-50 border-gray-200 focus-within:border-gray-300 focus-within:bg-white" 
                  : theme === "gray"
                  ? "bg-[#1c1e22] border-white/10 focus-within:border-white/20 focus-within:bg-[#212428]"
                  : "bg-[#111111] border-white/10 focus-within:border-white/30 focus-within:bg-[#151515]"
              }`}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your game idea..."
                  className={`w-full bg-transparent border-none outline-none text-[16px] resize-none h-[60px] p-2 font-medium transition-colors ${
                    theme === "white" ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-white/30"
                  }`}
                />

                <div className="flex items-center justify-between mt-auto px-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        theme === "white" ? "text-gray-500 hover:text-black hover:bg-gray-200" : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
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
                      <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        theme === "white" ? "text-gray-500 hover:text-black hover:bg-gray-200" : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}>
                        Model:{" "}
                        <span className={`font-bold transition-colors ${theme === "white" ? "text-gray-900" : "text-white"}`}>{model}</span>{" "}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <div className={`absolute right-0 bottom-full mb-2 w-40 border rounded-xl shadow-xl opacity-0 group-hover/model:opacity-100 transition-opacity pointer-events-none group-hover/model:pointer-events-auto z-50 p-1 transition-colors ${
                        theme === "white" ? "bg-white border-gray-200" : "bg-[#1a1a1a] border-white/10"
                      }`}>
                        <button
                          onClick={() => setModel("Gemini Pro")}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors rounded-lg font-medium ${
                            theme === "white" 
                              ? "text-gray-600 hover:text-black hover:bg-gray-100" 
                              : "text-white/80 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Gemini Pro
                        </button>
                        <button
                          onClick={() => setModel("OpenAI GPT-4")}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors rounded-lg font-medium ${
                            theme === "white" 
                              ? "text-gray-600 hover:text-black hover:bg-gray-100" 
                              : "text-white/80 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          OpenAI GPT-4
                        </button>
                      </div>
                    </div>
                    <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ml-1 shadow-lg relative z-20 ${
                      inputText.length > 0
                        ? "bg-[#1fc66d] text-white hover:bg-[#1bb363] scale-105"
                        : theme === "white" ? "bg-gray-100 text-gray-400" : "bg-white/5 text-white/20"
                    }`}>
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
                    className={`absolute top-[calc(100%+16px)] right-0 w-72 border rounded-xl p-4 shadow-2xl z-50 flex flex-col gap-2 transition-colors ${
                      theme === "white" ? "bg-white border-emerald-500/50 shadow-emerald-500/10" : "bg-[#111] border-emerald-500/30 shadow-emerald-500/5"
                    }`}
                  >
                    <div className={`absolute -top-2 right-6 w-4 h-4 border-l border-t rotate-45 ${
                      theme === "white" ? "bg-white border-emerald-500/50" : "bg-[#111] border-emerald-500/30"
                    }`}></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-emerald-500 font-bold text-sm">Step 2: Start Building</h3>
                      <button onClick={dismissOnboarding} className={`transition-colors ${theme === "white" ? "text-gray-400 hover:text-black" : "text-white/40 hover:text-white"}`}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={`text-xs leading-relaxed relative z-10 transition-colors ${theme === "white" ? "text-gray-600" : "text-white/70"}`}>
                      Type a prompt like <i>"Make a round-based combat system"</i> and hit send. The AI will start building!
                    </p>
                    <button onClick={dismissOnboarding} className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold transition-colors">
                      Got it, let's go!
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button className={`border rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all shadow-sm ${
                theme === "white" 
                  ? "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50" 
                  : "bg-[#111] border-white/10 text-white/70 hover:border-white/20 hover:bg-[#1a1a1a]"
              }`}>
                🤺 Make a combat system
              </button>
              <button className={`border rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all shadow-sm ${
                theme === "white" 
                  ? "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50" 
                  : "bg-[#111] border-white/10 text-white/70 hover:border-white/20 hover:bg-[#1a1a1a]"
              }`}>
                🗺️ Make a plot system
              </button>
              <button className={`border rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all shadow-sm ${
                theme === "white" 
                  ? "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50" 
                  : "bg-[#111] border-white/10 text-white/70 hover:border-white/20 hover:bg-[#1a1a1a]"
              }`}>
                🔁 Make a round system
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
