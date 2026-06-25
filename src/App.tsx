import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChatWorkspace from "./components/ChatWorkspace";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LegalPage from "./components/LegalPage";

export default function App() {
  const [isExchanging, setIsExchanging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code && !isExchanging) {
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
              redirect_uri: window.location.origin + "/dashboard",
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
              localStorage.setItem(
                "apex_avatar",
                userData.picture ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.preferred_username}&backgroundColor=232527`,
              );
            }
          }
        } catch (e) {
          console.error("Token exchange failed:", e);
        } finally {
          setIsExchanging(false);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          // Only navigate if we're not already on the dashboard to avoid extra re-renders
          if (location.pathname !== "/dashboard") {
            navigate("/dashboard", { replace: true });
          } else {
            // Force a reload so the dashboard picks up the new localStorage items
            window.location.reload();
          }
        }
      };

      exchangeToken();
    }
  }, [location.search, navigate, isExchanging]);

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
      <Route path="/dashboard" element={<ChatWorkspace />} />
      <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
      <Route path="/terms-of-service" element={<LegalPage page="terms" />} />
    </Routes>
  );
}
