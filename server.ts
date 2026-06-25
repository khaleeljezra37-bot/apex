import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

      const data = await response.json();

      // Fetch avatar if we have the user ID (sub)
      if (data.sub) {
        try {
          const thumbRes = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data.sub}&size=420x420&format=Png&isCircular=true`,
          );
          const thumbData = await thumbRes.json();
          if (thumbData?.data?.[0]?.imageUrl) {
            data.picture = thumbData.data[0].imageUrl;
          }
        } catch (e) {
          console.error("Failed to fetch Roblox thumbnail:", e);
        }
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Roblox User Info Error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch user info" });
    }
  });

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

      return res.json({ code: generatedCode });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
