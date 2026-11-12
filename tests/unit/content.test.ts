import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../../src/data/projects";
import { files as laptopFiles, terminalRuns } from "../../src/data/laptop";
import { proof } from "../../src/data/profile";
import { experience } from "../../src/data/experience";
import { expertise } from "../../src/data/expertise";
import { education } from "../../src/data/education";
import type { Graph } from "../../src/data/types";

const graphs: [string, Graph][] = projects.map((p) => [p.slug, p.graph] as [string, Graph]);

describe.each(graphs)("graph %s", (_name, g) => {
  const ids = new Set(g.nodes.map((n) => n.id));

  it("has unique node ids and cells inside the grid", () => {
    expect(ids.size).toBe(g.nodes.length);
    const cells = new Set(g.nodes.map((n) => `${n.col},${n.row}`));
    expect(cells.size).toBe(g.nodes.length);
    for (const n of g.nodes) {
      expect(n.col).toBeGreaterThanOrEqual(1);
      expect(n.col).toBeLessThanOrEqual(g.cols);
      expect(n.row).toBeGreaterThanOrEqual(1);
      expect(n.row).toBeLessThanOrEqual(g.rows);
      expect(n.detail.length).toBeGreaterThan(10);
    }
  });

  it("only connects existing nodes", () => {
    for (const e of g.edges) {
      expect(ids.has(e.from), e.from).toBe(true);
      expect(ids.has(e.to), e.to).toBe(true);
    }
  });

  it("traces walk along real edges", () => {
    const edges = new Set(g.edges.map((e) => `${e.from}>${e.to}`));
    expect(g.traces.length).toBeGreaterThan(0);
    for (const t of g.traces) {
      for (let i = 1; i < t.path.length; i++) {
        expect(edges.has(`${t.path[i - 1]}>${t.path[i]}`), `${t.label}: ${t.path[i - 1]}>${t.path[i]}`).toBe(true);
      }
    }
  });
});

describe("cross references", () => {
  const slugs = new Set(projects.map((p) => p.slug));

  it("project slugs are unique and URL-safe", () => {
    expect(slugs.size).toBe(projects.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("experience and expertise only link to real case studies", () => {
    const refs = [...experience.flatMap((e) => e.roles.flatMap((r) => r.projects ?? [])), ...expertise.flatMap((a) => a.seenIn)];
    for (const r of refs) expect(slugs.has(r), r).toBe(true);
  });
});

describe("factual accuracy against LinkedIn", () => {
  it("keeps role dates exactly as listed", () => {
    const roles = experience.flatMap((e) => e.roles.map((r) => `${r.title}|${r.start}|${r.end}`));
    expect(roles).toEqual([
      "Data Scientist|Jan 2026|Present",
      "Data Scientist|Jul 2025|Jan 2026",
      "Supplier Quality Intern|Jun 2024|Aug 2024",
      "Technology Analyst|Aug 2023|Jan 2024"
    ]);
  });

  it("keeps education dates exactly as listed", () => {
    expect(education.map((e) => `${e.start}-${e.end}`)).toEqual(["Aug 2026-May 2028", "Aug 2021-May 2025"]);
  });

  // Claims from older material that LinkedIn does not support. They must not
  // reappear anywhere in the built site. See CONTENT_SOURCES.md.
  const banned = [
    /60\s?%/,
    /35\s?%/,
    /hallucination(s)? (rate )?(down|cut|reduc)/i,
    /0\.90 to 0\.98/,
    /from 0\.90/i,
    /1,200\+? r[ée]sum[ée]s/i,
    /100\+ intern requests/i,
    /540-424/
  ];

  const dist = join(process.cwd(), "dist");
  const files: string[] = [];
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(html|xml|txt)$/.test(f)) files.push(p);
    }
  };
  try {
    walk(dist);
  } catch {
    // dist/ is created by `pnpm build`; the source check below still runs.
  }

  it.each(banned.map((b) => [b.source, b]))("built site has no unsupported claim %s", (_s, re) => {
    for (const f of files) {
      // Visible text only: inlined CSS legitimately contains percentages.
      const text = readFileSync(f, "utf8")
        .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/g, " ")
        .replace(/<[^>]+>/g, " ");
      expect(re.test(text), f).toBe(false);
    }
  });

  it("source data has no unsupported claims", () => {
    const text = JSON.stringify({ projects, experience, expertise, education, laptopFiles, terminalRuns, proof });
    for (const re of banned) expect(re.test(text), re.source).toBe(false);
  });
});

describe("proof strip", () => {
  it("every figure links to a real case study and appears in that project's data", () => {
    for (const p of proof) {
      const slug = p.href.split("/")[2]!;
      const project = projects.find((x) => x.slug === slug);
      expect(project, slug).toBeDefined();
      expect(JSON.stringify(project), `${p.value} on ${slug}`).toContain(p.value.replace(/\s/g, " "));
    }
  });
});
