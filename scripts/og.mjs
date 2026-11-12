// Renders public/og.png (1200x630) in the system UI face, Apple-style colours.
import { chromium } from "@playwright/test";

const nodes = ["Question", "Plan", "Retrieve", "Cite", "Confidence", "Answer"];
const html = `<!doctype html><html><head><style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#ffffff;color:#1d1d1f;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:96px;font-weight:650;letter-spacing:-0.045em;line-height:.95}
p{margin-top:24px;font-size:40px;line-height:1.2;letter-spacing:-0.02em;max-width:20ch}
.row{display:flex;align-items:center;gap:0}
.n{padding:12px 18px;border:1.5px solid #d2d2d7;border-radius:12px;background:#f5f5f7;font-size:22px;font-weight:500}
.n.lit{border-color:#2b41cc;background:#d9ddf7}.n.out{background:#2b41cc;border-color:#2b41cc;color:#fff}
.e{width:34px;height:2.5px;background:#2b41cc}
.meta{font-size:24px;color:#6e6e73}
</style></head><body>
<div><h1>Kunal Goenka</h1><p>I build software at the intersection of AI systems, design, and how people think.</p></div>
<div><div class="row">${nodes.map((n, i) => `<span class="n ${i === nodes.length - 1 ? "out" : "lit"}">${n}</span>${i < nodes.length - 1 ? '<span class="e"></span>' : ""}`).join("")}</div>
<div class="meta" style="margin-top:28px">Agentic AI at Boeing. MS Computer Science, Georgia Tech.</div></div>
</body></html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("wrote public/og.png");
