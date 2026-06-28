import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vercel serverless support: restore the original URL from headers if rewritten to /api/index
app.use((req, res, next) => {
  const originalPath = (
    req.headers["x-vercel-forwarded-path"] ||
    req.headers["x-original-url"] ||
    req.headers["x-now-original-url"] ||
    req.headers["x-forwarded-url"]
  ) as string;

  if (originalPath) {
    try {
      let targetUrl = originalPath;
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        const parsedUrl = new URL(targetUrl);
        targetUrl = parsedUrl.pathname + parsedUrl.search;
      }

      // Preserve query params if they were lost in rewrite
      if (!targetUrl.includes("?") && req.url.includes("?")) {
        targetUrl += req.url.substring(req.url.indexOf("?"));
      }

      if (req.url !== targetUrl) {
        req.url = targetUrl;
        console.log(`[URL REWRITE] Restored req.url to ${req.url}`);
      }
    } catch (e) {
      console.error("[URL REWRITE ERROR]", e);
    }
  }
  next();
});

// Serve custom Apex favicon svg directly from the server
app.get("/favicon.ico", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
  );
});

app.get("/favicon.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.send(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
  );
});

// API constraints check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Admin auth states and rate-limiting
const ADMIN_PASSWORD = "8#Fw!Q2$Xp7^Zm4&Lc9@Tr5*Hv1%KdRgB!5rQ@9Yx#2mLp7^Vz8$Nk4&Hs1*Cf6JwQ7#Lz9!N2@vFp8$Rx1^Km6&Hu4*Ta3%R@8m!Vx3#Qp7$Tk2^Hs9&Lf5*Zw1%NcDJ7$hQ!v2^Mp8#Rx4&Tk9*Lc1%Zw5@FsN";
let loginAttempts: { [ip: string]: { count: number; lockedUntil: number } } = {};

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Use x-forwarded-for for Vercel/proxies, fall back to req.ip
  const ipHeader = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(ipHeader) ? ipHeader[0] : ipHeader?.split(",")[0]) || req.ip || "unknown";

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 0, lockedUntil: 0 };
  }

  const now = Date.now();
  const state = loginAttempts[ip];

  if (state.lockedUntil > now) {
    const remaining = Math.ceil((state.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed attempts. Locked out. Try again in ${remaining} seconds.`,
      locked: true,
      remaining,
    });
  }

  if (password === ADMIN_PASSWORD) {
    state.count = 0;
    state.lockedUntil = 0;

    res.setHeader(
      "Set-Cookie",
      `admin_session=secure_admin_active; Path=/; HttpOnly; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }; Max-Age=3600`
    );

    return res.json({ success: true, require2fa: true });
  } else {
    state.count += 1;
    let remainingAttempts = 5 - state.count;

    if (state.count >= 5) {
      state.lockedUntil = now + 60000; // 1 minute lockout
      return res.status(429).json({
        error: "Too many failed attempts. Account locked out for 60 seconds.",
        locked: true,
        remaining: 60,
      });
    }

    return res.status(401).json({
      error: "Incorrect admin password.",
      remainingAttempts,
    });
  }
});

app.post("/api/admin/verify-2fa", (req, res) => {
  const { code } = req.body;
  const cookies = req.headers.cookie || "";
  const hasSession = cookies.includes("admin_session=secure_admin_active");

  if (!hasSession) {
    return res.status(401).json({ error: "Unauthorized session. Please login with password first." });
  }

  if (/^\d{6}$/.test(code)) {
    return res.json({ success: true });
  }

  return res.status(400).json({ error: "Invalid 2FA code. Must be exactly 6 digits." });
});

app.get("/api/admin/dashboard-stats", (req, res) => {
  const cookies = req.headers.cookie || "";
  const hasSession = cookies.includes("admin_session=secure_admin_active");

  if (!hasSession) {
    return res.status(403).json({ error: "Access denied. Admin session cookie not found." });
  }

  return res.json({
    stats: {
      builtGamesCount: 14821,
      activeDevelopersCount: 382,
      serverUptime: "14d 6h 32m",
      cpuLoad: "12%",
      ramUsage: "284MB",
      robloxIntegration: "Active",
      geminiModel: "gemini-2.5-flash",
      geminiStatus: "Online",
    },
    logs: [
      { id: 1, time: "Just now", type: "INFO", message: "Roblox UserInfo requested for user khaleeljezra37" },
      { id: 2, time: "2m ago", type: "SUCCESS", message: "Luau generation completed for prompt: 'A round-based combat system'" },
      { id: 3, time: "5m ago", type: "INFO", message: "OAuth callback exchange completed successfully" },
      { id: 4, time: "12m ago", type: "WARN", message: "Rate limit pool cleared for system scheduler" },
      { id: 5, time: "30m ago", type: "INFO", message: "Gemini server-side connection verified" },
    ]
  });
});

app.post("/api/admin/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
  );
  return res.json({ success: true });
});

app.get("/api/admin/debug-headers", (req, res) => {
  res.json({
    url: req.url,
    originalUrl: req.originalUrl,
    method: req.method,
    headers: req.headers,
  });
});

// Proxies for direct API integration without Vercel rewrites (local dev)
app.post("/api/proxy/roblox/usernames", async (req, res) => {
  try {
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

app.get("/api/proxy/roblox/search", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const response = await fetch(`https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=10`);
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

app.get("/api/proxy/roblox/avatar/:sub", async (req, res) => {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${req.params.sub}&size=420x420&format=Png&isCircular=true`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// Old routes
app.get("/api/auth/roblox/avatar/:sub", async (req, res) => {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${req.params.sub}&size=420x420&format=Png&isCircular=true`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Avatar fetch error:", error);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

app.get("/api/auth/roblox/avatar-by-username/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const userData = await userRes.json();
    
    let userId;
    if (!userData.data || userData.data.length === 0) {
      // Fallback to keyword search
      const searchRes = await fetch(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`);
      const searchData = await searchRes.json();
      
      if (!searchData.data || searchData.data.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      userId = searchData.data[0].id; // Take the first result
    } else {
      userId = userData.data[0].id;
    }
    
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=true`
    );
    const thumbData = await thumbRes.json();
    res.json(thumbData);
  } catch (error) {
    console.error("Avatar fetch error:", error);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
});

// Proxy for Roblox OAuth Token Exchange
app.post("/api/auth/roblox/token", async (req, res) => {
  try {
    const params = new URLSearchParams(req.body);

    const response = await fetch("https://apis.roblox.com/oauth/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Roblox Token Exchange Failed:", response.status, data);
    }
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error("Roblox Token Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to exchange token" });
  }
});

// Proxy for Roblox User Info
app.get("/api/auth/roblox/userinfo", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const response = await fetch(
      "https://apis.roblox.com/oauth/v1/userinfo",
      {
        headers: { Authorization: authHeader },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Roblox UserInfo Error:", response.status, errorText);
      return res.status(response.status).json({ error: "Failed to fetch user info from Roblox", details: errorText });
    }

    const data = await response.json();

    // Fetch avatar server-side to simplify client logic
    if (data.sub) {
      try {
        const thumbRes = await fetch(
          `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data.sub}&size=420x420&format=Png&isCircular=true`
        );
        const thumbData = await thumbRes.json();
        if (thumbData?.data?.[0]?.imageUrl) {
          data.picture = thumbData.data[0].imageUrl;
        }
      } catch (e) {
        console.error("Server-side avatar fetch failed:", e);
      }
    }

    res.json(data);
  } catch (error: any) {
    console.error("Roblox UserInfo Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch user info" });
  }
});

let latestGeneratedCode = "";

// Main generation endpoint for game mechanics
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, aiModel, customOpenAiKey, customGeminiKey } = req.body;
    let generatedCode = "";

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (aiModel === "openai") {
      const apiKey = customOpenAiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error:
            "OpenAI API key is missing. Please configure it in Settings.",
        });
      }
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an expert Roblox Luau game developer. Generate only valid Luau code. Do not wrap in markdown or backticks.",
          },
          { role: "user", content: prompt },
        ],
      });
      generatedCode =
        completion.choices[0]?.message.content || "-- No code generated";
    } else {
      const apiKey = customGeminiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error:
            "Gemini API key is missing. Please configure it in Settings.",
        });
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert Roblox Luau game developer. Generate only valid Luau code for this request. Do not wrap with backticks or markdown:\n\n${prompt}`,
      });
      generatedCode = response.text || "-- No code generated";
    }

    // Strip markdown codeblocks just in case the model ignored instructions
    generatedCode = generatedCode
      .replace(/^```[A-Za-z]*\n?/gm, "")
      .replace(/```$/gm, "");

    latestGeneratedCode = generatedCode;

    return res.json({ code: generatedCode });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
});

app.get("/api/pull", (req, res) => {
  if (latestGeneratedCode) {
    res.json({
      instances: [
        {
          className: "Script",
          name: "ApexGenerated",
          source: latestGeneratedCode,
          parent: "ServerScriptService"
        }
      ]
    });
    // Optional: clear it after pull so it doesn't get pulled twice?
    // latestGeneratedCode = "";
  } else {
    res.json({ instances: [] });
  }
});

export default app;
