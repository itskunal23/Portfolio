# Experience

The short version: I build production AI systems and lead the teams that ship them. Each
role below links to the deeper story. For the full engineering case studies (problem,
architecture, decisions, results), open **Projects** in the sidebar.

## The Boeing Company

**Data Scientist, Applied AI Systems**
Enterprise AI & Data (EAI&D) · Arlington, Virginia
*January 2026 – Present*

- Architected the enterprise **Agentic RAG Platform** on **MCP (Model Context Protocol)
  tool servers** and **LangGraph state machines**, with query decomposition, hybrid
  retrieval (BM25 + dense vectors), schema-validated tool execution, and
  **LLM-as-a-judge** citation self-evaluation. **Hallucination rate down 60%.**
- 📄📊 Engineered the **Defense Document Intelligence Pipeline**, an asynchronous
  ingestion engine on **AWS S3** parsing unstructured aerospace **PDFs** and legacy
  **Excel spreadsheets** into structured vector metadata across **4,500+ knowledge
  objects** at **sub-1.2-second P95 retrieval latency** (**FastAPI**, **Docker**).
- Built the **NCR Part Matching Template (IPC, Illustrated Parts Catalog)**, cutting
  **Nonconformance Report (NCR)** engineering cycle time **95%, from 80 hours to 4 hours
  per aircraft program**, by pairing deterministic heuristics with transformer-based
  semantic entity matching.
- Deployed **citation-grounded semantic search** across 3,000-page airline safety
  manuals, with confidence-based routing that flags low-margin predictions for
  **active-learning review** by safety engineers.
- **Led a seven-person team** delivering the **Intern Workflow Tool**, an **Azure
  Government Cloud** intern-recruiting platform (**Spring Boot, Node.js, React**) for
  **630+ hiring managers**, using **Amazon Kiro** spec-driven agentic-AI workflows to turn
  requirements into validated hiring, compliance, interview, offer, and **Workday-handoff**
  features.
- Awarded the **CTO Performance & Innovation Award** for the technical architecture and
  platform engineering behind the enterprise **2026 AI Summit** (**6,800 unique users,
  24,000 page views**).

```chart
{
  "kind": "kpi",
  "title": "Impact at Boeing",
  "stats": [
    { "value": 60, "suffix": "%", "label": "Fewer hallucinations", "detail": "agentic RAG vs. baseline", "tool": "Agentic Search RAG Template" },
    { "value": 95, "suffix": "%", "label": "NCR cycle time cut", "detail": "80 h → 4 h per program", "tool": "IPC Part Matching Template" },
    { "value": 630, "suffix": "+", "label": "Hiring managers served", "detail": "led a 7-person team", "tool": "Intern Workflow Tool" }
  ]
}
```

```chart
{
  "kind": "bar",
  "title": "NCR engineering cycle time, per aircraft program",
  "unit": "h",
  "data": [
    { "label": "Before (manual)", "value": 80, "display": "80 h" },
    { "label": "After (IPC template)", "value": 4, "display": "4 h", "highlight": true }
  ],
  "caption": "Deterministic heuristics paired with transformer-based semantic matching."
}
```

> See the full builds in **Projects**: Agentic RAG Platform, NCR Part Matching Template
> (IPC), Defense Document Intelligence Pipeline, and the Intern Workflow Tool.

**Stack:** MCP · LangGraph · Python · FastAPI · Docker · AWS S3 · ChromaDB · Spring Boot ·
Node.js · React · Azure Government Cloud

&nbsp;

## ELORA (Employee Listening, Organizational Research & Assessments)

**Data Scientist**
*July 2025 – January 2026*

- Engineered the **ELORA Multilingual NLP Pipeline** (distributed, fine-tuned **RoBERTa**
  transformers + **spaCy**) to automate NER, theme classification, and risk detection
  across **100,000+ enterprise survey responses in 10+ languages**, elevating validation
  **F1 from 0.90 to 0.98**.
- Architected the **ELORA Semantic Search Engine** on **ChromaDB** vector indexing and
  custom embeddings, with **JWT authentication** and **role-based access control (RBAC)**,
  enabling executive leadership to query historical organizational data with
  citation-backed verification.
- **Led a five-person engineering team** to design and ship the **AI Skill Gap Analysis
  MVP in under six weeks**, combining unsupervised clustering with generative synthesis to
  present actionable workforce capability gaps directly to HR and business leadership.
- Engineered the technical infrastructure for the **2025 Boeing AI Summit hub** (a separate
  event from the 2026 summit above), delivering scalable content distribution that handled
  **10,900+ page views across 3,400+ enterprise attendees**.

```chart
{
  "kind": "kpi",
  "title": "Multilingual NLP results",
  "stats": [
    { "value": 0.98, "decimals": 2, "label": "Validation F1", "detail": "up from 0.90 baseline (+0.08)" },
    { "value": 100000, "suffix": "+", "label": "Records classified", "detail": "theme, sentiment, risk" },
    { "value": 10, "suffix": "+", "label": "Languages", "detail": "single multilingual pipeline" }
  ]
}
```

```chart
{
  "kind": "bar",
  "title": "Validation F1, fine-tuned pipeline vs. baseline",
  "data": [
    { "label": "Baseline", "value": 0.90, "display": "0.90" },
    { "label": "Fine-tuned (RoBERTa + spaCy)", "value": 0.98, "display": "0.98", "highlight": true }
  ],
  "caption": "NER, theme classification, and risk detection across 10+ languages."
}
```

> Deeper dive in **Projects → ELORA Multilingual NLP** and **AI Skill Gap Analysis**.

**Stack:** Python · RoBERTa · spaCy · ChromaDB · FastAPI · JWT · RBAC

&nbsp;

## Boeing, Supplier Quality Intern

*June 2024 – August 2024 · St. Louis, Missouri*

- Automated extraction and transformation across the Boeing Enterprise Data Warehouse and
  **MySQL** over **50,000+ supplier performance records**.
- Standardized quality metrics, anomaly tracking, and weekly executive reporting.

&nbsp;

## Tech Fellows

**Technology Analyst, Fellowship**
*August 2023 – January 2024*

- Designed and deployed a full-stack restaurant recommendation web application
  (**Flask**, **React**) within 48 hours; managed end-to-end product architecture and
  pitched the operational prototype directly to Marriott corporate leadership.
