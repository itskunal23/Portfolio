import { chromium } from "@playwright/test";
const [url, out, w = "1440", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: "networkidle", timeout: 45000 });
await p.waitForTimeout(3000);
await p.screenshot({ path: out, fullPage: true });
console.log(await p.evaluate(() => document.body.scrollHeight));
await b.close();
