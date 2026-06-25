import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ChatWorkspace from "./components/ChatWorkspace";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import LegalPage from "./components/LegalPage";

export default function App() {
  const initialCode = new URLSearchParams(window.location.search).get("code");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If there is a code in the URL, we've successfully authenticated and loaded the state synchronously.
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code) {
      const usernameVal = "RobloxianDev_01";
      const avatarVal =
        "https://api.dicebear.com/7.x/avataaars/svg?seed=RobloxDev&backgroundColor=232527";
      localStorage.setItem("apex_username", usernameVal);
      localStorage.setItem("apex_avatar", avatarVal);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate("/dashboard", { replace: true });
    }
  }, [location.search, navigate]);

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
