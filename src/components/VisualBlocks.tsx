import { Maximize2, GitMerge, Settings2, PlayCircle } from "lucide-react";

export default function VisualBlocks() {
  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden relative group font-sans shadow-2xl">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      {/* Very faint glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="absolute top-5 left-5 z-20 flex gap-3">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center shadow-lg shadow-black/50">
          <GitMerge className="w-4 h-4 mr-2 text-blue-400" />
          <span className="text-sm font-semibold text-white/90">Flow Logic</span>
        </div>
      </div>

      <div className="absolute top-5 right-5 z-20 flex gap-2">
        <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl transition-colors shadow-lg">
          <Settings2 className="w-4 h-4 text-white/70 hover:text-white" />
        </button>
        <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl transition-colors shadow-lg">
          <Maximize2 className="w-4 h-4 text-white/70 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center scale-90 md:scale-100">
        {/* Mock visual node blocks for Roblox setup */}
        <div className="relative w-[600px] h-[400px]">
           {/* Node 1 */}
           <div className="absolute top-16 left-10 w-56 bg-[#111] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden group/node">
             {/* Header */}
             <div className="bg-gradient-to-r from-blue-900/50 to-transparent border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                   <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Event trigger</span>
                </div>
                <PlayCircle className="w-4 h-4 text-white/30" />
             </div>
             {/* Body */}
             <div className="p-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="text-sm text-white font-medium mb-1">PlayerAdded</div>
                <div className="text-xs text-white/40">Fires when player joins</div>
             </div>
             {/* Output Port */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-[#111] border-2 border-blue-400 rounded-full z-10 shadow-[0_0_10px_rgba(96,165,250,0.5)] group-hover/node:scale-125 transition-transform cursor-pointer" />
           </div>

           {/* Connection Line */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             {/* Glow path */}
             <path d="M 270 120 C 350 120, 320 280, 400 280" fill="none" stroke="rgba(96,165,250,0.4)" strokeWidth="6" className="blur-sm" />
             {/* Main path */}
             <path d="M 270 120 C 350 120, 320 280, 400 280" fill="none" stroke="rgba(96,165,250,0.8)" strokeWidth="2" strokeDasharray="6 6" className="animate-[dash_1s_linear_infinite]" />
           </svg>

           {/* Node 2 */}
           <div className="absolute bottom-16 right-10 w-64 bg-[#111] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden group/node">
             {/* Input Port */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#111] border-2 border-emerald-400 rounded-full z-10 shadow-[0_0_10px_rgba(52,211,153,0.5)] group-hover/node:scale-125 transition-transform cursor-pointer" />
             
             {/* Header */}
             <div className="bg-gradient-to-r from-emerald-900/50 to-transparent border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                   <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Action</span>
                </div>
             </div>
             {/* Body */}
             <div className="p-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="text-sm text-white font-medium mb-3">GiveStarterGear()</div>
                <div className="bg-black/50 rounded-lg p-2 border border-white/5 group">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-white/50 font-mono">item</span>
                      <span className="text-emerald-300 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">"Sword"</span>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
