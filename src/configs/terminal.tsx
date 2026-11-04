import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-bio",
        title: "bio.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-2">
            <div>
              Hi, I'm Kunal Goenka, an AI Engineer in the Washington DC–Baltimore area.
            </div>
            <div>
              I build complete AI systems: agentic architectures, Model Context Protocol
              (MCP) tool servers, and enterprise Retrieval-Augmented Generation (RAG)
              running in production, including regulated environments such as Azure
              Government Cloud.
            </div>
          </div>
        )
      },
      {
        id: "about-focus",
        title: "focus.txt",
        type: "file",
        content:
          "Agentic systems / Enterprise RAG / MCP tool servers / LangGraph orchestration / NLP & semantic search / AI infrastructure"
      },
      {
        id: "about-philosophy",
        title: "philosophy.txt",
        type: "file",
        content: (
          <div className="py-1">
            An AI system is only as reliable as the architecture around the model. Good
            retrieval, deterministic execution, validation, observability, and human
            oversight are what move a project from a demo to something people can rely on.
          </div>
        )
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:k.goenka23@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                k.goenka23@gmail.com
              </a>
            </li>
            <li>Phone: 540-424-1253</li>
            <li>Location: Washington DC–Baltimore Area</li>
          </ul>
        )
      }
    ]
  },
  {
    id: "experience",
    title: "experience",
    type: "folder",
    children: [
      {
        id: "exp-boeing",
        title: "boeing.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-green-300">
              Data Scientist, Applied AI Systems | The Boeing Company (Jan 2026 – Present)
            </div>
            <div>
              - Enterprise Agentic RAG platform on MCP + LangGraph; -60% hallucinations
            </div>
            <div>
              - NCR engineering cycle time cut 95% (80h → 4h per aircraft program)
            </div>
            <div>
              - Async defense document ingestion pipeline, &lt;1.2s P95 retrieval latency
            </div>
            <div>
              - Led 7-person team on an Azure Gov Cloud recruiting platform (630+ hiring
              managers)
            </div>
            <div>- CTO Performance &amp; Innovation Award</div>
          </div>
        )
      },
      {
        id: "exp-elora",
        title: "elora.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div className="text-green-300">
              Data Scientist, ELORA (Jul 2025 – Jan 2026)
            </div>
            <div>
              - Multilingual NLP pipeline (RoBERTa + spaCy), validation F1 0.90 → 0.98
            </div>
            <div>
              - Semantic search platform on ChromaDB with JWT, RBAC, citation validation
            </div>
            <div>- Led 5-person team; AI Skill Gap Analysis MVP in under 6 weeks</div>
          </div>
        )
      },
      {
        id: "exp-earlier",
        title: "earlier.txt",
        type: "file",
        content: (
          <div className="py-1 space-y-1">
            <div>Boeing, Supplier Quality Intern (Jun–Aug 2024)</div>
            <div>Tech Fellows, Technology Analyst (Aug 2023 – Jan 2024)</div>
          </div>
        )
      }
    ]
  },
  {
    id: "skills",
    title: "skills",
    type: "folder",
    children: [
      {
        id: "skills-ai",
        title: "ai-systems.txt",
        type: "file",
        content:
          "MCP / LangGraph / Agentic state machines / RAG / Hybrid retrieval (BM25 + dense) / Cross-encoder reranking / LLM-as-a-judge / Human-in-the-loop routing / Semantic search / NLP / Transformers"
      },
      {
        id: "skills-eng",
        title: "software.txt",
        type: "file",
        content:
          "Python / FastAPI / TypeScript / React / Java / Spring Boot / Node.js / SQL / REST APIs / Docker / PyTest / CI/CD / Git"
      },
      {
        id: "skills-cloud",
        title: "cloud-data.txt",
        type: "file",
        content: "Azure Government Cloud / AWS S3 / ChromaDB / MySQL / OpenTelemetry"
      }
    ]
  },
  {
    id: "readme",
    title: "readme.txt",
    type: "file",
    content: (
      <div className="py-1">
        Tip: run <span className="text-red-400">ls</span> to list sections, then{" "}
        <span className="text-red-400">cd about</span> and{" "}
        <span className="text-red-400">cat bio.txt</span>. Open the{" "}
        <span className="text-yellow-200">Bear</span> app for full project case studies.
      </div>
    )
  }
];

export default terminal;
