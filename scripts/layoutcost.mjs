// Measures style+layout time for a page with optional CSS overrides injected.
import { chromium } from "@playwright/test";
const path = process.argv[2] || "/";
const variants = {
  baseline: "",
  noWrapPretty: "*{text-wrap:wrap !important}",
  noContainer: ".graph{container-type:normal !important}",
  noScrollAnim: ".site-header{animation:none !important}",
  noVT: "@view-transition{navigation:none}",
  allOff: "*{text-wrap:wrap !important}.graph{container-type:normal !important}.site-header{animation:none !important}@view-transition{navigation:none}",
  baseline2: ""
};
const browser = await chromium.launch({ channel: "chrome" });
for (const [name, css] of Object.entries(variants)) {
  let total = 0;
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 412, height: 823 } });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    if (css) await page.addInitScript((c) => {
      document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = c; document.head.prepend(s); });
    }, css);
    await page.goto(`http://localhost:4321${path}`, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const { metrics } = await cdp.send("Performance.getMetrics");
    const m = Object.fromEntries(metrics.map((x) => [x.name, x.value]));
    total += (m.LayoutDuration + m.RecalcStyleDuration) * 1000;
    await ctx.close();
  }
  console.log(path, name, Math.round(total / 3), "ms");
}
await browser.close();
