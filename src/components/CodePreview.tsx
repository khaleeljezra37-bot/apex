import { Copy, CheckCircle2, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

interface CodePreviewProps {
  code: string;
  connected?: boolean;
}

export default function CodePreview({ code, connected }: CodePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [injecting, setInjecting] = useState(false);
  const [injected, setInjected] = useState(false);

  const copyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const overrideInject = async () => {
    if (!code || !connected) return;
    setInjecting(true);
    // Simulate injection delay
    setTimeout(() => {
      setInjecting(false);
      setInjected(true);
      setTimeout(() => setInjected(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-red-500/80 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-yellow-500/80 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-white/10 hover:bg-green-500/80 transition-colors cursor-pointer" />
          </div>
          <span className="text-xs font-mono text-white/50 bg-black/40 px-3 py-1 rounded-lg border border-white/5">ServerScriptService.luau</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyToClipboard}
            disabled={!code}
            className="flex items-center text-xs font-semibold text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 disabled:opacity-50"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </button>
          
          {connected && (
            <button
              onClick={overrideInject}
              disabled={!code || injecting || injected}
              className={cn(
                "flex items-center text-xs font-bold transition-all px-4 py-2 rounded-full shadow-lg hover:scale-105 active:scale-95 border",
                injected 
                  ? "bg-green-500/20 border-green-500/30 text-green-400" 
                  : "bg-white text-black hover:bg-gray-200 border-white disabled:opacity-50 disabled:hover:scale-100"
              )}
            >
              {injecting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Injecting...</>
              ) : injected ? (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Injected</>
              ) : (
                <><Play className="w-3 h-3 mr-2 fill-current" /> Inject Script</>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-transparent font-mono text-sm leading-8 custom-scrollbar relative z-10 selection:bg-blue-500/30">
        {code ? (
          <pre className="text-blue-100/90 font-medium">
            <code>
              {code.split('\n').map((line, i) => (
                <div key={i} className="table-row group/line hover:bg-white/[0.02]">
                  <span className="table-cell text-right pr-6 text-white/20 select-none text-xs align-middle">{i + 1}</span>
                  <span className="table-cell whitespace-pre-wrap word-break flex-1">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/30">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-[3px] border-white/5 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-t-white/30 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>
            <p className="font-medium tracking-wide uppercase text-xs">Awaiting Source Code</p>
          </div>
        )}
      </div>
    </div>
  );
}
