import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../../src/data/projects";

const pages = ["/", "/work/", "/experience/", "/about/", "/resume/", ...projects.map((p) => `/work/${p.slug}/`)];

const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
};

for (const path of pages) {
  test.describe(`page ${path}`, () => {
    test("loads cleanly with correct metadata", async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/Kunal Goenka/);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
      const ld = await page.locator('script[type="application/ld+json"]').textContent();
      expect(JSON.parse(ld!)[0].name).toBe("Kunal Goenka");
      await page.waitForTimeout(300);
      expect(errors).toEqual([]);
    });

    test("has no accessibility violations", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await page.waitForFunction(() => document.getAnimations().every((a) => a.timeline !== document.timeline || a.playState !== "running"));
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });

    test("passes accessibility checks in dark mode", async ({ page }) => {
      await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
    });
  });
}

test.describe("responsive layout", () => {
  const sizes: [number, number][] = [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [375, 812]
  ];
  for (const [w, h] of sizes) {
    test(`no horizontal overflow at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      for (const path of pages) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, path).toBeLessThanOrEqual(0);
        // Every graph node label must fit inside its button.
        const clipped = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>(".node")]
            .filter((n) => n.offsetParent && n.scrollWidth > n.clientWidth + 1)
            .map((n) => n.textContent?.trim())
        );
        expect(clipped, path).toEqual([]);
      }
    });
  }

  test("interactive targets are at least 24px", async ({ page }) => {
    for (const path of ["/", "/about/", "/work/agentic-rag/"]) {
      await page.goto(path);
      // Measure settled layout, not mid-animation (the laptop lid opens on load).
      await page.waitForFunction(() => document.getAnimations().every((a) => a.timeline !== document.timeline || a.playState !== "running"));
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a, button")]
          .filter((el) => el.offsetParent && !el.closest(".prose, .points, .seen, .recognition, .nf"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width < 24 || r.height < 24;
          })
          .map((el) => el.outerHTML.slice(0, 80))
      );
      expect(small, path).toEqual([]);
    }
  });

  // Apple's Human Interface Guidelines: touch targets of at least 44x44pt.
  // Inline links inside running text are exempt, as they are on iOS.
  test("on phones, controls meet Apple's 44pt touch minimum", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch-size rule");
    // Scroll reveals briefly scale content as it enters; measure the settled size.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/work/", "/work/agentic-rag/", "/experience/", "/about/", "/resume/"]) {
      await page.goto(path);
      await page.waitForFunction(() => document.getAnimations().every((a) => a.timeline !== document.timeline || a.playState !== "running"));
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a, button, input[type=text], [role=tab]")]
          .filter((el) => el.offsetParent && getComputedStyle(el).visibility !== "hidden")
          .filter((el) => !el.closest("p, .prose, .points, .seen, .recognition, .nf"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width + 0.5 < 44 || r.height + 0.5 < 44;
          })
          .map((el) => `${el.outerHTML.slice(0, 60)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)
      );
      expect(small, path).toEqual([]);
    }
  });
});

test.describe("navigation", () => {
  test("primary nav reaches every section", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work\/$/);
    await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Experience" }).click();
    await expect(page.locator("h1")).toHaveText("Experience");
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page.locator("h1")).toHaveText("About");
    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("case studies chain to the next project", async ({ page }) => {
    await page.goto(`/work/${projects[0]!.slug}/`);
    await page.getByRole("navigation", { name: "Next project" }).getByRole("link").click();
    await expect(page.locator("h1")).toHaveText(projects[1]!.title);
  });

  test("unknown paths return the 404 page", async ({ page }) => {
    const res = await page.goto("/does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("This page doesn't exist");
  });

  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard test");
    await page.goto("/about/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("links", () => {
  test("every internal link and asset resolves", async ({ page, request }) => {
    // Crawls every page serially; under full parallel load this can exceed the 30s default.
    test.slow();
    const seen = new Set<string>();
    for (const path of [...pages, "/404/"]) {
      await page.goto(path);
      const urls = await page.evaluate(() => [
        ...[...document.querySelectorAll<HTMLAnchorElement>("a[href]")].map((a) => a.href),
        ...[...document.querySelectorAll<HTMLImageElement>("img")].map((i) => i.currentSrc || i.src),
        ...[...document.querySelectorAll<HTMLLinkElement>("link[href]")].map((l) => l.href)
      ]);
      for (const u of urls) {
        const url = new URL(u);
        if (url.origin !== "http://localhost:4321" && !url.hostname.endsWith("kunalgoenka.com")) continue;
        const local = `http://localhost:4321${url.pathname}`;
        if (seen.has(local)) continue;
        seen.add(local);
        const res = await request.get(local);
        expect(res.status(), `${u} on ${path}`).toBe(200);
      }
      // Same-page anchors must have a target.
      const missing = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) => a.getAttribute("href")!).filter((h) => h.length > 1 && !document.querySelector(h))
      );
      expect(missing, path).toEqual([]);
    }
  });

  test("contact links point to Kunal's verified accounts", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: "k.goenka23@gmail.com" })).toHaveAttribute("href", "mailto:k.goenka23@gmail.com");
    await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", "https://www.linkedin.com/in/kunalgoenka23/");
    await expect(contact.getByRole("link", { name: /^GitHub/ })).toHaveAttribute("href", "https://github.com/itskunal23");
  });
});

test.describe("execution graph", () => {
  test("selecting a step shows its explanation", async ({ page }) => {
    await page.goto("/work/agentic-rag/");
    const fig = page.locator("#graph-agentic-rag");
    await fig.getByRole("button", { name: /^BM25 \+ vectors/ }).click();
    await expect(fig.getByRole("button", { name: /^BM25 \+ vectors/ })).toHaveAttribute("aria-pressed", "true");
    await expect(fig.locator(".step:not([hidden]) .step-body")).toContainText("BM25");
  });

  test("arrow keys move between steps", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard test");
    await page.goto("/work/ncr-entity-resolution/");
    const fig = page.locator("#graph-ncr-entity-resolution");
    await fig.getByRole("button", { name: /^NCR records/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(fig.getByRole("button", { name: /^Heuristic rules/ })).toBeFocused();
    await expect(fig.getByRole("button", { name: /^Heuristic rules/ })).toHaveAttribute("aria-pressed", "true");
  });

  test("tracing lights the path and alternates routes", async ({ page }) => {
    await page.goto("/work/safety-manual-search/");
    const fig = page.locator("#graph-safety-manual-search");
    const trace = fig.getByRole("button", { name: "Trace a request" });
    await trace.click();
    await expect(fig.locator("[data-trace-label]")).toHaveText("Traced: confident", { timeout: 5000 });
    await expect(fig.locator(".node.is-lit")).toHaveCount(5);
    await trace.click();
    await expect(fig.locator("[data-trace-label]")).toHaveText("Traced: needs a person", { timeout: 5000 });
    await expect(fig.getByRole("button", { name: /^Human review/ })).toHaveClass(/is-lit/);
  });

});

test("copy email button copies the address", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "clipboard permissions are desktop-only in Chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("k.goenka23@gmail.com");
});

test.describe("engineer mode", () => {
  test("switches copy and palette, and persists", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("[data-mode-toggle]");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".hero .intro .tone-plain")).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("html")).toHaveAttribute("data-mode", "engineer");
    await expect(page.locator(".hero .intro .tone-engineer")).toBeVisible();
    await expect(page.locator(".hero .intro .tone-plain")).toBeHidden();
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-mode", "engineer");
    await expect(page.locator("[data-mode-toggle]")).toHaveAttribute("aria-pressed", "true");
  });

  test("has no accessibility violations", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("mode", "engineer"));
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("pipeline playground", () => {
  test("runs alternate routes and writes a log", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const play = page.locator("[data-play]");
    await play.scrollIntoViewIfNeeded();
    await play.locator("[data-run]").click();
    await expect(play.locator("[data-log-title]")).toHaveText(/confident answer/i);
    await expect(play.locator("[data-log] li")).toHaveCount(8);
    await play.locator("[data-run]").click();
    await expect(play.locator("[data-log-title]")).toHaveText(/handed to a person/i);
    await expect(play.locator("[data-log] li")).toHaveCount(9);
  });

  test("steps move with the keyboard and stay on the board", async ({ page }) => {
    await page.goto("/");
    const board = page.locator("[data-board]");
    const card = board.locator('[data-card="question"]');
    await card.focus();
    const before = await card.boundingBox();
    for (let i = 0; i < 40; i++) await page.keyboard.press("Shift+ArrowLeft");
    const after = (await card.boundingBox())!;
    const box = (await board.boundingBox())!;
    expect(after.x).toBeLessThanOrEqual(before!.x);
    expect(after.x).toBeGreaterThanOrEqual(box.x);
    await page.getByRole("button", { name: "Reset layout" }).click();
    await expect.poll(async () => Math.round((await card.boundingBox())!.x)).toBe(Math.round(before!.x));
  });
});

test.describe("role-fit check", () => {
  test("keyboard users confirm with Next and get a prefilled email", async ({ page }) => {
    await page.goto("/");
    // The hero button shows at every width; the floating pill hides beside it on phones.
    await page.getByRole("button", { name: "Check my role fit" }).click();
    const quiz = page.locator("[data-quiz]");
    await expect(quiz).toBeVisible();
    const next = () => quiz.locator("fieldset:not([hidden]) [data-next]");
    await expect(next()).toBeDisabled();
    for (const label of ["AI or ML engineering", "Reliability in production", "A large or regulated enterprise"]) {
      await quiz.getByLabel(label).focus();
      await page.keyboard.press("Space");
      await expect(next()).toBeEnabled();
      await next().click();
    }
    const result = quiz.locator("[data-result]");
    await expect(result).toBeVisible();
    await expect(result.locator("[data-score]")).toContainText("of 3 answers map directly to shipped work");
    await expect(result.locator("[data-evidence] > li")).toHaveCount(3);
    const href = await result.locator("[data-mail]").getAttribute("href");
    expect(href).toMatch(/^mailto:k\.goenka23@gmail\.com\?subject=/);
    expect(decodeURIComponent(href!)).toContain("I'm hiring for: AI or ML engineering");
    await result.getByRole("button", { name: "Start over" }).click();
    await expect(quiz.locator("fieldset").first()).toBeVisible();
  });
});

test.describe("role-fit dialog", () => {
  test("on phones, the floating pill steps aside while the hero button is on screen", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the floating pill only shows below desktop widths");
    await page.goto("/");
    const pill = page.getByRole("button", { name: "Role-fit check", exact: true });
    await expect(pill).toBeHidden();
    await page.getByRole("heading", { name: "Selected work" }).scrollIntoViewIfNeeded();
    await expect(pill).toBeVisible();
  });

  test("opens from the pill, traps focus, and Esc returns focus", async ({ page }) => {
    await page.goto("/work/");
    const pill = page.getByRole("button", { name: "Role-fit check", exact: true });
    await pill.click();
    const dialog = page.getByRole("dialog", { name: "Role-fit check" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("[data-fit] input").first()).toBeFocused();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(pill).toBeFocused();
  });

  test("the hero button opens the same dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Check my role fit" }).click();
    await expect(page.getByRole("dialog", { name: "Role-fit check" })).toBeVisible();
    await page.getByRole("button", { name: "Close role-fit check" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("engineer mode layout", () => {
  test("toggling never shifts layout and swaps card metrics", async ({ page }) => {
    await page.goto("/work/");
    const height = async () => (await page.locator("main").boundingBox())!.height;
    const metric = page.locator('a[href="/work/document-ingestion/"] .metric');
    const before = await height();
    await expect(metric.locator(".tone-plain")).toContainText("4,500+");
    await page.locator("[data-mode-toggle]").click();
    await expect(metric.locator(".tone-engineer")).toBeVisible();
    await expect(metric.locator(".tone-engineer")).toContainText("P95 retrieval latency");
    expect(await height()).toBe(before);
  });
});

test.describe("hero laptop", () => {
  test("tabs switch files by click and arrow keys", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("tablist", { name: "Example files" });
    await expect(page.getByRole("tabpanel")).toContainText("StateGraph");
    await tabs.getByRole("tab", { name: "retrieve.py" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("bm25.search");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.getByRole("tab", { name: "gate.py" })).toBeFocused();
    await expect(tabs.getByRole("tab", { name: "gate.py" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("THRESHOLD");
  });

  test("Run traces a request, then the next run hands off to a person", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const laptop = page.locator("[data-laptop]");
    const run = laptop.locator("[data-run]");
    await run.click();
    await expect(laptop.locator(".result")).toHaveText(/Answered, with citations/);
    await expect(run).toHaveText(/Run again/);
    await run.click();
    await expect(laptop.locator(".result")).toHaveText(/Routed to a person/);
  });
});

test.describe("proof strip", () => {
  test("every figure links to its case study", async ({ page }) => {
    await page.goto("/");
    const links = page.getByRole("region", { name: "Results at a glance" }).getByRole("link");
    await expect(links).toHaveCount(4);
    await links.first().click();
    await expect(page).toHaveURL(/\/work\/ncr-entity-resolution\/$/);
  });
});

test.describe("hero terminal", () => {
  test("commands print, and free-text questions get a simulated run", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const laptop = page.locator("[data-laptop]");
    const input = laptop.getByLabel("Ask the simulated agent, or type help");
    await input.fill("help");
    await input.press("Enter");
    await expect(laptop.locator("[data-log]")).toContainText("whoami  projects  contact  clear");
    await input.fill("projects");
    await input.press("Enter");
    await expect(laptop.locator('[data-log] a[href="/work/agentic-rag/"]')).toBeVisible();
    await input.fill("How do you evaluate retrieval?");
    await input.press("Enter");
    await expect(laptop.locator(".result")).toHaveText(/Answered, with citations|Routed to a person/);
  });
});

test.describe("interactive résumé", () => {
  test("the hero link opens it, and it never shows a phone number", async ({ page }) => {
    await page.goto("/");
    await page.locator(".hero").getByRole("link", { name: "Résumé", exact: true }).click();
    await expect(page).toHaveURL(/\/resume\/$/);
    await page.getByRole("button", { name: "Skip typing" }).click();
    const text = (await page.locator("[data-resume]").innerText()) + (await page.content());
    expect(text).not.toMatch(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/);
    await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("href", "/files/kunal-goenka-resume.pdf");
  });

  test("types itself out, and Skip typing reveals everything", async ({ page }) => {
    await page.goto("/resume/");
    const front = page.getByRole("article", { name: "Résumé, experience" });
    await expect(front.getByText("Kunal Goenka", { exact: true })).toBeVisible();
    // Typing is under way: the caret is showing.
    await expect(front.locator(".caret")).toBeVisible();
    await page.getByRole("button", { name: "Skip typing" }).click();
    await expect(page.getByRole("button", { name: "Skip typing" })).toBeHidden();
    await expect(front.locator(".caret")).toBeHidden();
    expect(await page.evaluate(() => CSS.highlights.get("tw-untyped")?.size ?? 0)).toBe(0);
    expect(await page.evaluate(() => document.querySelector("[data-resume]")!.classList.contains("tw"))).toBe(false);
  });

  test("turns the page to education and skills, and back", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/resume/");
    const toBack = page.getByRole("button", { name: "Education and skills" });
    await toBack.click();
    await expect(toBack).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeHidden();
    await page.getByRole("button", { name: "Experience" }).click();
    await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeVisible();
  });

  test("without JavaScript, both sides are readable and the controls stay out of the way", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/resume/");
    await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Skip typing" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Education and skills" })).toBeHidden();
    await ctx.close();
  });
});
