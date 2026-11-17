// Source of truth: Kunal Goenka's LinkedIn profile (linkedin.com/in/kunalgoenka23),
// as supplied by Kunal in November 2026. Where LinkedIn and older material
// (the previous portfolio, the résumé PDF) disagree, LinkedIn wins. See
// CONTENT_SOURCES.md for every reconciliation.

export const profile = {
  name: "Kunal Goenka",
  // One title everywhere, matching LinkedIn and the résumé: recruiters search
  // and background checks verify the real title, so it is never paraphrased.
  headline: "AI Engineer at Boeing. Georgia Tech OMSCS.",
  philosophy: "I build software at the intersection of AI systems, design, and how people think.",
  location: "Washington DC–Baltimore Area",
  role: "AI Engineer at Boeing",
  email: "k.goenka23@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/kunalgoenka23/",
    github: "https://github.com/itskunal23",
    repo: "https://github.com/itskunal23/Portfolio",
    resume: "/files/kunal-goenka-resume.pdf"
  },
  /** Résumé summary, in Kunal's words from the résumé he supplied (November 2026). */
  summary:
    "AI engineer building production AI systems at Boeing: agentic RAG on MCP tool servers, entity resolution, document ingestion on S3, and full-stack work on Azure Government Cloud. I take ambiguous operational bottlenecks from problem discovery to production software.",
  description:
    "Kunal Goenka is an AI Engineer at Boeing building production AI systems: agentic RAG on MCP tool servers, entity resolution, document ingestion on S3, and full-stack work on Azure Government Cloud. MS Computer Science (AI) at Georgia Tech."
} as const;

/**
 * The proof strip under the hero: one scannable row of outcomes, each linking
 * to its case study. Figures come from LinkedIn (see CONTENT_SOURCES.md).
 */
export const proof = [
  { value: "95%", label: "less engineering time on NCR matching", href: "/work/ncr-entity-resolution/" },
  { value: "<1.2 s", label: "P95 retrieval over 4,500+ documents", href: "/work/document-ingestion/" },
  { value: "630+", label: "hiring managers on a platform I led", href: "/work/recruiting-platform/" },
  { value: "100K+", label: "survey responses in 10+ languages", href: "/work/elora-nlp/" }
];

/** LinkedIn "Top skills", in LinkedIn's order. */
export const topSkills = [
  "Agentic AI development",
  "Retrieval-augmented generation (RAG)",
  "Python",
  "Full-stack development",
  "Model Context Protocol (MCP)"
];

/**
 * How Kunal approaches the work. Carried over from his own writing in the
 * previous portfolio, tightened for length; no new claims.
 */
export const principles = [
  {
    title: "The model is one component",
    body: "Retrieval, orchestration, validation, and observability decide whether an AI system is reliable. Most of the engineering lives around the model."
  },
  {
    title: "Retrieval quality drives answer quality",
    body: "In enterprise RAG, hybrid search and grounded citations do more for an answer than a larger model does."
  },
  {
    title: "Be deterministic where it counts",
    body: "Agentic systems need explicit execution paths, confidence thresholds, and a defined handoff to a person when the system is unsure."
  },
  {
    title: "Make it measurable",
    body: "Tracing, metrics, and automated evaluation make a system something you can defend, not just demo."
  }
];
