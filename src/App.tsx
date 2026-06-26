import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChatWorkspace from "./components/ChatWorkspace";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LegalPage from "./components/LegalPage";

export default function App() {
  const [isExchanging, setIsExchanging] = useState(false);
  const [authKey, setAuthKey] = useState(0);
  const exchangeStarted = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code && !exchangeStarted.current) {
      exchangeStarted.current = true;
      setIsExchanging(true);

      const exchangeToken = async () => {
        try {
          const codeVerifier = localStorage.getItem("apex_code_verifier");
          if (!codeVerifier) {
            throw new Error("No code verifier found");
          }

          const tokenRes = await fetch("/api/auth/roblox/token", {
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

          const tokenData = await tokenRes.json();

          if (tokenData.access_token) {
            const userRes = await fetch("/api/auth/roblox/userinfo", {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const userData = await userRes.json();

            if (userData.preferred_username) {
              localStorage.setItem(
                "apex_username",
                userData.preferred_username,
              );
              
              // Fetch avatar if we have the user ID (sub)
              let avatarUrl = userData.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.preferred_username}&backgroundColor=232527`;
              
              if (userData.sub && (!userData.picture || !userData.picture.includes("roblox.com"))) {
                try {
                  const thumbRes = await fetch(`/api/auth/roblox/avatar?userIds=${userData.sub}&size=420x420&format=Png&isCircular=true`);
                  const thumbData = await thumbRes.json();
                  if (thumbData?.data?.[0]?.imageUrl) {
                    avatarUrl = thumbData.data[0].imageUrl;
                  }
                } catch (e) {
                  console.error("Failed to fetch Roblox thumbnail:", e);
                }
              }

              localStorage.setItem("apex_avatar", avatarUrl);
              setAuthKey((k) => k + 1);
            }
          }
        } catch (e) {
          console.error("Token exchange failed:", e);
        } finally {
          setIsExchanging(false);
          navigate("/dashboard", { replace: true });
        }
      };

      exchangeToken();
    }
  }, [location.search, navigate]);

  if (isExchanging) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <span className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></span>
          <p className="text-sm text-white/50 uppercase tracking-widest font-bold">
            Connecting to Roblox...
          </p>
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
