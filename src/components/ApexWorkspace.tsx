import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Paperclip,
  CornerDownRight,
  Download,
  Check,
  X,
  Code,
  Cpu,
  Layers,
  FileCode,
  Gamepad2,
  Play,
  Image as ImageIcon,
  ChevronDown,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Search,
  CheckCircle,
  HelpCircle,
  FolderLock,
  Plus,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ApexWorkspaceProps {
  connected: boolean;
  setConnected: (state: boolean) => void;
  onGenerated: (code: string) => void;
  generatedCode: string;
}

export default function ApexWorkspace({
  connected,
  setConnected,
  onGenerated,
  generatedCode,
}: ApexWorkspaceProps) {
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Zombie Spawner Waves",
      prompt: "make a me a game that spawn zombies",
    },
    {
      id: "2",
      name: "Fast Vehicle Chassis",
      prompt:
        "Generate a fully working vehicle steering chassis with local speedometers.",
    },
    {
      id: "3",
      name: "Matchmaking Teleporter",
      prompt: "Generate a player matchmaking teleporter pads loop sync.",
    },
    {
      id: "4",
      name: "Laser Gun Tool",
      prompt:
        "Create a raycasting laser gun weapon that deals 25 damage with reload audio.",
    },
  ]);
  const [activeProjectId, setActiveProjectId] = useState("1");
  const [prompt, setPrompt] = useState("make a me a game that spawn zombies");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNewChat = () => {
    const nextId = String(projects.length + 1);
    const newProj = {
      id: nextId,
      name: `New Project ${nextId}`,
      prompt: "",
    };
    setProjects((prev) => [...prev, newProj]);
    setActiveProjectId(nextId);
    setPrompt("");
    setViewCodeMode(false);
  };

  const handleSelectProject = (proj: {
    id: string;
    name: string;
    prompt: string;
  }) => {
    setActiveProjectId(proj.id);
    setPrompt(proj.prompt);
    setViewCodeMode(false);
  };
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [viewCodeMode, setViewCodeMode] = useState(false);
  const [activeScriptTab, setActiveScriptTab] = useState<
    "server" | "client" | "spawn"
  >("server");
  const [marketplaceInstalled, setMarketplaceInstalled] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  // Mock Lua Scripts based on zombies prompt
  const serverScript = `--- ServerScriptService/ZombieSpawnerManager
local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local ZombieModel = ReplicatedStorage:WaitForChild("Zombie")
local spawnInterval = 4.0
local maxZombies = 35
local activeZombies = 0

-- Connect tracking attributes
local function setupZombie(zombie)
\tlocal hum = zombie:WaitForChild("Humanoid")
\tlocal root = zombie:WaitForChild("HumanoidRootPart")
\t
\thum.Died:Connect(function()
\t\tactiveZombies = math.max(0, activeZombies - 1)
\t\tprint("Zombie eliminated. Current count: " .. activeZombies)
\t\ttask.wait(5)
\t\tzombie:Destroy()
\tend)
\t
\t-- Simple AI follow closest player
\ttask.spawn(function()
\t\twhile hum and hum.Health > 0 and root do
\t\t\tlocal target = nil
\t\t\tlocal minDist = 300
\t\t\t
\t\t\tfor _, player in ipairs(Players:GetPlayers()) do
\t\t\t\tif player.Character and player.Character:FindFirstChild("HumanoidRootPart") then
\t\t\t\t\tlocal dist = (player.Character.HumanoidRootPart.Position - root.Position).Magnitude
\t\t\t\t\tif dist < minDist then
\t\t\t\t\t\tminDist = dist
\t\t\t\t\t\ttarget = player.Character.HumanoidRootPart
\t\t\t\t\tend
\t\t\t\tend
\t\t\tend
\t\t\t
\t\t\tif target then
\t\t\t\thum:MoveTo(target.Position)
\t\t\telse
\t\t\t\thum:MoveTo(root.Position + Vector3.new(math.random(-15, 15), 0, math.random(-15, 15)))
\t\t\tend
\t\t\ttask.wait(1.5)
\t\t\tend
\tend)
end

while true do
\ttask.wait(spawnInterval)
\tif activeZombies < maxZombies then
\t\tlocal zombieClone = ZombieModel:Clone()
\t\tlocal spawnLocation = Vector3.new(math.random(-80, 80), 5, math.random(-80, 80))
\t\tzombieClone:SetPrimaryPartCFrame(CFrame.new(spawnLocation))
\t\tzombieClone.Parent = workspace
\t\tactiveZombies = activeZombies + 1
\t\tsetupZombie(zombieClone)
\tend
end`;

  const clientScript = `--- StarterPlayerScripts/ZombieUIRenderer
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local localPlayer = Players.LocalPlayer
local PlayerGui = localPlayer:WaitForChild("PlayerGui")

-- Create warning flash screen UI
local screnGui = Instance.new("ScreenGui")
screnGui.Name = "ZombieWaveAlert"
screnGui.ResetOnSpawn = false
screnGui.Parent = PlayerGui

local alertText = Instance.new("TextLabel")
alertText.Size = UDim2.new(1, 0, 0.15, 0)
alertText.Position = UDim2.new(0, 0, 0.25, 0)
alertText.BackgroundTransparency = 1
alertText.TextColor3 = Color3.fromRGB(244, 63, 94)
alertText.TextSize = 42
alertText.Font = Enum.Font.GothamBold
alertText.Text = "WARNING: ZOMBIES APPROACHING"
alertText.TextTransparency = 1
alertText.Parent = screnGui

local function flashAlert()
\talertText.TextTransparency = 0
\tfor i = 1, 3 do
\t\talertText.TextColor3 = Color3.fromRGB(244, 63, 94)
\t\ttask.wait(0.3)
\t\talertText.TextColor3 = Color3.fromRGB(255, 255, 255)
\t\ttask.wait(0.3)
\tend
\tTweenService:Create(alertText, TweenInfo.new(1), {TextTransparency = 1}):Play()
end

task.spawn(flashAlert)
`;

  const spawnScript = `--- ReplicatedStorage/ZombieStructure
-- Auto-configured fast zombie character rigging configuration
local ZombieRig = {
\tSpeed = 16,
\tDamage = 18,
\tHealth = 100,
\tMeshId = "rbxassetid://479203914",
\tAnimateId = "rbxassetid://507767773"
}
return ZombieRig`;

  const handleSubmit = async () => {
    if (!prompt.trim() || isGenerating) return;

    if (!connected) {
      setShowConnectModal(true);
      return;
    }

    // Connected, perform generator steps
    setIsGenerating(true);
    setViewCodeMode(false);
    setGenerationSteps([]);
    setActiveStep(0);

    const steps = [
      "Analyzing semantic game structures...",
      "Resolving workspace asset requirements...",
      "Generating server scripts (ZombieSpawnerManager.lua)...",
      "Compiling StarterPlayer dynamic graphics...",
      "Baking model configurations...",
      "Synthesizing packages & client payloads...",
      "Injecting assets directly into local Roblox Studio host...",
    ];

    let current = 0;
    const intervalId = setInterval(() => {
      if (current < steps.length - 2) {
        setGenerationSteps((prev) => [...prev, steps[current]]);
        setActiveStep(current);
        current++;
      } else {
        clearInterval(intervalId);
      }
    }, 300);

    try {
      const customOpenAiKey = localStorage.getItem("apex_openai_key") || "";
      const customGeminiKey = localStorage.getItem("apex_gemini_key") || "";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          aiModel: "gemini",
          customOpenAiKey,
          customGeminiKey,
        }),
      });
      const data = await res.json();
      clearInterval(intervalId);

      setGenerationSteps(steps);
      setActiveStep(steps.length - 1);

      setTimeout(() => {
        setIsGenerating(false);
        setViewCodeMode(true);
        if (data.code) {
          onGenerated(data.code);
        } else {
          onGenerated(serverScript);
        }
      }, 700);
    } catch (err) {
      console.warn("Using template generation offline backup:", err);
      clearInterval(intervalId);
      setGenerationSteps(steps);
      setActiveStep(steps.length - 1);
      setTimeout(() => {
        setIsGenerating(false);
        setViewCodeMode(true);
        onGenerated(serverScript);
      }, 700);
    }
  };

  const handleSimulateConnection = () => {
    // Open the mock marketplace
    setShowConnectModal(false);
    setShowMarketplace(true);
  };

  const triggerPluginConnectAction = () => {
    setConnectLoading(true);
    setTimeout(() => {
      setConnectLoading(false);
      setMarketplaceInstalled(true);
      setConnected(true);
      // Brief timer to return user happily
      setTimeout(() => {
        setShowMarketplace(false);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="flex-1 h-full w-full flex bg-[#000000] relative overflow-hidden rounded-2xl border border-white/5">
      {/* PROJECTS SUB-SIDEBAR */}
      <div className="w-64 border-r border-white/5 bg-[#030304]/80 backdrop-blur-md flex flex-col shrink-0 p-4.5 justify-between relative z-25">
        <div className="space-y-6">
          <button
            onClick={handleNewChat}
            className="w-full py-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-black uppercase tracking-widest transition-transform duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>+ New Project</span>
          </button>

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block px-1">
              Projects
            </span>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto custom-scrollbar pr-0.5">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => handleSelectProject(proj)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-all cursor-pointer select-none ${isActive ? "bg-white/5 border-white/10 text-white font-bold" : "bg-transparent border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.01]"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-white/5 text-white/30 border border-white/5"}`}
                    >
                      <svg
                        className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400/20"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                      </svg>
                    </div>
                    <span className="text-[11px] uppercase font-bold tracking-wider truncate">
                      {proj.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Discord Card */}
        <a
          href="https://discord.gg/apex"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/15 bg-[#5865F2]/5 hover:bg-[#5865F2]/10 hover:border-indigo-500/30 transition-all shadow-md cursor-pointer mb-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-indigo-400"
                viewBox="0 0 127.14 96.36"
                fill="currentColor"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.92,54.47,1,77.06a107.4,107.4,0,0,0,32,16.14,83,83,0,0,0,6.71-11,68.6,68.6,0,0,1-10.59-5.11c.9-.66,1.76-1.37,2.58-2.1a77,77,0,0,0,63.15,0c.82.73,1.68,1.44,2.58,2.1a68.86,68.86,0,0,1-10.59,5.11,85.07,85.07,0,0,0,6.72,11,107.4,107.4,0,0,0,32-16.14C129.66,50.12,123.51,27.42,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
              </svg>
            </div>
            <div>
              <span className="block text-[11px] font-black text-white uppercase tracking-wider leading-none">
                Discord Group
              </span>
              <span className="block text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
                gifts & rewards
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* MAIN ASYLUM FIELD */}
      <div className="flex-1 flex flex-col h-full bg-[#000000] relative overflow-hidden">
        {/* Absolute Noise Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="flex-1 flex items-center justify-center p-6 relative z-10 overflow-y-auto custom-scrollbar">
          {/* Main Content View */}
          <AnimatePresence mode="wait">
            {!isGenerating && !viewCodeMode && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full max-w-5xl flex flex-col items-center relative py-12"
              >
                {/* Central Branding Logo & Text */}
                <div className="flex flex-col items-center text-center mb-16 select-none">
                  <div className="w-20 h-20 relative mb-6 group cursor-pointer flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>

                    {/* Clean glowing metric isometric logo */}
                    <svg
                      className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transform group-hover:scale-105 transition-transform duration-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                      <line x1="12" y1="22" x2="12" y2="12" />
                      <line x1="12" y1="12" x2="22" y2="8.5" />
                      <line x1="12" y1="12" x2="2" y2="8.5" />
                    </svg>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-2">
                    Apex AI
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30">
                    Turn words into Roblox instances
                  </p>
                </div>

                {/* Center Floating Prompt Box (Image 3) */}
                <div className="w-full max-w-xl bg-[#0b0b0d]/90 border border-white/10 rounded-[1.8rem] p-5.5 shadow-[0_30px_70px_rgba(0,0,0,0.9)] relative">
                  {/* Glow ring */}
                  <div className="absolute inset-0 bg-yellow-400/5 filter blur-2xl opacity-0 hover:opacity-100 transition-opacity rounded-[1.8rem] pointer-events-none"></div>

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the mechanics of your dream game..."
                      className="w-full bg-transparent resize-none min-h-[48px] max-h-36 text-white text-[15px] placeholder-white/35 font-semibold focus:outline-none focus:ring-0"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/5 relative z-10">
                      {/* Left Actions (Image 3) */}
                      <div className="flex items-center gap-2">
                        <button className="w-8.5 h-8.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/55 hover:text-white transition-colors cursor-pointer">
                          <span className="text-[12px] font-black">@</span>
                        </button>
                        <button className="w-8.5 h-8.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/55 hover:text-white transition-colors cursor-pointer">
                          <ImageIcon className="w-4 h-4" />
                        </button>

                        {/* Custom dropdown */}
                        <div className="flex items-center gap-1 bg-white/5 border border-white/15 hover:border-white/35 px-3 py-1.5 rounded-full text-[10px] font-extrabold text-white/60 hover:text-white cursor-pointer select-none transition-colors ml-1">
                          <span>CUSTOM</span>
                          <ChevronDown className="w-3 h-3 text-white/40" />
                        </div>
                      </div>

                      {/* Right Actions (Image 3) */}
                      <div className="flex items-center gap-2">
                        {/* Model Selector pill */}
                        <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold text-yellow-300">
                          <Cpu className="w-3 h-3 text-yellow-400" />
                          <span>GEMINI 3 FLASH</span>
                        </div>

                        {/* Cost indicator */}
                        <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-extrabold text-white/50 select-none">
                          2.00
                        </div>

                        {/* Launch Submit Arrow */}
                        <button
                          onClick={handleSubmit}
                          className="w-8.5 h-8.5 rounded-full bg-white text-black hover:bg-yellow-100 flex items-center justify-center transition-colors shadow-lg active:scale-95 cursor-pointer ml-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info text */}
                <div className="mt-8 flex items-center gap-2 text-[11px] text-white/20 select-none font-semibold uppercase tracking-wider">
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${connected ? "text-emerald-400/60" : "text-neutral-500/60"}`}
                  />
                  <span>
                    {connected
                      ? "Studio Plugin Connected and Active"
                      : "Requires Roblox Studio Plugin Connection"}
                  </span>
                </div>
              </motion.div>
            )}

            {/* GENERATING LOAD SCREEN MOOD */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-xl bg-[#070709] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-8 flex items-center justify-center">
                  <div className="absolute inset-x-0 inset-y-0 border-2 border-yellow-400/10 rounded-full"></div>
                  <div className="absolute inset-x-0 inset-y-0 border-2 border-transparent border-t-yellow-400 rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>

                <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider mb-2 text-white">
                  Fusing Wordforms
                </h3>
                <p className="text-white/40 text-[12px] uppercase font-bold tracking-[0.2em] mb-8">
                  Building Roblox Instance Nodes
                </p>

                {/* Staggered progress steps */}
                <div className="space-y-3.5 text-left bg-black/40 border border-white/5 rounded-2xl p-5.5 font-mono text-[11px] leading-relaxed select-none min-h-[180px]">
                  {generationSteps.map((step, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className="flex gap-3 items-start"
                    >
                      {idx === activeStep && isGenerating ? (
                        <span className="text-yellow-400 font-bold animate-pulse">
                          &gt;
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">✓</span>
                      )}
                      <span
                        className={
                          idx === activeStep
                            ? "text-white font-semibold"
                            : "text-white/50"
                        }
                      >
                        {step}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ACTIVE CODE / WORKSPACE EDITOR VIEW */}
            {viewCodeMode && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-full flex flex-col pt-2"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                      <Code className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[14px] uppercase tracking-wider text-white">
                        Generated Applet
                      </h3>
                      <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
                        Ready for Roblox Studio
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setViewCodeMode(false);
                        setPrompt("");
                      }}
                      className="px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl text-[11px] font-extrabold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      Build Something Else
                    </button>
                    <button
                      onClick={() => {
                        alert(
                          "Successfully synchronized scripts with and updated Roblox Studio instances!",
                        );
                      }}
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" /> Inject to
                      Studio
                    </button>
                  </div>
                </div>

                {/* Code Editor body side-by-side with directory */}
                <div className="flex-1 flex gap-5 overflow-hidden h-[500px]">
                  {/* File Tree representation */}
                  <div className="w-64 bg-[#08080a] border border-white/5 rounded-2xl p-4 hidden md:flex flex-col">
                    <span className="text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-4">
                      WORKSPACE EXPLO
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 px-2.5 py-2 hover:bg-white/5 rounded-lg text-white/50 cursor-pointer">
                        <FolderLock className="w-3.5 h-3.5 text-yellow-500/80" />{" "}
                        ServerScriptService
                      </div>
                      <div className="flex items-center gap-2 pl-6 px-2.5 py-1 bg-white/5 border-l-2 border-yellow-400 rounded-r-lg text-white font-bold cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-yellow-400" />{" "}
                        ZombieSpawnerManager
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-2 hover:bg-white/5 rounded-lg text-white/50 cursor-pointer">
                        <FolderLock className="w-3.5 h-3.5 text-neutral-500" />{" "}
                        StarterPlayerScripts
                      </div>
                      <div className="flex items-center gap-2 pl-6 px-2.5 py-1.5 hover:bg-white/5 rounded-lg text-white/50 cursor-pointer">
                        <FileCode className="w-3.5 h-3.5 text-neutral-400" />{" "}
                        ZombieUIRenderer
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-2 hover:bg-white/5 rounded-lg text-white/50 cursor-pointer">
                        <FolderLock className="w-3.5 h-3.5 text-neutral-500" />{" "}
                        ReplicatedStorage
                      </div>
                    </div>
                  </div>

                  {/* Simulated IDE file content */}
                  <div className="flex-1 bg-[#060608] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    {/* Script IDE tabs */}
                    <div className="bg-[#0b0b0d] px-4 flex gap-1 border-b border-white/5">
                      <button
                        onClick={() => setActiveScriptTab("server")}
                        className={`px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer relative ${activeScriptTab === "server" ? "text-white border-b-2 border-yellow-400" : "text-white/40 hover:text-white/70"}`}
                      >
                        ZombieSpawnerManager.lua
                      </button>
                      <button
                        onClick={() => setActiveScriptTab("client")}
                        className={`px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer relative ${activeScriptTab === "client" ? "text-white border-b-2 border-yellow-400" : "text-white/40 hover:text-white/70"}`}
                      >
                        ZombieUIRenderer.lua
                      </button>
                      <button
                        onClick={() => setActiveScriptTab("spawn")}
                        className={`px-4 py-3 text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer relative ${activeScriptTab === "spawn" ? "text-white border-b-2 border-yellow-400" : "text-white/40 hover:text-white/70"}`}
                      >
                        ZombieStructure.lua
                      </button>
                    </div>

                    {/* Code Block area */}
                    <div className="flex-1 p-5 overflow-y-auto font-mono text-[12px] leading-relaxed text-emerald-300">
                      <pre className="custom-scrollbar h-full">
                        <code>
                          {activeScriptTab === "server" && serverScript}
                          {activeScriptTab === "client" && clientScript}
                          {activeScriptTab === "spawn" && spawnScript}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CONNECT PLUGIN POPUP DIALOG (IMAGE 4) */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#111115] border border-white/10 rounded-[1.8rem] w-full max-w-md p-7 shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative"
            >
              {/* Header Title & Dots (Image 4) */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  <span className="text-[11px] font-black uppercase text-white/30 tracking-widest ml-1.5">
                    System Alert
                  </span>
                </div>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-5 text-center py-2">
                <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                  Connect plugin
                </h3>
                <p className="text-[13px] text-white/50 leading-relaxed max-w-xs mx-auto">
                  You must first install and connect the Apex plugin on Roblox
                  Studio.
                </p>

                <button
                  onClick={handleSimulateConnection}
                  className="w-full mt-6 py-4 bg-white hover:bg-neutral-200 text-black text-xs font-black uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-white/5 cursor-pointer active:scale-[0.98]"
                >
                  Install
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ROBLOX CREATOR MARKETPLACE overlay POPUP (IMAGE 5) */}
      <AnimatePresence>
        {showMarketplace && (
          <div className="absolute inset-0 bg-[#0c0c0f] z-50 overflow-y-auto flex flex-col font-sans">
            {/* Top Roblox Bar mock (Image 5 style) */}
            <div className="bg-[#191b1d] border-b border-[#232527] py-3.5 px-6 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-6">
                {/* Roblox Tilt Logo representation */}
                <div className="w-7 h-7 bg-white transform rotate-[12deg] flex items-center justify-center shadow-lg relative">
                  <div className="w-2.5 h-2.5 bg-[#191b1d] transform -rotate-[12deg]"></div>
                </div>

                <div className="hidden lg:flex items-center gap-5 text-xs text-[#a7a9ac] font-bold uppercase tracking-wider">
                  <span className="hover:text-white cursor-pointer">
                    Discover
                  </span>
                  <span className="hover:text-white cursor-pointer">
                    Marketplace
                  </span>
                  <span className="hover:text-white cursor-pointer font-black text-white border-b-2 border-white pb-3 pt-4">
                    Store
                  </span>
                  <span className="hover:text-white cursor-pointer">
                    Create
                  </span>
                </div>
              </div>

              {/* Marketplace search mock */}
              <div className="relative w-80 max-w-sm shrink-0">
                <input
                  type="text"
                  readOnly
                  placeholder="Apex AI"
                  className="w-full bg-[#111] border border-[#333] rounded-md pl-9 pr-4 py-1.5 text-xs text-white"
                />
                <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Close Button Marketplace */}
              <button
                onClick={() => setShowMarketplace(false)}
                className="ml-4 px-3.5 py-1.5 border border-[#3c4043] rounded-md text-xs text-[#a7a9ac] hover:text-white hover:bg-[#2e3033]"
              >
                Close Store
              </button>
            </div>

            {/* Success Notification Banner Mock (Image 5 success popup) */}
            <div className="bg-[#094d21]/90 border-b border-[#0f6c31] py-2.5 px-6 flex items-center justify-between text-xs text-white relative z-10">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">
                  This item has been added to your inventory.
                </span>
              </div>
              <button className="text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main store container */}
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center">
              <div className="w-full max-w-3xl bg-[#191b1d] border border-[#2e3135] rounded-xl p-6 shadow-2xl flex flex-col md:flex-row gap-8">
                {/* Left logo component */}
                <div className="w-full md:w-64 max-w-[240px] aspect-square rounded-xl bg-[#0c0c0e] border border-[#2c2f33] flex items-center justify-center shrink-0 p-8 shadow-inner relative group">
                  <svg
                    className="w-24 h-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
                    <line x1="12" y1="22" x2="12" y2="12" />
                    <line x1="12" y1="12" x2="22" y2="8.5" />
                    <line x1="12" y1="12" x2="2" y2="8.5" />
                  </svg>
                </div>

                {/* Right detail area */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-wide">
                      Apex AI
                    </h1>
                    <div className="flex items-center gap-1 text-xs text-[#a0a5ad] mb-4">
                      <span>By</span>
                      <span className="text-[#3c9bf1] font-bold hover:underline cursor-pointer">
                        Apex Labs
                      </span>
                    </div>

                    {/* Votes & ratings metrics */}
                    <div className="flex items-center gap-4 text-xs text-[#a0a5ad] mb-6">
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-[#00b06f]" />
                        <span className="font-bold text-white">87%</span>
                        <span>(8K votes)</span>
                      </div>
                      <div className="w-px h-3 bg-neutral-700"></div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>1193 review(s)</span>
                      </div>
                    </div>

                    {/* Specs columns */}
                    <div className="grid grid-cols-3 gap-6 text-[11px] uppercase tracking-wider text-[#797c83] bg-black/20 rounded-lg p-4 mb-6 border border-white/5">
                      <div>
                        <span className="block text-[9px] mb-0.5">Type</span>
                        <strong className="text-white">Plugin</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] mb-0.5">Created</span>
                        <strong className="text-white">Aug 3, 2025</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] mb-0.5">Updated</span>
                        <strong className="text-white">Jun 19, 2026</strong>
                      </div>
                    </div>

                    {/* Main Tabs content description */}
                    <div className="border-b border-[#2e3135] flex gap-4 text-xs font-bold text-[#a0a5ad] mb-4">
                      <span className="border-b-2 border-white pb-2 text-white cursor-pointer uppercase tracking-wider">
                        Description
                      </span>
                      <span className="pb-2 cursor-pointer uppercase tracking-wider text-white/30 hover:text-white">
                        Reviews
                      </span>
                    </div>

                    <div className="text-xs text-[#a0a5ad] leading-relaxed mb-6 space-y-2">
                      <p>Official plugin for Apex.</p>
                      <p className="font-semibold text-white">
                        It's time to turn your dream ideas into real games!
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={triggerPluginConnectAction}
                      disabled={connectLoading}
                      className="w-full py-3.5 bg-[#0055ff] hover:bg-[#1a6eff] disabled:bg-[#003cb3]/60 text-white font-bold text-sm uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2.5 shadow-lg relative cursor-pointer active:scale-[0.99]"
                    >
                      {connectLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Verifying Connection...
                        </>
                      ) : marketplaceInstalled ? (
                        <>
                          Connected successfully!{" "}
                          <Check className="w-4 h-4 text-emerald-300" />
                        </>
                      ) : (
                        "Open in Studio"
                      )}
                    </button>
                    <p className="text-[10px] text-center text-[#7e828a] tracking-wide mt-1">
                      This item is available in your inventory. Opening will
                      inject the socket server directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
