import { useState, useEffect } from "react";
import { RefreshCw, ServerCrash, TerminalSquare } from "lucide-react";

export default function DiagnosticLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/debug/logs");
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      } else {
        setLogs(["No logs array found in response."]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TerminalSquare className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight">Diagnostic Logs</h1>
          </div>
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl flex items-start gap-4">
            <ServerCrash className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Failed to connect to API</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Server Output (Last 50 lines)
            </div>
            <div className="p-4 h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-white/30 text-sm italic py-8 text-center">
                  No logs recorded yet.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm break-all font-mono leading-relaxed text-emerald-300/80 hover:text-emerald-300 hover:bg-white/5 px-2 py-1 rounded">
                      <span className="text-white/30 select-none mr-3 text-xs">{String(index + 1).padStart(2, '0')}</span>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
