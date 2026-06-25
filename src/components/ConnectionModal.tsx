import {
  X,
  Plug,
  Link2,
  Key,
  Globe,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/utils";

interface ConnectionModalProps {
  onClose: () => void;
  onConnect: () => void;
}

export default function ConnectionModal({
  onClose,
  onConnect,
}: ConnectionModalProps) {
  const [method, setMethod] = useState<"plugin" | "cloud">("cloud");
  const [apiKey, setApiKey] = useState("");
  const [universeId, setUniverseId] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "cloud" && (!apiKey || !universeId)) return;

    setConnecting(true);

    // Simulate connection delay
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      setTimeout(() => {
        onConnect();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Connect to Roblox
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Link your live place for direct script injection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {connected ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Connected Successfully
            </h3>
            <p className="text-sm text-white/50">
              Your Roblox place is linked. AI can now inject scripts directly
              into your game.
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Method Toggle */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-6 border border-white/5">
              <button
                onClick={() => setMethod("cloud")}
                className={cn(
                  "flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all",
                  method === "cloud"
                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                    : "text-white/50 hover:text-white",
                )}
              >
                <Globe className="w-4 h-4 mr-2" /> Open Cloud API
              </button>
              <button
                onClick={() => setMethod("plugin")}
                className={cn(
                  "flex-1 flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all",
                  method === "plugin"
                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                    : "text-white/50 hover:text-white",
                )}
              >
                <Plug className="w-4 h-4 mr-2" /> Studio Plugin
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              {method === "cloud" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50 flex items-center">
                      <Key className="w-3.5 h-3.5 mr-1.5" /> API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter Open Cloud API Key..."
                      className="w-full bg-white/5 border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-white/50 flex items-center">
                      <Link2 className="w-3.5 h-3.5 mr-1.5" /> Universe ID
                    </label>
                    <input
                      type="text"
                      value={universeId}
                      onChange={(e) => setUniverseId(e.target.value)}
                      placeholder="e.g. 12345678"
                      className="w-full bg-white/5 border border-white/10 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                  <p className="text-sm text-white/80 mb-4">
                    Install our Roblox Studio Plugin to establish a direct local
                    connection via HTTPService.
                  </p>
                  <p className="font-mono text-xl tracking-widest text-white border border-white/10 bg-black/40 px-4 py-2 rounded-xl">
                    04X-9L2
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    Enter this code into the plugin settings
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  connecting || (method === "cloud" && (!apiKey || !universeId))
                }
                className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-sm transition-all"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  "Connect to Place"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
