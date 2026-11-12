// Usage: node scripts/shots.mjs <outDir> <path> [width height] [--dark] [--full]
import { chromium } from "@playwright/test";
const [out, path = "/", w = "1440", h = "900", ...flags] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  colorScheme: flags.includes("--dark") ? "dark" : "light",
  reducedMotion: flags.includes("--reduced") ? "reduce" : "no-preference"
});
if (flags.includes("--engineer")) await page.addInitScript(() => localStorage.setItem("mode", "engineer"));
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:4321${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(+(process.env.WAIT || 3500));
const name = `${out}/${path.replace(/\W+/g, "_") || "home"}_${w}${flags.includes("--dark") ? "_dark" : ""}${flags.includes("--engineer") ? "_eng" : ""}.png`;
await page.screenshot({ path: name, fullPage: flags.includes("--full") });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(name, "overflowX:", overflow, "errors:", errors);
await browser.close();
