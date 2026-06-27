import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Gamepad2, Blocks, ArrowRight } from "lucide-react";

import bloxFruitsImg from "../assets/images/blox_fruits_1781920089623.jpg";
import gardenImg from "../assets/images/pet_simulator_1781920105990.jpg";
import petsImg from "../assets/images/adopt_me_1781920120266.jpg";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col font-sans selection:bg-white/30 overflow-hidden relative">
      {/* Background FX Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Sleek Minimal Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
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
          <span className="text-xl font-black tracking-tighter text-white uppercase">
            Apex
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://create.roblox.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Docs
          </a>
          <Link
            to="/privacy-policy"
            className="hidden lg:block text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/terms-of-service"
            className="hidden lg:block text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Terms
          </Link>
          <button
            onClick={() => navigate("/sign-in")}
            className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-5xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">
              Engine Online
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-white mb-8 text-center drop-shadow-2xl font-sans uppercase">
            Build Games <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              In Seconds.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed max-w-2xl text-center font-medium">
            Describe the world, mechanics, and style. Apex Engine writes the
            code and structures the game instantly. Pure black and white focus.
          </p>

          <form
            onSubmit={handleGenerate}
            className="w-full max-w-3xl relative group"
          >
            {/* Ambient glow behind input */}
            <div className="absolute -inset-1 bg-white/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative flex flex-col md:flex-row bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden focus-within:border-white/30 transition-colors">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A pirate combat game with physical fruit magic..."
                className="w-full bg-transparent text-white placeholder-white/30 outline-none py-5 px-6 text-lg"
              />
              <button
                type="submit"
                className="flex items-center justify-center px-8 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold transition-all whitespace-nowrap py-4 md:py-0 mt-2 md:mt-0 uppercase tracking-widest text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Initialize
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Combat RPG", "Tycoon", "Simulator", "Obby"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setPrompt(`Generate a ${tag.toLowerCase()} game where...`)
                  }
                  className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-colors bg-white/5 backdrop-blur-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </motion.div>

        {/* Floating Grayscale Visuals Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="w-full grid grid-cols-3 gap-6 mt-24 max-w-5xl"
        >
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
            <img
              src={bloxFruitsImg}
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="Blox Fruits"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <p className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-[#FFF]">
              Blox Fruits
            </p>
            <p className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10">
              Action / Combat
            </p>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group md:-translate-y-8">
            <img
              src={gardenImg}
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="Pet Simulator 99"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <p className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-[#FFF]">
              Pet Simulator
            </p>
            <p className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10">
              Simulation
            </p>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
            <img
              src={petsImg}
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="Adopt Me!"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <p className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-[#FFF]">
              Adopt Me!
            </p>
            <p className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10">
              Social
            </p>
          </div>
        </motion.div>

        {/* Footer Legal Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 w-full max-w-5xl text-center border-t border-white/5 pt-8 z-10 pb-12 flex justify-center gap-6"
        >
          <Link
            to="/privacy-policy"
            className="text-[10px] text-white/30 hover:text-white/60 uppercase tracking-widest font-bold transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-[10px] text-white/30 hover:text-white/60 uppercase tracking-widest font-bold transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-[10px] text-white/10 select-none">|</span>
          <Link
            to="/admin"
            className="text-[10px] text-white/30 hover:text-emerald-400 uppercase tracking-widest font-bold transition-colors"
          >
            Admin Portal
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
