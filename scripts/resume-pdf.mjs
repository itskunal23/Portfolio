// Regenerates public/files/kunal-goenka-resume.pdf from the /resume/ page, so
// the download always matches the site's data (and never carries a phone
// number). Run against the preview server: node scripts/resume-pdf.mjs
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:4321";
const out = process.argv[2] || "public/files/kunal-goenka-resume.pdf";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ reducedMotion: "reduce" });
await page.goto(`${base}/resume/`, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: out, format: "Letter", preferCSSPageSize: true, printBackground: false, tagged: true, outline: true });
await browser.close();
console.log("wrote", out);
