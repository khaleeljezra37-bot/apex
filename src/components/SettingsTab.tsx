import { useState, useEffect } from "react";
import { Key, User, Shield, Info, Copy, Check, Eye, EyeOff, Blocks, HelpCircle, Code } from "lucide-react";

interface SettingsTabProps {
  onSettingsChange: (settings: { username: string; nickname: string; avatar: string; openaiKey: string; geminiKey: string }) => void;
}

export default function SettingsTab({ onSettingsChange }: SettingsTabProps) {
  // Load initial states from localStorage or defaults
  const [nickname, setNickname] = useState(() => localStorage.getItem("apex_nickname") || "Apex Developer");
  const [username, setUsername] = useState(() => localStorage.getItem("apex_username") || "RobloxianDev_01");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("apex_avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("apex_openai_key") || "");
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("apex_gemini_key") || "");

  const [showOpenai, setShowOpenai] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKeys, setCopiedKeys] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const customPluginCode = `-- APEX AI CUSTOM STUDIO PLUGIN
-- Copy and save this in your Roblox Studio plugins directory as 'ApexAI.local.lua'!

local Selection = game:GetService("Selection")
local HttpService = game:GetService("HttpService")

-- Create plugin toolbar & connection triggering button
local toolbar = plugin:CreateToolbar("Apex AI")
local connectBtn = toolbar:CreateButton(
    "Connect Web", 
    "Synchronizes your Roblox workspace with your Apex Web Builder app", 
    "rbxassetid://13551574366"
)

local widgetInfo = DockWidgetPluginGuiInfo.new(
    Enum.InitialDockState.Right,
    true,
    false,
    300,
    400,
    250,
    250
)

local widget = plugin:CreateDockWidgetPluginGui("ApexConnectPanel", widgetInfo)
widget.Title = "Apex Web Connector"

-- UI elements within dock
local container = Instance.new("Frame")
container.Size = UDim2.new(1, 0, 1, 0)
container.BackgroundColor3 = Color3.fromRGB(15, 15, 18)
container.BorderSizePixel = 0
container.Parent = widget

local titleLabel = Instance.new("TextLabel")
titleLabel.Size = UDim2.new(1, -20, 0, 40)
titleLabel.Position = UDim2.new(0, 10, 0, 10)
titleLabel.Text = "APEX INTELLIGENCE CLIENT"
titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
titleLabel.Font = Enum.Font.GothamBold
titleLabel.TextSize = 14
titleLabel.TextXAlignment = Enum.TextXAlignment.Left
titleLabel.BackgroundTransparency = 1
titleLabel.Parent = container

local statusLabel = Instance.new("TextLabel")
statusLabel.Size = UDim2.new(1, -20, 0, 30)
statusLabel.Position = UDim2.new(0, 10, 0, 50)
statusLabel.Text = "Status: WAITING (Ready at http://localhost:3000)"
statusLabel.TextColor3 = Color3.fromRGB(52, 211, 153)
statusLabel.Font = Enum.Font.Gotham
statusLabel.TextSize = 12
statusLabel.TextXAlignment = Enum.TextXAlignment.Left
statusLabel.BackgroundTransparency = 1
statusLabel.Parent = container

local syncBtn = Instance.new("TextButton")
syncBtn.Size = UDim2.new(1, -20, 0, 45)
syncBtn.Position = UDim2.new(0, 10, 0, 90)
syncBtn.BackgroundColor3 = Color3.fromRGB(244, 244, 245)
syncBtn.Text = "MANUAL PULL GENERATION"
syncBtn.TextColor3 = Color3.fromRGB(9, 9, 11)
syncBtn.Font = Enum.Font.GothamBold
syncBtn.TextSize = 12
syncBtn.Parent = container

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 8)
corner.Parent = syncBtn

syncBtn.MouseButton1Click:Connect(function()
    statusLabel.Text = "Fetching builds from web socket host..."
    statusLabel.TextColor3 = Color3.fromRGB(251, 191, 36)
    
    local success, response = pcall(function()
        return HttpService:GetAsync("http://localhost:3000/api/health")
    end)
    
    if success then
        statusLabel.Text = "Success! Inter-process socket active."
        statusLabel.TextColor3 = Color3.fromRGB(52, 211, 153)
    else
        statusLabel.Text = "Failed connects. Ensure server runs on 3000."
        statusLabel.TextColor3 = Color3.fromRGB(244, 63, 94)
    end
end)`;

  const handleSave = () => {
    localStorage.setItem("apex_nickname", nickname);
    localStorage.setItem("apex_username", username);
    localStorage.setItem("apex_avatar", avatar);
    localStorage.setItem("apex_openai_key", openaiKey);
    localStorage.setItem("apex_gemini_key", geminiKey);

    onSettingsChange({
      username,
      nickname,
      avatar,
      openaiKey,
      geminiKey
    });

    setSaveStatus("Settings saved successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customPluginCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar h-full w-full pr-1 space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col gap-1.5 select-none">
        <h3 className="text-xl font-black uppercase tracking-wider text-white">Engine Settings</h3>
        <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Configure workspace keys and customize profile parameters</p>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl text-center text-xs tracking-wider uppercase animate-pulse">
          {saveStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        
        {/* Left Column - Core Configurations */}
        <div className="space-y-6">
          
          {/* OpenAI Key customization */}
          <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white/80 flex items-center gap-2 border-b border-white/5 pb-3">
              <Key className="w-4 h-4 text-purple-400" /> API Credentials
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">OpenAI API Key (Custom Override)</label>
                <div className="relative">
                  <input
                    type={showOpenai ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                  />
                  <button 
                    onClick={() => setShowOpenai(!showOpenai)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showOpenai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-white/30 mt-1.5 leading-relaxed">
                  Used directly for OpenAI GPT-4o queries. Kept securely offline in local browser cache.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">Gemini API Key (Optional)</label>
                <div className="relative">
                  <input
                    type={showGemini ? "text" : "password"}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                  />
                  <button 
                    onClick={() => setShowGemini(!showGemini)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Roblox Identity Configuration */}
          <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white/80 flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="w-4 h-4 text-yellow-400" /> Roblox Identity Parameter
            </h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">Display Nickname</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname"
                    className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">Public Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">Profile Avatar URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#151515] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-3.5 bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                <img src={avatar} alt="Avatar preview" className="w-12 h-12 rounded-full border border-white/15 object-cover bg-neutral-900" />
                <div>
                  <span className="block text-[13px] font-bold text-white">{nickname}</span>
                  <span className="block text-[10px] font-mono text-white/40">@{username}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-[0_4px_25px_rgba(255,255,255,0.1)] transition-colors cursor-pointer active:scale-[0.99]"
          >
            Save All Changes
          </button>

        </div>

        {/* Right Column - Create Your Custom Roblox Plugin Instructions & Source Code */}
        <div className="bg-[#08080a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-extrabold text-[12px] uppercase tracking-wider text-white/80 flex items-center gap-2 border-b border-white/5 pb-3">
              <Blocks className="w-4 h-4 text-emerald-400" /> Roblox Studio Custom Plugin
            </h4>

            <div className="text-white/60 text-xs leading-relaxed space-y-2">
              <p>
                To trigger Roblox workspace script generation in real-time right from this website, you can create and deploy <strong className="text-emerald-400">your own custom Roblox Plugin</strong> using our source code!
              </p>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-[11px] space-y-2 select-none">
                <span className="font-extrabold text-white block uppercase tracking-wider text-[9px] text-yellow-400">Installation Helper:</span>
                <ol className="list-decimal pl-4 space-y-1 text-white/50">
                  <li>In <strong>Roblox Studio</strong>, open any game project space.</li>
                  <li>In the <strong>Explorer window</strong>, create a standard <code className="text-white">Script</code>.</li>
                  <li>Copy and paste our custom plugin code block below into it.</li>
                  <li>Right-click the Script and select <strong className="text-white">"Save as Local Plugin"</strong>!</li>
                  <li>Select your local plugin directory. Call it <code className="text-emerald-400 font-bold">ApexAI.local.lua</code> and hit Save!</li>
                </ol>
              </div>
            </div>

            <div className="relative mt-4">
              <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40 mb-1.5">Custom Plugin Source Code</label>
              
              <div className="relative rounded-xl border border-white/10 bg-[#050507] overflow-hidden">
                <button 
                  onClick={handleCopyCode} 
                  className="absolute right-3.5 top-3.5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all cursor-pointer z-10"
                  title="Copy Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                </button>
                
                <pre className="p-4 pr-14 text-[10px] font-mono text-[#a5d6ff] h-60 overflow-y-auto custom-scrollbar select-all leading-relaxed bg-[#050507]">
                  <code>{customPluginCode}</code>
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/30 flex items-center gap-1.5 select-none font-semibold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-neutral-500" />
            <span>Plugin fully compatible with default Luau Studio sockets</span>
          </div>
        </div>

      </div>

    </div>
  );
}
