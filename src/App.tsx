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
            console.error("No code verifier found in localStorage");
            return;
          }

          console.log("Exchanging code for token...");
          const tokenRes = await fetch("/api/auth/roblox/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: "1434336652378086576",
              grant_type: "authorization_code",
              code: code,
              code_verifier: codeVerifier,
              redirect_uri: window.location.origin + "/dashboard", // Try to be more dynamic
            }),
          });

          if (!tokenRes.ok) {
             // Fallback for hardcoded redirect if dynamic fails
             const tokenResFallback = await fetch("/api/auth/roblox/token", {
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
              if (!tokenResFallback.ok) throw new Error("Token exchange failed");
              return handleTokenResponse(await tokenResFallback.json());
          }

          const tokenData = await tokenRes.json();
          await handleTokenResponse(tokenData);

        } catch (e) {
          console.error("Token exchange failed:", e);
        } finally {
          // Small delay to make it feel like it's actually fetching
          setTimeout(() => {
            setIsExchanging(false);
            navigate("/dashboard", { replace: true });
          }, 1000);
        }
      };

      const handleTokenResponse = async (tokenData: any) => {
        if (!tokenData.access_token) {
          console.error("No access token in response", tokenData);
          return;
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
            
            // If picture is missing but we have sub, try proxy
            if (!avatarUrl && userData.sub) {
              try {
                console.log("Fetching avatar via proxy for sub:", userData.sub);
                const thumbRes = await fetch(`/api/proxy/roblox/avatar/${userData.sub}`);
                const thumbData = await thumbRes.json();
                if (thumbData?.data?.[0]?.imageUrl) {
                  avatarUrl = thumbData.data[0].imageUrl;
                }
              } catch (e) {
                console.error("Proxy avatar fetch failed:", e);
              }
            }

            // Final fallback to dicebear
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
            console.warn("No username found in Roblox user data", userData);
          }
        } catch (e) {
          console.error("Failed to process user info:", e);
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
            Synchronizing with Roblox...
          </p>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse">
            Fetching profile & avatar
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
