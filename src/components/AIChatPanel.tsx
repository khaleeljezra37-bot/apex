import React, { useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import { cn } from "../lib/utils";
import type { AIProvider } from "../types";

interface ChatProps {
  onGenerated: (code: string) => void;
  onInject: () => void;
  connected: boolean;
}

export default function AIChatPanel({ onGenerated, connected }: ChatProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("gemini");

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aiModel: provider }),
      });

      const data = await res.json();
      if (data.error) {
        console.error("API Error:", data.error);
        alert("Failed to generate: " + data.error);
      } else if (data.code) {
        onGenerated(data.code);
        // Optionally inject automatically if connected, but let's give the user control in CodePreview
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group form-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white/90 flex items-center text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              Intelligence Setup
            </h3>
          </div>
          <div className="flex gap-2 bg-[#000] p-1 rounded-full border border-white/10 w-fit shadow-inner">
            <button
              onClick={() => setProvider("gemini")}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                provider === "gemini" ? "bg-white/10 shadow-lg text-white border border-white/10" : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >
              Gemini 2.5
            </button>
            <button
              onClick={() => setProvider("openai")}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider",
                provider === "openai" ? "bg-white/10 shadow-lg text-white border border-white/10" : "text-white/30 hover:text-white/60 hover:bg-white/5"
              )}
            >
              GPT-4o
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col justify-end relative z-10">
        <div className="space-y-4">
          {/* Example Prompts */}
          <div className="flex flex-col gap-3 pt-4">
            <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-1">Architecture Blueprints</span>
            <button 
              onClick={() => setPrompt("Create a round-based mini-game loop with a lobby system, keeping state in ServerStorage.")}
              className="group/btn text-left px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-sm font-medium text-white/60 hover:text-white/90 transition-all shadow-md flex items-center justify-between"
            >
              <span>Create a round-based mini-game loop with a lobby system</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity">
                 <Send className="w-3 h-3 text-white/50" />
              </div>
            </button>
            <button 
              onClick={() => setPrompt("Make a working dash mechanic with stamina UI updates.")}
              className="group/btn text-left px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-sm font-medium text-white/60 hover:text-white/90 transition-all shadow-md flex items-center justify-between"
            >
              <span>Make a working dash mechanic with stamina UI updates</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity">
                 <Send className="w-3 h-3 text-white/50" />
              </div>
            </button>
            <button 
              onClick={() => setPrompt("Create a server script that saves player gold to a Datastore on exit.")}
              className="group/btn text-left px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-sm font-medium text-white/60 hover:text-white/90 transition-all shadow-md flex items-center justify-between"
            >
              <span>Create a server script that saves player gold to a Datastore</span>
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity">
                 <Send className="w-3 h-3 text-white/50" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-b from-transparent to-black/80 relative z-10">
        <form onSubmit={handleGenerate} className="relative flex items-center group/form">
          {/* Inner Glow effect on hover */}
          <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover/form:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none rounded-[2rem]" />
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={connected ? "Describe the mechanic (Will inject to Studio)..." : "Specify the system architecture..."}
            className="w-full resize-none min-h-[64px] max-h-40 bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-[2rem] py-4 pl-6 pr-16 text-[15px] font-medium text-white placeholder-white/30 outline-none transition-all custom-scrollbar shadow-inner"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white text-black hover:bg-gray-200 disabled:bg-white/10 disabled:text-white/30 rounded-full transition-all hover:scale-110 active:scale-95 shadow-xl"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
