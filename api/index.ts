export default async function handler(req: any, res: any) {
  try {
    const module = await import("../app.js").catch(async () => {
      // Fallback if .js is not resolved (TypeScript environments)
      return await import("../app.ts").catch(async () => {
        return await import("../app");
      });
    });
    
    const app = module.default || module;
    if (typeof app === 'function') {
      return app(req, res);
    } else {
      throw new Error("Express app is not a function. Export type: " + typeof app);
    }
  } catch (error: any) {
    console.error("[VERCEL RUNTIME ERROR]", error);
    res.status(500).json({
      error: "Vercel Function Crashed",
      message: error?.message || String(error),
      stack: error?.stack || "No stack trace"
    });
  }
}
