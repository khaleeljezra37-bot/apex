import app from "./app.ts";
console.log("App loaded successfully");
console.log("App type:", typeof app);
if (typeof app === 'function') {
    console.log("App is likely an express instance");
}
