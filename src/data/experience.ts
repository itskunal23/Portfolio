import type { Employer } from "./types";

// Roles, titles, dates, and locations exactly as listed on LinkedIn.
// Bullets follow the LinkedIn descriptions, edited for readability only.
export const experience: Employer[] = [
  {
    org: "Boeing",
    arrangement: "Full-time, hybrid. Joined July 2025 as a new graduate.",
    roles: [
      {
        title: "Data Scientist",
        team: "Enterprise AI & Data (EAI&D)",
        start: "Jan 2026",
        end: "Present",
        location: "Arlington, Virginia",
        focus: {
          plain: "AI tools that answer questions from Boeing's documents and data, and the software people use them through.",
          engineer: "Agentic RAG on MCP tool servers, entity resolution, document ingestion on S3, and full-stack work on Azure Government Cloud."
        },
        impact: ["95% less NCR matching time", "630+ hiring managers served", "CTO's Performance & Innovation Award"],
        points: [
          "Cut Nonconformance Report (NCR) engineering cycle time by 95%, from 80 to 4 hours per aircraft program each month, with an automated entity-resolution pipeline that combines heuristic rules with transformer-based semantic matching.",
          "Architected an enterprise agentic RAG platform on Model Context Protocol (MCP) tool servers, with hybrid retrieval (dense vectors and BM25), relational databases, multi-step query decomposition, schema-validated tool execution, and automated citation self-evaluation.",
          "Engineered an automated defense document ingestion pipeline on Amazon S3 that turns unstructured aerospace PDFs and legacy spreadsheets into structured, searchable vector metadata across 4,500+ knowledge objects, at sub-1.2-second P95 retrieval latency.",
          "Deployed citation-grounded semantic search across 3,000+ pages of airline safety manuals, with confidence-based routing that flags low-confidence predictions for human review and continuous improvement through active learning.",
          "Led the architecture and end-to-end development of an intern-recruiting platform on Azure Government Cloud for 630+ hiring managers, using Amazon Kiro's spec-driven agentic workflows to build PDF candidate parsing, hiring, conflict-of-interest compliance, interviews, rankings, offers, and Workday integration.",
          "Received the CTO's Performance & Innovation Award for the architecture and platform engineering behind the enterprise 2026 AI Summit, which reached 6.8K unique users and 24K page views."
        ],
        projects: [
          "ncr-entity-resolution",
          "agentic-rag",
          "document-ingestion",
          "safety-manual-search",
          "recruiting-platform"
        ]
      },
      {
        title: "Data Scientist",
        team: "Employee Listening, Organizational Research & Assessments (ELORA)",
        start: "Jul 2025",
        end: "Jan 2026",
        location: "Charleston, South Carolina",
        focus: {
          plain: "Making 100K+ employee survey answers in 10+ languages analyzable and searchable for leadership.",
          engineer: "Multilingual NLP with spaCy and transformers, ChromaDB semantic search behind JWT and RBAC, and a five-person MVP team."
        },
        impact: ["F1 0.90–0.98 across NLP tasks", "MVP shipped in under 6 weeks", "10.9K+ page views on the 2025 AI Summit hub"],
        points: [
          "Engineered a multilingual NLP pipeline with spaCy and transformer-based models that processes 100K+ survey responses across 10+ languages, covering translation, named entity recognition, ethics classification, and thematic prediction, with F1 scores of 0.90–0.98 across the evaluated tasks.",
          "Architected a production semantic search engine on ChromaDB with custom embeddings, JWT authentication, and role-based access control, so executive leadership can query historical organizational data with citation-backed verification.",
          "Led a five-person engineering team that designed and shipped an AI Skill Gap Analysis MVP in under six weeks, combining unsupervised clustering with generative synthesis to show workforce capability gaps to HR and business leadership.",
          "Engineered the infrastructure for the 2025 Boeing AI Summit hub, which handled 10.9K+ page views across 3,400+ enterprise attendees."
        ],
        projects: ["elora-nlp", "skill-gap"]
      }
    ]
  },
  {
    org: "Boeing",
    arrangement: "Internship, on-site.",
    roles: [
      {
        title: "Supplier Quality Intern",
        start: "Jun 2024",
        end: "Aug 2024",
        location: "St. Louis, Missouri",
        focus: {
          plain: "Automating how supplier quality data was checked and reported.",
          engineer: "Extraction and transformation pipelines across the Boeing Enterprise Data Warehouse and MySQL."
        },
        impact: ["Replaced manual validation across 50K+ supplier records", "Automated weekly executive reporting"],
        points: [
          "Built automated extraction and transformation pipelines across the Boeing Enterprise Data Warehouse and MySQL, querying 50K+ supplier performance records to replace manual spreadsheet validation.",
          "Standardized quality metrics and anomaly tracking across critical manufacturing suppliers and automated weekly executive reporting."
        ]
      }
    ]
  },
  {
    org: "Virginia Tech Tech Fellows",
    arrangement: "Fellowship, on-site.",
    roles: [
      {
        title: "Technology Analyst",
        start: "Aug 2023",
        end: "Jan 2024",
        location: "Blacksburg, Virginia",
        focus: {
          plain: "Building a restaurant recommendation app for hotel guests, start to finish, in 48 hours.",
          engineer: "Full-stack Flask and React prototype with end-to-end product architecture."
        },
        impact: ["Pitched to Marriott corporate leadership"],
        points: [
          "Designed and deployed a full-stack restaurant recommendation web app (Flask, React) in 48 hours, owned its end-to-end architecture, and pitched the working prototype to Marriott corporate leadership."
        ],
        projects: ["dinesmart"]
      }
    ]
  }
];

export const recognition = [
  {
    title: "CTO's Performance & Innovation Award",
    org: "Boeing",
    body: "For the technical architecture and platform engineering behind the enterprise 2026 AI Summit: 6.8K unique users and 24K page views."
  }
];
