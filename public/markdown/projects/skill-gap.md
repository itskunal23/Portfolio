# AI Skill Gap Analysis

*ELORA · MVP delivered in under six weeks*

A workforce analytics MVP that finds skill gaps with unsupervised learning and explains
them with generative synthesis.

## Problem

Leadership needed to understand where the workforce's skills diverged from what target
roles actually require, fast enough to act on and explained clearly enough to support real
decisions.

## Why it mattered

Skill-gap insight drives hiring, training, and staffing decisions. A table of cluster IDs
doesn't help anyone act; decision-makers need the gap and a readable explanation of it.

## Technical architecture

![AI skill gap analysis pipeline](/img/diagrams/skill-gap.svg)

- **Skill signals** from roles and workforce profiles are embedded.
- **Unsupervised clustering** groups skills without needing labeled training data.
- **Gap detection** compares clusters against target role profiles.
- **Generative synthesis** turns detected gaps into narratives and recommendations for
  **decision support**.

## Engineering decisions

- Used **unsupervised clustering** because the useful groupings weren't known in advance
  and labeling at MVP speed wasn't realistic.
- Paired clustering with **generative synthesis** so the output is a decision-ready
  explanation, not raw cluster assignments.
- Scoped tightly to ship a credible MVP in the time available.

## Role & delivery

- **Led a five-person engineering team.**
- Delivered the **MVP in under six weeks**.

## Measurable impact

- Produced workforce decision-support insight combining unsupervised clustering and
  generative synthesis, shipped on an aggressive timeline.

```chart
{
  "kind": "kpi",
  "title": "Delivery",
  "stats": [
    { "value": 5, "label": "Engineers led", "detail": "team I ran" },
    { "value": 6, "prefix": "<", "suffix": " wks", "label": "To MVP", "detail": "concept to shipped" },
    { "value": 1, "label": "MVP shipped", "detail": "clustering + synthesis" }
  ]
}
```

## Technology stack

Unsupervised clustering · generative synthesis · workforce analytics · embeddings

**Related:** built on ELORA, alongside the **ELORA Multilingual NLP** platform.

> **Note on scope.** Generalized description of professional work; the diagram is
> conceptual.
