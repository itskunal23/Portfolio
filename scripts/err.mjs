import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => console.log(e.stack));
await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await b.close();
