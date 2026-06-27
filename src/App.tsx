import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import ChatWorkspace from "./components/ChatWorkspace";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LegalPage from "./components/LegalPage";

export default function App() {
  const [isExchanging, setIsExchanging] = useState(false);
  const [authKey, setAuthKey] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const exchangeStarted = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setIsExchanging(true);
      setAuthError(null);

      const handleTokenResponse = async (tokenData: any) => {
        if (!tokenData.access_token) {
          console.error("No access token in response", tokenData);
          throw new Error("No access token received from Roblox.");
        }

        try {
          console.log("Fetching userinfo...");
          const userRes = await fetch("/api/auth/roblox/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          
          if (!userRes.ok) {
            throw new Error(`Userinfo fetch failed: ${userRes.status}`);
          }

          const userData = await userRes.json();
          console.log("Roblox User Data Received:", userData);

          if (userData.error) {
            throw new Error(`Roblox API Error: ${userData.error}`);
          }

          const username = userData.preferred_username || userData.nickname || userData.name || userData.display_name || (userData.sub ? `User_${userData.sub}` : null);
          
          if (username) {
            localStorage.setItem("apex_username", username);
            
            let avatarUrl = userData.picture;
            
            if (!avatarUrl && userData.sub) {
              try {
                const thumbRes = await fetch(`/api/proxy/roblox/avatar/${userData.sub}`);
                const thumbData = await thumbRes.json();
                if (thumbData?.data?.[0]?.imageUrl) {
                  avatarUrl = thumbData.data[0].imageUrl;
                }
              } catch (e) {
                console.error("Proxy avatar fetch failed:", e);
              }
            }

            if (!avatarUrl) {
                avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=232527`;
            }

            localStorage.setItem("apex_avatar", avatarUrl);
            if (userData.sub) {
              localStorage.setItem("apex_roblox_id", userData.sub.toString());
            }
            
            console.log("Profile synchronized successfully:", { username, avatarUrl });
            setAuthKey((k) => k + 1);
          } else {
            throw new Error("Could not find a username in your Roblox profile.");
          }
        } catch (e: any) {
          console.error("Failed to process user info:", e);
          throw e;
        }
      };

      const exchangeToken = async () => {
        try {
          const codeVerifier = localStorage.getItem("apex_code_verifier");
          if (!codeVerifier) {
            throw new Error("Security verifier missing. Please try signing in again.");
          }

          console.log("Exchanging code for token (direct)...");
          const tokenRes = await fetch("https://apis.roblox.com/oauth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: "1434336652378086576",
              grant_type: "authorization_code",
              code: code,
              code_verifier: codeVerifier,
              redirect_uri: window.location.origin + "/dashboard",
            }),
          });

          let tokenData;
          if (!tokenRes.ok) {
            console.warn("Direct exchange failed or CORS issue, falling back to proxy...");
            const proxyRes = await fetch("/api/auth/roblox/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                client_id: "1434336652378086576",
                grant_type: "authorization_code",
                code: code,
                code_verifier: codeVerifier,
                redirect_uri: window.location.origin + "/dashboard",
              }),
            });
            
            if (!proxyRes.ok) {
              const proxyResFallback = await fetch("/api/auth/roblox/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                  client_id: "1434336652378086576",
                  grant_type: "authorization_code",
                  code: code,
                  code_verifier: codeVerifier,
                  redirect_uri: "https://apex-rblx.vercel.app/dashboard",
                }),
              });
              if (!proxyResFallback.ok) {
                const err = await proxyResFallback.json().catch(() => ({}));
                throw new Error(err.error_description || err.error || "Token exchange failed.");
              }
              tokenData = await proxyResFallback.json();
            } else {
              tokenData = await proxyRes.json();
            }
          } else {
            tokenData = await tokenRes.json();
          }

          await handleTokenResponse(tokenData);
          
          setTimeout(() => {
            setIsExchanging(false);
            navigate("/dashboard", { replace: true });
          }, 800);

        } catch (e: any) {
          console.error("Auth flow failed:", e);
          setAuthError(e.message || "Connection failed.");
          setIsExchanging(false);
        }
      };

      exchangeToken();
    }
  }, [location.search, navigate]);

  if (authError) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <X className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Connection Error</h2>
          <p className="text-white/50 text-sm mb-10 leading-relaxed font-medium">{authError}</p>
          <button 
            onClick={() => {
              localStorage.removeItem("apex_code_verifier");
              setAuthError(null);
              navigate("/sign-in");
            }}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-emerald-400 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isExchanging) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-white font-black uppercase tracking-[0.3em]">
              Synchronizing Profile
            </p>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse">
              Fetching Roblox Identity
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/sign-in"
        element={
          <AuthPage
            onLogin={() => {
              navigate("/dashboard");
            }}
            onBack={() => navigate("/")}
          />
        }
      />
      <Route path="/dashboard" element={<ChatWorkspace key={authKey} />} />
      <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
      <Route path="/terms-of-service" element={<LegalPage page="terms" />} />
    </Routes>
  );
}
