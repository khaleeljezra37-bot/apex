import {
  Search,
  Download,
  Box,
  LayoutTemplate,
  Music,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

const mockAssets = [
  {
    id: 1,
    name: "Low Poly Trees",
    type: "model",
    icon: Box,
    creator: "Roblox",
    downloads: "1.2k",
  },
  {
    id: 2,
    name: "Modern UI Pack",
    type: "ui",
    icon: LayoutTemplate,
    creator: "Apex UX",
    downloads: "8.4k",
  },
  {
    id: 3,
    name: "Footsteps Audio",
    type: "audio",
    icon: Music,
    creator: "SoundMaster",
    downloads: "450",
  },
  {
    id: 4,
    name: "Sci-Fi Crate",
    type: "model",
    icon: Box,
    creator: "BuildBro",
    downloads: "3.1k",
  },
  {
    id: 5,
    name: "Inventory System UI",
    type: "ui",
    icon: LayoutTemplate,
    creator: "Apex UX",
    downloads: "12k",
  },
  {
    id: 6,
    name: "Dirt Texture 4K",
    type: "image",
    icon: ImageIcon,
    creator: "TexArts",
    downloads: "920",
  },
];

export default function AssetLibraryTab() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="flex-1 h-full w-full border border-white/5 bg-[#0a0a0a] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative z-10 hidden sm:flex">
      <div className="p-4 border-b border-white/5 bg-[#111]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[13px] uppercase tracking-widest text-white/80">
            Asset Library
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search Creator Marketplace..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-[13px] text-white focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 custom-scrollbar">
          {["all", "models", "ui", "audio", "images"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filter === f ? "bg-white text-black" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAssets.map((asset) => {
            const Icon = asset.icon;
            return (
              <div
                key={asset.id}
                className="border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all group flex flex-col cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center border border-white/10">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-white mb-1 truncate">
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-wider">
                    <span>By {asset.creator}</span>
                    <span>{asset.downloads} dl</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
