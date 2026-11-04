# Intern Workflow Tool (Enterprise Recruiting Platform)

*The Boeing Company · Azure Government Cloud*

The **Intern Workflow Tool** is an end-to-end intern-recruiting platform for a regulated
cloud environment, delivered as the lead of a seven-person team and built with **Amazon
Kiro** spec-driven agentic-AI workflows.

## Problem

Hiring managers needed a single platform to run hiring end to end (requisitions,
compliance, interviews, offers) and hand the result off to Workday, all within **Azure
Government Cloud** constraints.

## Why it mattered

The platform supported **630+ hiring managers**. Fragmented tooling and manual handoffs
created compliance risk and slowed hiring across the enterprise.

## Technical architecture

![Enterprise recruiting platform architecture](/img/diagrams/recruiting-platform.svg)

- **React** frontend for hiring managers.
- **Node.js** gateway for authentication and request routing.
- **Spring Boot** services implement the core domain: hiring workflow, compliance,
  interviews, and offers.
- A **database** holds records and audit trails.
- Finalized offers **hand off to Workday** for downstream HR processing.
- The whole system runs inside **Azure Government Cloud**.

## Engineering decisions

- Split the domain into focused Spring Boot services so hiring, compliance, interviews,
  and offers could evolve independently.
- Put a Node.js gateway in front for a single, consistent auth and routing surface.
- Designed the Workday handoff as an explicit integration boundary to keep the platform's
  domain clean and the HR system authoritative where it should be.

## Role

- **Led a seven-person team** across architecture and delivery.

## Measurable impact

- Supported **630+ hiring managers** with hiring, compliance, interviews, offers, and
  Workday integration in a regulated cloud.
- Took **100+ intern requests in the first month** after launch.
- Stored and managed **1,200+ resumes**.

```chart
{
  "kind": "kpi",
  "title": "Adoption after launch",
  "stats": [
    { "value": 630, "suffix": "+", "label": "Hiring managers supported", "tool": "Intern Workflow Tool" },
    { "value": 100, "suffix": "+", "label": "Intern requests", "detail": "first month after launch", "tool": "Intern Workflow Tool" },
    { "value": 1200, "suffix": "+", "label": "Resumes stored", "tool": "Intern Workflow Tool" }
  ]
}
```

```chart
{
  "kind": "bar",
  "title": "Scale of the platform",
  "data": [
    { "label": "Intern requests (first month)", "value": 100, "display": "100+" },
    { "label": "Hiring managers supported", "value": 630, "display": "630+", "highlight": true },
    { "label": "Resumes stored & managed", "value": 1200, "display": "1,200+" }
  ],
  "caption": "Relative scale of adoption across the Intern Workflow Tool after launch."
}
```

## Technology stack

Azure Government Cloud · Spring Boot · Node.js · React · Workday integration

**Related:** the **Intern Workflow Tool** was my largest team-lead role at Boeing. For the
AI-systems side of that work, see **Agentic RAG Platform** and the **Defense Document
Intelligence Pipeline**.

> **Note on scope.** Generalized description of production work; the diagram is conceptual.
