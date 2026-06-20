import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AIChatPanel from './components/AIChatPanel';
import CodePreview from './components/CodePreview';
import VisualBlocks from './components/VisualBlocks';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import WorkspaceTab from './components/WorkspaceTab';
import AssetLibraryTab from './components/AssetLibraryTab';
import ApexWorkspace from './components/ApexWorkspace';
import SettingsTab from './components/SettingsTab';
import LegalPage from './components/LegalPage';

const DashboardLayout = ({ 
  user, 
  activeTab, 
  setActiveTab, 
  connectedToRoblox, 
  setConnectedToRoblox, 
  generatedCode, 
  setGeneratedCode,
  onUserUpdate
}: any) => {
  return (
    <div className="flex bg-[#000000] min-h-screen text-white overflow-hidden relative selection:bg-white/30 selection:text-white font-sans">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <Sidebar user={user} active={activeTab} setActive={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-screen relative z-10 border-l border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <Header connected={connectedToRoblox} setConnected={setConnectedToRoblox} user={user} />
        
        <div className="flex-1 p-4 md:p-6 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden h-[calc(100vh-80px)]">
          {activeTab === 'ai' && (
             <ApexWorkspace 
               connected={connectedToRoblox} 
               setConnected={setConnectedToRoblox} 
               onGenerated={setGeneratedCode} 
               generatedCode={generatedCode} 
             />
          )}

          {activeTab === 'scripts' && (
             <div className="flex-1 h-full w-full">
               <CodePreview code={generatedCode} connected={connectedToRoblox} />
             </div>
          )}

          {activeTab === 'workspace' && (
             <WorkspaceTab />
          )}

          {activeTab === 'assets' && (
             <AssetLibraryTab />
          )}

          {activeTab === 'layers' && (
             <div className="flex-1 h-full w-full flex items-center justify-center border border-white/5 rounded-2xl bg-black/40 backdrop-blur-sm">
               <div className="text-center flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                   </svg>
                 </div>
                 <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Component Hierarchy</h2>
                 <p className="text-white/40 text-sm max-w-sm">View nested script modules and UI definitions cleanly.</p>
               </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="flex-1 h-full w-full border border-white/5 rounded-2xl bg-[#030304]/60 backdrop-blur-sm p-6 md:p-8 overflow-hidden flex flex-col">
               <SettingsTab onSettingsChange={(settings) => {
                 onUserUpdate({
                   username: settings.username,
                   nickname: settings.nickname,
                   avatar: settings.avatar
                 });
                 // Synchronize Roblox connection status as connected
                 setConnectedToRoblox(true);
               }} />
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default function App() {
  const initialCode = new URLSearchParams(window.location.search).get('code');

  const [activeTab, setActiveTab] = useState('ai');
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [connectedToRoblox, setConnectedToRoblox] = useState(true); // Connected by default to welcome users immediately
  
  const [user, setUser] = useState<{username: string, nickname?: string, avatar: string} | null>(() => {
    const cachedUser = localStorage.getItem("apex_username") || "RobloxianDev_01";
    const cachedNick = localStorage.getItem("apex_nickname") || "Apex Developer";
    const cachedAv = localStorage.getItem("apex_avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527";
    return {
      username: cachedUser,
      nickname: cachedNick,
      avatar: cachedAv
    };
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If there is a code in the URL, we've successfully authenticated and loaded the state synchronously.
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      const usernameVal = "RobloxianDev_01";
      const nicknameVal = "Apex Developer";
      const avatarVal = "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527";
      localStorage.setItem("apex_username", usernameVal);
      localStorage.setItem("apex_nickname", nicknameVal);
      localStorage.setItem("apex_avatar", avatarVal);
      setUser({
        username: usernameVal,
        nickname: nicknameVal,
        avatar: avatarVal
      });
      setConnectedToRoblox(true);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard', { replace: true });
    }
  }, [location.search, navigate]);

    // Clean up code from url

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<AuthPage onLogin={(userData) => {
        setUser(userData);
        setConnectedToRoblox(true);
        navigate('/dashboard');
      }} onBack={() => navigate('/')} />} />
      <Route path="/dashboard" element={<DashboardLayout 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectedToRoblox={connectedToRoblox}
        setConnectedToRoblox={setConnectedToRoblox}
        generatedCode={generatedCode}
        setGeneratedCode={setGeneratedCode}
        onUserUpdate={(updated: any) => setUser(updated)}
      />} />
      <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
      <Route path="/terms-of-service" element={<LegalPage page="terms" />} />
    </Routes>
  );
}
