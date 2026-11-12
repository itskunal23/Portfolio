// The role-fit check. Every answer maps to evidence from shipped work, and
// the verdict is computed only from that evidence: "direct" means a shipped
// project or role shows it; "partial" means related experience, stated as such.

export type Strength = "direct" | "partial";

export interface Evidence {
  text: string;
  /** Case study slug, or an absolute site path. */
  href: string;
}

export interface FitOption {
  id: string;
  label: string;
  strength: Strength;
  evidence: Evidence[];
}

export interface FitQuestion {
  id: string;
  prompt: string;
  options: FitOption[];
}

const work = (slug: string) => `/work/${slug}/`;

export const questions: FitQuestion[] = [
  {
    id: "role",
    prompt: "What are you hiring for?",
    options: [
      {
        id: "ai",
        label: "AI or ML engineering",
        strength: "direct",
        evidence: [
          { text: "Architected an agentic RAG platform on MCP tool servers", href: work("agentic-rag") },
          { text: "Multilingual NLP over 100K+ responses in 10+ languages", href: work("elora-nlp") },
          { text: "Confidence-routed search with human review", href: work("safety-manual-search") }
        ]
      },
      {
        id: "swe",
        label: "Software engineering",
        strength: "direct",
        evidence: [
          { text: "Led architecture of a React, Spring Boot, and Node.js platform for 630+ hiring managers", href: work("recruiting-platform") },
          { text: "Async FastAPI ingestion with sub-1.2 s P95 retrieval", href: work("document-ingestion") },
          { text: "Full-stack Flask and React app shipped in 48 hours", href: work("dinesmart") }
        ]
      },
      {
        id: "ds",
        label: "Data science",
        strength: "direct",
        evidence: [
          { text: "Data Scientist at Boeing since July 2025", href: "/experience/" },
          { text: "Entity resolution that cut a monthly task from 80 hours to 4", href: work("ncr-entity-resolution") },
          { text: "Unsupervised clustering for skill-gap analysis", href: work("skill-gap") }
        ]
      },
      {
        id: "other",
        label: "Something else",
        strength: "partial",
        evidence: [{ text: "The full background, to see where it overlaps", href: "/about/" }]
      }
    ]
  },
  {
    id: "priority",
    prompt: "What matters most in this role?",
    options: [
      {
        id: "reliability",
        label: "Reliability in production",
        strength: "direct",
        evidence: [
          { text: "Citation self-evaluation on every answer", href: work("agentic-rag") },
          { text: "Low-confidence answers routed to a person", href: work("safety-manual-search") },
          { text: "Latency held to the P95, not the average", href: work("document-ingestion") }
        ]
      },
      {
        id: "speed",
        label: "Shipping quickly",
        strength: "direct",
        evidence: [
          { text: "Skill-gap MVP shipped in under six weeks", href: work("skill-gap") },
          { text: "A deployed prototype in 48 hours", href: work("dinesmart") }
        ]
      },
      {
        id: "lead",
        label: "Leading engineers",
        strength: "direct",
        evidence: [
          { text: "Directed a seven-person team on the recruiting platform", href: work("recruiting-platform") },
          { text: "Led a five-person team to an MVP", href: work("skill-gap") }
        ]
      },
      {
        id: "people",
        label: "Working with non-technical people",
        strength: "direct",
        evidence: [
          { text: "Presented workforce gaps directly to HR and business leadership", href: work("skill-gap") },
          { text: "Built search that executive leadership uses", href: work("elora-nlp") },
          { text: "Pitched a prototype to Marriott corporate leadership", href: work("dinesmart") }
        ]
      }
    ]
  },
  {
    id: "setting",
    prompt: "Where would this work happen?",
    options: [
      {
        id: "enterprise",
        label: "A large or regulated enterprise",
        strength: "direct",
        evidence: [
          { text: "Shipped on Azure Government Cloud", href: work("recruiting-platform") },
          { text: "JWT and role-based access over sensitive data", href: work("elora-nlp") }
        ]
      },
      {
        id: "startup",
        label: "A startup or small product team",
        strength: "partial",
        evidence: [
          { text: "Built MVPs and prototypes end to end, though inside a large company or fellowship", href: work("skill-gap") }
        ]
      },
      {
        id: "research",
        label: "Research or academia",
        strength: "partial",
        evidence: [{ text: "MS Computer Science (AI) at Georgia Tech, in progress since August 2026", href: "/about/#education" }]
      }
    ]
  }
];

export function verdict(chosen: FitOption[]) {
  const direct = chosen.filter((o) => o.strength === "direct").length;
  const partial = chosen.length - direct;
  const score = direct + partial * 0.5;
  const headline =
    direct === chosen.length
      ? "Strong overlap with shipped work"
      : score >= 2
        ? "Good overlap, with one area to talk through"
        : "Worth a conversation";
  return { direct, partial, score, headline };
}
