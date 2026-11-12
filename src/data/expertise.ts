// Grouped by the job each tool does in a shipped system, with the work it
// appears in. Only technologies named on LinkedIn or the résumé are listed.
export const expertise = [
  {
    area: "Agentic systems and retrieval",
    what: "Planning, tool use, and retrieval that can show its sources. This is where most of my current work sits.",
    tools: [
      "Model Context Protocol (MCP)",
      "LangGraph state machines",
      "Hybrid retrieval (BM25 and dense vectors)",
      "Cross-encoder reranking",
      "Multi-step query decomposition",
      "Schema-validated tool execution",
      "Citation self-evaluation, LLM-as-a-judge",
      "Confidence-based human review"
    ],
    seenIn: ["agentic-rag", "safety-manual-search"]
  },
  {
    area: "Language and documents",
    what: "Turning unstructured text, in many languages and formats, into something a system can search and reason over.",
    tools: [
      "spaCy",
      "Transformer models (RoBERTa)",
      "Named entity recognition",
      "Text classification",
      "Machine translation",
      "Embeddings and ChromaDB",
      "Entity resolution",
      "Unsupervised clustering"
    ],
    seenIn: ["elora-nlp", "document-ingestion", "ncr-entity-resolution", "skill-gap"]
  },
  {
    area: "Applications and services",
    what: "The software people actually touch, and the APIs behind it.",
    tools: [
      "Python",
      "FastAPI",
      "TypeScript",
      "React",
      "Java Spring Boot",
      "Node.js",
      "Flask",
      "REST APIs"
    ],
    seenIn: ["recruiting-platform", "dinesmart"]
  },
  {
    area: "Cloud, data, and delivery",
    what: "Running all of it in regulated environments, securely and observably.",
    tools: [
      "Azure Government Cloud",
      "Azure SQL",
      "Amazon S3",
      "MySQL",
      "JWT and role-based access control",
      "Docker",
      "CI/CD, Git, PyTest",
      "OpenTelemetry",
      "Tableau"
    ],
    seenIn: ["recruiting-platform", "document-ingestion", "elora-nlp"]
  }
];
