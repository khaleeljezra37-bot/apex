import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API constraints check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Main generation endpoint for game mechanics
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, aiModel } = req.body;
      let generatedCode = "";

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (aiModel === "openai") {
        if (!process.env.OPENAI_API_KEY) {
          return res.status(500).json({ error: "OpenAI API key is missing" });
        }
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "system", 
              content: "You are an expert Roblox Luau game developer. Generate only valid Luau code. Do not wrap in markdown or backticks." 
            },
            { role: "user", content: prompt }
          ]
        });
        generatedCode = completion.choices[0]?.message.content || "-- No code generated";
      } else {
        if (!process.env.GEMINI_API_KEY) {
          return res.status(500).json({ error: "Gemini API key is missing" });
        }
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are an expert Roblox Luau game developer. Generate only valid Luau code for this request. Do not wrap with backticks or markdown:\n\n${prompt}`
        });
        generatedCode = response.text || "-- No code generated";
      }

      // Strip markdown codeblocks just in case the model ignored instructions
      generatedCode = generatedCode.replace(/^```[A-Za-z]*\n?/gm, '').replace(/```$/gm, '');

      return res.json({ code: generatedCode });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      return res.status(500).json({ error: error.message || "Something went wrong" });
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
