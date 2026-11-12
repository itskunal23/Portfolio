import type { Project } from "./types";

const BOEING_SCOPE =
  "A generalized description of professional work at Boeing. The diagram illustrates the approach; it is not an internal design. No proprietary code, data, documents, or internal details are shown.";

// Order here is the order on the Work page. `featured` projects appear on Home.
export const projects: Project[] = [
  {
    slug: "agentic-rag",
    title: "Enterprise agentic RAG platform",
    summary:
      "Agentic RAG on MCP tool servers and LangGraph state machines: multi-step query decomposition, hybrid BM25 and dense retrieval over documents and relational databases, schema-validated tool calls, and citation self-evaluation.",
    plain: "An AI assistant for Boeing's internal data that breaks hard questions into steps, looks things up in the right places, and checks its sources before answering.",
    org: "Boeing",
    team: "Enterprise AI & Data",
    period: "2026",
    role: "Architect",
    featured: true,
    problem:
      "Enterprise questions are rarely one question. They span documents and relational databases, and a single retrieve-and-prompt pass can't break them apart, reach structured data, or say whether its answer is actually supported by a source.",
    context:
      "In a regulated enterprise, an unsupported answer is a liability. The platform had to reach many kinds of data through one consistent interface, and every answer had to be traceable back to where it came from.",
    approach: [
      "A question is decomposed into sub-queries that can be answered independently and recombined. The orchestration runs as LangGraph state machines, so each request is an explicit path through known steps rather than an open-ended agent loop.",
      "Retrieval and relational databases are exposed through Model Context Protocol (MCP) tool servers. The planner discovers and calls typed tools instead of hard-coded functions, and tool calls are validated against schemas before their results are used.",
      "Document retrieval is hybrid: BM25 lexical search and dense-vector search run side by side. The drafted answer carries citations, and the system evaluates those citations against its sources before it responds."
    ],
    graph: {
      cols: 8,
      rows: 3,
      caption: "Illustrative request path. Select a step to see what it does.",
      nodes: [
        { id: "q", label: "Question", col: 1, row: 2, kind: "source", detail: "A multi-part question from an enterprise user." },
        { id: "decompose", label: "LangGraph plan", col: 2, row: 2, detail: "A LangGraph state machine splits the question into sub-queries that can be answered independently, then recombines them." },
        { id: "tools", label: "MCP tools", col: 3, row: 2, detail: "Retrieval and databases are exposed as typed tools over the Model Context Protocol. The planner discovers and calls them." },
        { id: "hybrid", label: "BM25 + vectors", col: 4, row: 1, detail: "BM25 and dense-vector search run side by side. They fail on different queries, so each covers the other." },
        { id: "sql", label: "Relational data", col: 4, row: 3, detail: "Structured questions reach relational databases through the same tool interface." },
        { id: "validate", label: "Validate", col: 5, row: 2, kind: "gate", detail: "Tool inputs and outputs are checked against schemas before anything is used in an answer." },
        { id: "draft", label: "Cited draft", col: 6, row: 2, detail: "The answer is drafted with citations tied to the retrieved sources." },
        { id: "check", label: "Citation check", col: 7, row: 2, kind: "gate", detail: "The system evaluates its own citations against the sources before responding." },
        { id: "answer", label: "Answer", col: 8, row: 2, kind: "output", detail: "A grounded answer the user can trace back to its sources." }
      ],
      edges: [
        { from: "q", to: "decompose" },
        { from: "decompose", to: "tools" },
        { from: "tools", to: "hybrid" },
        { from: "tools", to: "sql" },
        { from: "hybrid", to: "validate" },
        { from: "sql", to: "validate" },
        { from: "validate", to: "draft" },
        { from: "draft", to: "check" },
        { from: "check", to: "answer" }
      ],
      traces: [
        { label: "Document question", path: ["q", "decompose", "tools", "hybrid", "validate", "draft", "check", "answer"] },
        { label: "Data question", path: ["q", "decompose", "tools", "sql", "validate", "draft", "check", "answer"] }
      ]
    },
    contribution: [
      "Architected the platform: the orchestration model, the MCP tool layer, and how retrieval and relational data plug into it.",
      "Built hybrid retrieval, multi-step query decomposition, schema-validated tool execution, and automated citation self-evaluation."
    ],
    stack: ["Model Context Protocol", "LangGraph", "Python", "BM25", "Dense vectors", "Relational databases", "LLM-as-a-judge"],
    outcome: {
      metrics: [],
      text: "Delivered RAG capabilities for complex, multi-step information retrieval across documents and relational databases, with a citation check built into every response."
    },
    decisions: [
      {
        title: "An explicit state machine, not a free-roaming agent",
        body: "Every run is a traversal you can inspect. That keeps behavior predictable and debuggable, which matters more than flexibility in an enterprise setting."
      },
      {
        title: "Tools behind a protocol",
        body: "Putting data sources behind MCP tool servers means a new source is a new tool, not a change to the planner."
      },
      {
        title: "Evaluation in the request path",
        body: "Checking citations at runtime, rather than in an offline report, lets the system test an answer before anyone sees it."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "ncr-entity-resolution",
    title: "NCR parts matching",
    summary:
      "Entity resolution that pairs deterministic heuristics with transformer-based semantic matching against the parts catalog. NCR cycle time down 95%, from 80 to 4 hours per aircraft program each month.",
    plain: "Automated a tedious matching job engineers did by hand, so a monthly task that took about 80 hours now takes about 4.",
    org: "Boeing",
    team: "Enterprise AI & Data",
    period: "2026",
    role: "Engineer",
    featured: true,
    problem:
      "Resolving Nonconformance Reports (NCRs) meant engineers matching free-text records to the correct parts in the Illustrated Parts Catalog by hand. It took about 80 hours per aircraft program, every month.",
    context:
      "Those hours were skilled engineering time spent on reconciliation instead of engineering, and the work recurred for every program it touched.",
    approach: [
      "An automated entity-resolution pipeline handles the matching in two stages. Heuristic rules run first, resolving records that identifiers and exact keys can settle with certainty.",
      "Records the rules can't resolve go to transformer-based semantic matching, which finds the right part when the wording differs but the meaning is the same."
    ],
    graph: {
      cols: 4,
      rows: 3,
      caption: "Illustrative matching cascade. Select a step to see what it does.",
      nodes: [
        { id: "ncr", label: "NCR records", col: 1, row: 2, kind: "source", detail: "Free-text nonconformance reports that need to be tied to a specific part." },
        { id: "rules", label: "Heuristic rules", col: 2, row: 2, detail: "Rules, identifiers, and exact keys resolve the straightforward records with certainty, at almost no cost." },
        { id: "ipc", label: "Parts catalog", col: 2, row: 3, kind: "source", detail: "Candidate parts come from the Illustrated Parts Catalog (IPC)." },
        { id: "semantic", label: "Semantic match", col: 3, row: 1, detail: "Transformer-based similarity handles records where the text differs but the meaning matches." },
        { id: "matched", label: "Matched part", col: 4, row: 2, kind: "output", detail: "Each record is linked to its part, ready for engineering review." }
      ],
      edges: [
        { from: "ncr", to: "rules" },
        { from: "ipc", to: "rules" },
        { from: "ipc", to: "semantic" },
        { from: "rules", to: "matched" },
        { from: "rules", to: "semantic" },
        { from: "semantic", to: "matched" }
      ],
      traces: [
        { label: "Resolved by rules", path: ["ncr", "rules", "matched"] },
        { label: "Needs semantic match", path: ["ncr", "rules", "semantic", "matched"] }
      ]
    },
    contribution: [
      "Engineered the automated pipeline that pairs heuristic rules with transformer-based semantic matching."
    ],
    stack: ["Python", "Transformer models", "Entity resolution", "Heuristic matching"],
    card: { plain: { value: "95%", label: "less engineering cycle time" }, engineer: { value: "80 → 4 h", label: "per aircraft program, each month" } },
    outcome: {
      metrics: [
        { value: "95%", label: "less engineering cycle time" },
        { value: "80 to 4", label: "hours per aircraft program, each month" }
      ],
      text: "The monthly matching work for an aircraft program dropped from about 80 hours to about 4."
    },
    decisions: [
      {
        title: "Deterministic first",
        body: "Most records don't need a model. Sending them through one would add cost, latency, and a chance of error for no benefit, so the model only sees what the rules can't settle."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "recruiting-platform",
    title: "Intern recruiting platform",
    summary:
      "Spring Boot, Node.js, and React on Azure Government Cloud, built with Amazon Kiro's spec-driven agentic workflows: PDF parsing, conflict-of-interest compliance, interviews, rankings, offers, and a Workday handoff. A 7-person team, 630+ hiring managers.",
    plain: "One place for 630+ Boeing hiring managers to run intern hiring, from reading a résumé to sending the offer.",
    org: "Boeing",
    team: "Enterprise AI & Data",
    period: "2026",
    role: "Architecture lead, team of seven",
    featured: true,
    problem:
      "Intern hiring ran across fragmented tools and manual handoffs. Hiring managers needed one place to take a candidate from résumé to offer, with compliance checks built in, inside the constraints of a government cloud.",
    context:
      "The platform serves 630+ hiring managers, and it had to run in Azure Government Cloud and hand finished offers to Workday.",
    approach: [
      "The front end is React and TypeScript, with Spring Boot and Node.js services and Azure SQL underneath, all deployed in Azure Government Cloud.",
      "Development used Amazon Kiro's spec-driven agentic workflows: requirements became specifications, and specifications became validated features. That covered automated PDF candidate parsing, hiring, conflict-of-interest compliance, interviews, rankings, offers, and the Workday integration."
    ],
    graph: {
      cols: 7,
      rows: 2,
      caption: "Illustrative candidate path. Amber steps are where hiring managers make the call.",
      nodes: [
        { id: "pdf", label: "Résumé PDF", col: 1, row: 1, kind: "source", detail: "A candidate's résumé arrives as a PDF." },
        { id: "parse", label: "Parsing", col: 2, row: 1, detail: "Candidate details are parsed out of the PDF automatically." },
        { id: "coi", label: "COI check", col: 3, row: 1, kind: "gate", detail: "Conflict-of-interest compliance is checked as part of the workflow, not after it." },
        { id: "interview", label: "Interviews", col: 4, row: 2, kind: "human", detail: "Hiring managers interview candidates. The platform organizes the process; people make the decisions." },
        { id: "rank", label: "Rankings", col: 5, row: 2, kind: "human", detail: "Hiring managers rank candidates." },
        { id: "offer", label: "Offers", col: 6, row: 1, detail: "Offers are prepared and tracked in the platform." },
        { id: "workday", label: "Workday", col: 7, row: 1, kind: "output", detail: "Finalized offers hand off to Workday, which stays the system of record for HR." }
      ],
      edges: [
        { from: "pdf", to: "parse" },
        { from: "parse", to: "coi" },
        { from: "coi", to: "interview", kind: "human" },
        { from: "interview", to: "rank", kind: "human" },
        { from: "rank", to: "offer", kind: "human" },
        { from: "offer", to: "workday" }
      ],
      traces: [{ label: "Candidate", path: ["pdf", "parse", "coi", "interview", "rank", "offer", "workday"] }]
    },
    contribution: [
      "Led the architecture and end-to-end development, directing a team of seven.",
      "Used Amazon Kiro's spec-driven workflows to move from requirements to validated features."
    ],
    stack: ["React", "TypeScript", "Java Spring Boot", "Node.js", "Azure SQL", "Azure Government Cloud", "Amazon Kiro", "Workday"],
    card: { plain: { value: "630+", label: "hiring managers served" }, engineer: { value: "7", label: "engineers on the team I directed" } },
    outcome: {
      metrics: [{ value: "630+", label: "hiring managers served" }],
      text: "One platform for the whole intern hiring workflow, in a regulated cloud, used by more than 630 hiring managers."
    },
    decisions: [
      {
        title: "Workday as an explicit boundary",
        body: "The platform hands finished offers to Workday rather than duplicating it, which keeps the platform's own domain clean and the HR system authoritative where it should be."
      },
      {
        title: "Specs before code",
        body: "Spec-driven agentic development meant each feature started as a reviewable specification, so a seven-person team could move fast and still validate what it built."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "elora-nlp",
    title: "Multilingual survey analysis and search",
    summary:
      "spaCy and fine-tuned RoBERTa for translation, NER, ethics classification, and thematic prediction over 100K+ responses in 10+ languages (F1 0.90–0.98 across tasks), with ChromaDB semantic search behind JWT and RBAC.",
    plain: "Made more than 100,000 employee survey answers in 10+ languages readable by software, and gave leaders a secure way to search them.",
    org: "Boeing",
    team: "ELORA",
    period: "2025",
    role: "Engineer",
    featured: true,
    problem:
      "Employee surveys produced more than 100,000 responses in over ten languages. Reading and categorizing them by hand didn't scale, and leaders had no safe, structured way to explore what people had said.",
    context:
      "Feedback like this is sensitive. Any tool over it needed to be accurate across languages, limited to authorized people, and able to show which responses an answer came from.",
    approach: [
      "A multilingual pipeline built on spaCy and transformer-based models handles translation, named entity recognition, ethics classification, and thematic prediction.",
      "Processed responses feed a semantic search engine on ChromaDB with custom embeddings. JWT authentication and role-based access control sit in front of it, and answers are backed by citations to the underlying records."
    ],
    graph: {
      cols: 6,
      rows: 4,
      caption: "Illustrative pipeline. Select a step to see what it does.",
      nodes: [
        { id: "responses", label: "Survey responses", col: 1, row: 2, kind: "source", detail: "100K+ responses in 10+ languages." },
        { id: "pipeline", label: "NLP pipeline", col: 2, row: 2, detail: "spaCy and transformer-based models process each response." },
        { id: "translate", label: "Translation", col: 3, row: 1, detail: "Responses are translated so they can be analyzed together." },
        { id: "ner", label: "Entities", col: 3, row: 2, detail: "Named entity recognition picks out the people, places, and organizations mentioned." },
        { id: "ethics", label: "Ethics", col: 3, row: 3, detail: "An ethics classifier flags responses that raise ethics concerns." },
        { id: "themes", label: "Themes", col: 3, row: 4, detail: "Thematic prediction groups responses by what they're about." },
        { id: "index", label: "ChromaDB", col: 4, row: 2, detail: "Custom embeddings index the processed responses for semantic search." },
        { id: "access", label: "JWT + RBAC", col: 5, row: 2, kind: "gate", detail: "Authentication and role-based access control decide who can query what." },
        { id: "leaders", label: "Cited answers", col: 6, row: 2, kind: "output", detail: "Executive leadership queries historical data, and answers cite the records behind them." }
      ],
      edges: [
        { from: "responses", to: "pipeline" },
        { from: "pipeline", to: "translate" },
        { from: "pipeline", to: "ner" },
        { from: "pipeline", to: "ethics" },
        { from: "pipeline", to: "themes" },
        { from: "translate", to: "index" },
        { from: "ner", to: "index" },
        { from: "ethics", to: "index" },
        { from: "themes", to: "index" },
        { from: "index", to: "access" },
        { from: "access", to: "leaders" }
      ],
      traces: [
        { label: "Theme query", path: ["responses", "pipeline", "themes", "index", "access", "leaders"] },
        { label: "Ethics query", path: ["responses", "pipeline", "ethics", "index", "access", "leaders"] }
      ]
    },
    contribution: [
      "Engineered the multilingual NLP pipeline.",
      "Architected the semantic search engine, including authentication, access control, and citation-backed answers."
    ],
    stack: ["Python", "spaCy", "Transformer models (RoBERTa)", "ChromaDB", "Custom embeddings", "JWT", "RBAC"],
    card: { plain: { value: "100K+", label: "survey responses in 10+ languages" }, engineer: { value: "0.90–0.98", label: "F1 across the evaluated NLP tasks" } },
    outcome: {
      metrics: [
        { value: "100K+", label: "survey responses processed" },
        { value: "10+", label: "languages" },
        { value: "0.90–0.98", label: "F1 across the evaluated tasks" }
      ],
      text: "Large-scale multilingual survey data became something leaders could analyze automatically and query securely."
    },
    decisions: [
      {
        title: "Fine-tuned models over zero-shot prompting",
        body: "Classification accuracy was the point and had to be defensible, so the models were trained and evaluated on the task rather than prompted."
      },
      {
        title: "Access control from the start",
        body: "For an executive tool over sensitive feedback, authentication, roles, and citations were requirements, not features to add later."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "document-ingestion",
    title: "Defense document ingestion",
    summary:
      "Asynchronous FastAPI and Docker ingestion that converts unstructured aerospace PDFs and legacy spreadsheets into structured vector metadata across 4,500+ knowledge objects on S3, at under 1.2 s P95 retrieval latency.",
    plain: "Turned thousands of messy engineering PDFs and spreadsheets into something people can search in about a second.",
    org: "Boeing",
    team: "Enterprise AI & Data",
    period: "2026",
    role: "Engineer",
    problem:
      "Engineering knowledge sat in thousands of unstructured PDFs and legacy spreadsheets in object storage, with no structured, fast way to search across them.",
    context:
      "Engineers need answers in the flow of their work. Slow or unstructured retrieval puts that knowledge out of reach, and the system it feeds is only as good as what it can find.",
    approach: [
      "Source documents live in Amazon S3. Asynchronous FastAPI workers in Docker pull and process them, so a large backlog drains without slowing down queries.",
      "Text and structure are extracted, embedded, and stored with structured metadata next to each vector. At query time, metadata filters narrow the search before semantic ranking."
    ],
    graph: {
      cols: 6,
      rows: 2,
      caption: "Illustrative write and read paths. Select a step to see what it does.",
      nodes: [
        { id: "s3", label: "Amazon S3", col: 1, row: 2, kind: "source", detail: "Unstructured aerospace PDFs and legacy spreadsheets." },
        { id: "workers", label: "Async workers", col: 2, row: 2, detail: "FastAPI workers in Docker process documents asynchronously, separate from the query path." },
        { id: "parse", label: "Extract", col: 3, row: 2, detail: "Text and structure are pulled out of each document." },
        { id: "embed", label: "Embed", col: 4, row: 2, detail: "Content is embedded and paired with structured metadata fields." },
        { id: "index", label: "Vector index", col: 5, row: 2, detail: "Vectors are stored with their metadata, so they can be filtered as well as ranked." },
        { id: "query", label: "Query", col: 4, row: 1, kind: "source", detail: "An engineer's search, or a request from the RAG platform." },
        { id: "filter", label: "Filter", col: 5, row: 1, kind: "gate", detail: "Metadata filters narrow the candidates before semantic ranking. This is what keeps tail latency low." },
        { id: "results", label: "Results", col: 6, row: 1, kind: "output", detail: "Ranked results in under 1.2 seconds at P95." }
      ],
      edges: [
        { from: "s3", to: "workers" },
        { from: "workers", to: "parse" },
        { from: "parse", to: "embed" },
        { from: "embed", to: "index" },
        { from: "query", to: "filter" },
        { from: "filter", to: "index" },
        { from: "index", to: "results" }
      ],
      traces: [
        { label: "Ingest a document", path: ["s3", "workers", "parse", "embed", "index"] },
        { label: "Run a search", path: ["query", "filter", "index", "results"] }
      ]
    },
    contribution: ["Engineered the ingestion pipeline and its retrieval path."],
    stack: ["Python", "FastAPI", "Docker", "Amazon S3", "Vector search"],
    card: { plain: { value: "4,500+", label: "knowledge objects made searchable" }, engineer: { value: "<1.2 s", label: "P95 retrieval latency" } },
    outcome: {
      metrics: [
        { value: "4,500+", label: "knowledge objects made searchable" },
        { value: "<1.2 s", label: "P95 retrieval latency" }
      ],
      text: "Thousands of unstructured documents became structured, searchable vector metadata with fast retrieval at the tail."
    },
    decisions: [
      {
        title: "Separate write and read paths",
        body: "Ingestion is allowed to be slow and asynchronous. The query path stays fast and predictable."
      },
      {
        title: "Measure the tail",
        body: "P95 latency, not the average, is what people actually feel, so that is the number the system is held to."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "safety-manual-search",
    title: "Safety manual search with human review",
    summary:
      "Citation-grounded semantic search across 3,000+ pages of airline safety manuals, with confidence-score routing that sends low-confidence predictions to human review and feeds an active-learning loop.",
    plain: "Search for airline safety manuals that shows exactly where each answer came from, and asks a person when it isn't sure.",
    org: "Boeing",
    team: "Enterprise AI & Data",
    period: "2026",
    role: "Engineer",
    problem:
      "Answers buried in thousands of pages of airline safety manuals are slow to find by hand, and in safety work an answer is only useful if you can see exactly where it came from.",
    context:
      "A search system here shouldn't always answer. It needs to show its sources, and recognize when it isn't confident enough to be trusted on its own.",
    approach: [
      "Semantic search answers questions with citations to the exact manual passages it used.",
      "Confidence-based routing flags low-confidence predictions for human review. Those reviews feed active learning, so the system improves from the cases it got wrong."
    ],
    graph: {
      cols: 5,
      rows: 2,
      caption: "Illustrative routing. The amber path is where a person takes over.",
      nodes: [
        { id: "question", label: "Question", col: 1, row: 1, kind: "source", detail: "A question about procedures in the safety manuals." },
        { id: "retrieve", label: "Retrieve", col: 2, row: 1, detail: "Semantic search finds the relevant passages across 3,000+ pages." },
        { id: "draft", label: "Cited answer", col: 3, row: 1, detail: "The answer cites the passages it relies on." },
        { id: "gate", label: "Confidence", col: 4, row: 1, kind: "gate", detail: "Each prediction is scored. Low confidence routes to a person instead of straight to the user." },
        { id: "deliver", label: "Answer", col: 5, row: 1, kind: "output", detail: "Confident answers go to the user with their citations." },
        { id: "review", label: "Human review", col: 5, row: 2, kind: "human", detail: "Low-confidence predictions are flagged for review by a person." },
        { id: "learn", label: "Active learning", col: 3, row: 2, kind: "human", detail: "Reviewed cases feed back into the system so it keeps improving." }
      ],
      edges: [
        { from: "question", to: "retrieve" },
        { from: "retrieve", to: "draft" },
        { from: "draft", to: "gate" },
        { from: "gate", to: "deliver" },
        { from: "gate", to: "review", kind: "human" },
        { from: "review", to: "learn", kind: "human" },
        { from: "learn", to: "retrieve", kind: "human" }
      ],
      traces: [
        { label: "Confident", path: ["question", "retrieve", "draft", "gate", "deliver"] },
        { label: "Needs a person", path: ["question", "retrieve", "draft", "gate", "review", "learn"] }
      ]
    },
    contribution: ["Deployed the citation-grounded search and its confidence-based review routing."],
    stack: ["Semantic search", "Citation grounding", "Confidence scoring", "Active learning"],
    card: { plain: { value: "3,000+", label: "pages of safety manuals searchable" } },
    outcome: {
      metrics: [{ value: "3,000+", label: "pages of safety manuals searchable" }],
      text: "Grounded answers across the manuals, with uncertain cases going to a person and improving the system over time."
    },
    decisions: [
      {
        title: "Knowing when not to answer",
        body: "Routing on confidence turns uncertainty into a handoff instead of a guess."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "skill-gap",
    title: "AI skill gap analysis",
    summary:
      "Unsupervised clustering plus generative synthesis that surfaces workforce capability gaps. Designed and shipped as an MVP in under six weeks by a five-person team I led.",
    plain: "A tool that shows leaders where the workforce's skills fall short of what roles need, built by a team of five in under six weeks.",
    org: "Boeing",
    team: "ELORA",
    period: "2025",
    role: "Team lead, five engineers",
    problem:
      "HR and business leaders needed to see where workforce skills diverged from what roles require, fast enough to act on and clearly enough to support decisions.",
    context:
      "A table of cluster IDs doesn't help anyone act. The output had to be the gap itself, explained in terms decision-makers could use.",
    approach: [
      "Unsupervised clustering groups skill signals without needing labeled training data.",
      "Generative synthesis turns the detected gaps into readable explanations presented directly to HR and business leadership."
    ],
    graph: {
      cols: 5,
      rows: 2,
      caption: "Illustrative pipeline. Select a step to see what it does.",
      nodes: [
        { id: "signals", label: "Skill signals", col: 1, row: 1, kind: "source", detail: "Skill information from workforce data." },
        { id: "cluster", label: "Clustering", col: 2, row: 1, detail: "Unsupervised clustering finds groupings that weren't known in advance." },
        { id: "gaps", label: "Gap detection", col: 3, row: 1, kind: "gate", detail: "Clusters are compared with what roles require." },
        { id: "roles", label: "Role needs", col: 3, row: 2, kind: "source", detail: "The capabilities target roles call for." },
        { id: "synth", label: "Synthesis", col: 4, row: 1, detail: "Generative synthesis explains each gap in plain language." },
        { id: "leaders", label: "HR and leaders", col: 5, row: 1, kind: "human", detail: "Decision-makers get actionable gaps, not raw clusters." }
      ],
      edges: [
        { from: "signals", to: "cluster" },
        { from: "cluster", to: "gaps" },
        { from: "roles", to: "gaps" },
        { from: "gaps", to: "synth" },
        { from: "synth", to: "leaders", kind: "human" }
      ],
      traces: [{ label: "Analysis", path: ["signals", "cluster", "gaps", "synth", "leaders"] }]
    },
    contribution: ["Led a five-person engineering team through design and delivery of the MVP."],
    stack: ["Python", "Unsupervised clustering", "Generative AI", "Embeddings"],
    card: { plain: { value: "<6 weeks", label: "from start to shipped MVP" }, engineer: { value: "5", label: "engineers on the team I led" } },
    outcome: {
      metrics: [
        { value: "<6 weeks", label: "from start to shipped MVP" },
        { value: "5", label: "engineers on the team I led" }
      ],
      text: "A working MVP that put actionable workforce capability gaps in front of HR and business leadership."
    },
    decisions: [
      {
        title: "Unsupervised on purpose",
        body: "The useful groupings weren't known in advance, and labeling data at MVP speed wasn't realistic."
      },
      {
        title: "Explain, don't just cluster",
        body: "Pairing clustering with generative synthesis made the output a decision-ready explanation rather than a set of assignments."
      }
    ],
    scope: BOEING_SCOPE
  },
  {
    slug: "dinesmart",
    title: "DineSmart: a 48-hour prototype",
    summary: "A full-stack Flask and React recommendation app, architected and deployed end to end in 48 hours, then pitched to Marriott corporate leadership.",
    plain: "Designed and shipped a working restaurant recommendation app for hotel guests in 48 hours, then pitched it to Marriott.",
    org: "Virginia Tech Tech Fellows",
    team: "Technology Analyst fellowship",
    period: "2023",
    role: "Product architecture, end to end",
    problem:
      "Hotel guests want good places to eat nearby. The brief was to improve the guest experience with curated restaurant recommendations based on location data.",
    context: "A fellowship challenge with a 48-hour clock and a pitch to Marriott corporate leadership at the end.",
    approach: [
      "A React front end talks to a Flask API, which uses location-based restaurant data to produce curated recommendations near a guest.",
      "I owned the product architecture end to end and presented the working prototype in the pitch."
    ],
    graph: {
      cols: 4,
      rows: 2,
      caption: "How the prototype fits together. Select a step to see what it does.",
      nodes: [
        { id: "guest", label: "Guest", col: 1, row: 1, kind: "human", detail: "A hotel guest looking for somewhere to eat." },
        { id: "react", label: "React app", col: 2, row: 1, detail: "The interface guests use to browse recommendations." },
        { id: "flask", label: "Flask API", col: 3, row: 1, detail: "The backend that turns location data into recommendations." },
        { id: "data", label: "Location data", col: 3, row: 2, kind: "source", detail: "Location-based restaurant data." },
        { id: "recs", label: "Recommendations", col: 4, row: 1, kind: "output", detail: "Curated nearby restaurants for the guest." }
      ],
      edges: [
        { from: "guest", to: "react", kind: "human" },
        { from: "react", to: "flask" },
        { from: "data", to: "flask" },
        { from: "flask", to: "recs" }
      ],
      traces: [{ label: "Recommendation", path: ["guest", "react", "flask", "recs"] }]
    },
    contribution: ["Designed and deployed the full-stack app, owned the architecture, and pitched it to Marriott leadership."],
    stack: ["React", "Flask", "Python", "JavaScript"],
    card: { plain: { value: "48 hours", label: "to a deployed, working prototype" } },
    outcome: {
      metrics: [{ value: "48 hours", label: "to a deployed, working prototype" }],
      text: "A deployed prototype presented directly to Marriott corporate leadership."
    },
    decisions: [],
    scope: "A student fellowship project at Virginia Tech."
  }
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
