import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  ArrowUpRight,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

export default function ChatWorkspace() {
  const [inputText, setInputText] = useState("");
  const [model, setModel] = useState("gemini");
  const [userAvatar, setUserAvatar] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527",
  );
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const avatar = localStorage.getItem("apex_avatar");
    const storedUsername = localStorage.getItem("apex_username");
    if (avatar) {
      setUserAvatar(avatar);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex bg-black min-h-screen text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#000000] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center gap-2 mb-6">
          {/* Logo */}
          <div className="w-8 h-8 rounded flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="font-extrabold tracking-tight text-lg uppercase flex items-center gap-2 text-white">
            Apex{" "}
            <span className="text-[10px] font-medium px-2 py-[1px] rounded-full border border-white/20 text-white/70 tracking-normal lowercase">
              beta
            </span>
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto">
          <button className="flex items-center gap-3 px-3 py-2.5 text-white/90 hover:text-white transition-colors w-full text-left rounded-lg bg-white/10 border border-white/10 mb-4">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
          <span className="text-[11px] text-white/40 font-bold px-2 uppercase tracking-widest mb-2">
            Recent
          </span>
          <button className="flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white/80 transition-colors w-full text-left rounded-lg">
            <span className="text-sm">Combat System</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white/80 transition-colors w-full text-left rounded-lg">
            <span className="text-sm">Round Manager</span>
          </button>
        </div>

        <div className="p-4 mt-auto">
          <button className="w-full bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 rounded-xl p-3 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#5865F2] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white">Discord</span>
                <span className="text-[10px] text-white/50">
                  Join for gifts
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-white/30" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-0">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute top-[-20%] left-[10%] w-[1000px] h-[1000px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        </div>

        {/* Header */}
        <header className="h-[60px] flex items-center justify-end px-6 z-10 w-full bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {!username ? (
              <button
                onClick={() => navigate("/sign-in")}
                className="text-white/60 hover:text-white font-medium uppercase tracking-widest px-4 py-2 text-[11px] transition-colors"
              >
                Roblox Connect
              </button>
            ) : (
              <span className="text-white/80 font-medium text-[13px] mr-2">
                {username}
              </span>
            )}

            <button
              onClick={() => {
                localStorage.removeItem("apex_username");
                localStorage.removeItem("apex_avatar");
                navigate("/");
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="w-[14px] h-[14px]" />
            </button>

            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center cursor-pointer overflow-hidden border border-white/10">
              <img
                src={userAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 w-full max-w-[700px] mx-auto mt-[-5vh]">
          <div className="w-16 h-16 rounded-3xl border border-white/10 bg-[#111111] flex items-center justify-center mb-8 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>

          <h1 className="text-[28px] md:text-[32px] font-semibold mb-8 tracking-tight text-white text-center">
            How can I help you build{" "}
            <span className="font-serif italic text-white/90 font-bold">
              today?
            </span>
          </h1>

          <div className="w-full relative">
            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl mb-4 w-fit mx-auto shadow-lg border border-white/5">
              <button
                onClick={() => setModel("gemini")}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2 ${model === "gemini" ? "bg-[#333333] text-white shadow-sm" : "text-white/50 hover:text-white/80"}`}
              >
                <span className="text-white/80">✧</span> Gemini
              </button>
              <button
                onClick={() => setModel("openai")}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2 ${model === "openai" ? "bg-[#333333] text-white shadow-sm" : "text-white/50 hover:text-white/80"}`}
              >
                <span className="text-white/80">◎</span> OpenAI
              </button>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl flex items-center overflow-hidden focus-within:ring-1 focus-within:ring-white/20 transition-all shadow-2xl min-h-[56px] relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message Apex AI..."
                className="flex-1 bg-transparent border-none outline-none py-4 px-5 text-white placeholder-white/40 text-[15px]"
              />
              <button className="mr-3 w-8 h-8 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center text-black transition-colors shadow-lg flex-shrink-0">
                <ArrowUpRight className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button className="bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222222] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
              <span className="text-base">🤺</span> Make a combat system
            </button>
            <button className="bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222222] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
              <span className="text-base">🗺️</span> Make a plot system
            </button>
            <button className="bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222222] text-white/70 rounded-full px-5 py-2.5 text-[13px] flex items-center gap-2 transition-all">
              <span className="text-base">🔁</span> Make a round system
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
