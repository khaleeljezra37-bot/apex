import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AIChatPanel from './components/AIChatPanel';
import CodePreview from './components/CodePreview';
import VisualBlocks from './components/VisualBlocks';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import WorkspaceTab from './components/WorkspaceTab';
import AssetLibraryTab from './components/AssetLibraryTab';
import LemonadeWorkspace from './components/LemonadeWorkspace';
import LegalPage from './components/LegalPage';

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('ai');
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [connectedToRoblox, setConnectedToRoblox] = useState(false);
  const [user, setUser] = useState<{username: string, avatar: string} | null>(null);

  const MainApp = () => {
    if (view === 'landing') {
      return <LandingPage onLogin={() => setView('auth')} />;
    }

    if (view === 'auth') {
      return <AuthPage onLogin={(userData) => {
        setUser(userData);
        setConnectedToRoblox(true);
        setView('app');
      }} onBack={() => setView('landing')} />;
    }

    return (
      <div className="flex bg-[#000000] min-h-screen text-white overflow-hidden relative selection:bg-white/30 selection:text-white font-sans">
        {/* Subtle ambient background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

      <Sidebar user={user} active={activeTab} setActive={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-h-screen relative z-10 border-l border-white/5 bg-[#030303]/80 backdrop-blur-3xl shadow-[-20px_0_40px_rgba(0,0,0,0.8)]">
        <Header connected={connectedToRoblox} setConnected={setConnectedToRoblox} user={user} />
        
        <div className="flex-1 p-4 md:p-6 lg:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden h-[calc(100vh-80px)]">
          {activeTab === 'ai' && (
             <LemonadeWorkspace 
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
             <div className="flex-1 h-full w-full flex items-center justify-center border border-white/5 rounded-2xl bg-black/40 backdrop-blur-sm">
               <div className="text-center flex flex-col items-center">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                 </div>
                 <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Engine Settings</h2>
                 <p className="text-white/40 text-sm max-w-sm">Configure environment variables and engine preferences.</p>
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
    );
  };

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
      <Route path="/terms-of-service" element={<LegalPage page="terms" />} />
    </Routes>
  );
}
