import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "recruiter",
    title: "Start Here",
    icon: "i-octicon:rocket",
    md: [
      {
        id: "recruiter",
        title: "For Recruiters",
        file: "markdown/recruiter.md",
        icon: "i-octicon:person",
        excerpt:
          "60-second recruiter quick-view: role, specialties, impact, résumé, contact..."
      }
    ]
  },
  {
    id: "profile",
    title: "Profile",
    icon: "i-fa-solid:user",
    md: [
      {
        id: "about-me",
        title: "About",
        file: "markdown/about-me.md",
        icon: "i-la:user",
        excerpt: "AI Engineer. GT OMSCS AI, currently KBAI with Joyner and Goel..."
      },
      {
        id: "experience",
        title: "Experience",
        file: "markdown/experience.md",
        icon: "i-octicon:briefcase",
        excerpt: "Boeing, ELORA, and earlier roles..."
      },
      {
        id: "skills",
        title: "Skills",
        file: "markdown/skills.md",
        icon: "i-octicon:tools",
        excerpt: "AI systems architecture, software engineering, cloud & data..."
      },
      {
        id: "education",
        title: "Education",
        file: "markdown/education.md",
        icon: "i-octicon:mortar-board",
        excerpt: "Georgia Tech OMSCS, AI specialization. KBAI..."
      },
      {
        id: "recognition",
        title: "Recognition",
        file: "markdown/recognition.md",
        icon: "i-octicon:star",
        excerpt: "CTO Performance & Innovation Award and AI Summit impact..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "How this macOS-style portfolio is built..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "agentic-rag",
        title: "Agentic RAG Platform",
        file: "markdown/projects/agentic-rag.md",
        icon: "i-carbon:flow",
        excerpt:
          "MCP tool servers + LangGraph state machines, 60% fewer hallucinations..."
      },
      {
        id: "doc-intelligence",
        title: "Defense Document Intelligence Pipeline",
        file: "markdown/projects/doc-intelligence.md",
        icon: "i-carbon:document-pdf",
        excerpt: "Aerospace PDF + Excel ingestion, 4,500+ S3 artifacts, <1.2s P95..."
      },
      {
        id: "ncr-entity-resolution",
        title: "NCR Part Matching Template (IPC)",
        file: "markdown/projects/ncr-entity-resolution.md",
        icon: "i-carbon:assembly-cluster",
        excerpt: "IPC part matching, deterministic + semantic, 95% cycle-time cut..."
      },
      {
        id: "elora-nlp",
        title: "ELORA Multilingual NLP",
        file: "markdown/projects/elora-nlp.md",
        icon: "i-carbon:language",
        excerpt: "RoBERTa + spaCy, 10+ languages, F1 0.90 to 0.98..."
      },
      {
        id: "recruiting-platform",
        title: "Intern Workflow Tool",
        file: "markdown/projects/recruiting-platform.md",
        icon: "i-carbon:enterprise",
        excerpt: "Azure Gov Cloud, Spring Boot + React, 630+ hiring managers..."
      },
      {
        id: "skill-gap",
        title: "AI Skill Gap Analysis",
        file: "markdown/projects/skill-gap.md",
        icon: "i-carbon:chart-cluster-bar",
        excerpt: "Unsupervised clustering + generative synthesis, 6-week MVP..."
      }
    ]
  }
];

export default bear;
