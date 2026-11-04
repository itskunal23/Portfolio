# NCR Part Matching Template (IPC, Illustrated Parts Catalog)

*The Boeing Company · Enterprise AI & Data*

A matching cascade: the **NCR Part Matching Template**, built against the **Illustrated
Parts Catalog (IPC)**, that collapsed a multi-day manual engineering task into a few
hours.

## Problem

Processing **Nonconformance Reports (NCRs)** required engineers to manually match
free-text records to the correct entities. It took roughly **80 hours per aircraft
program** and was a persistent bottleneck.

## Why it mattered

Those 80 hours were skilled engineering time spent on reconciliation instead of
engineering. The bottleneck slowed every program it touched.

## Technical architecture

![NCR entity resolution cascade](/img/diagrams/ncr-entity-resolution.svg)

The system is a **cascade** that spends cheap compute first and expensive compute only
where it's needed:

- **Deterministic matching** runs first. Rules, identifiers, and exact keys resolve the
  easy majority of records with full certainty.
- **Semantic matching** uses **transformer-based similarity** on the remaining ambiguous
  records, where surface text differs but meaning matches.
- **Confidence thresholds** route each result:
  - **high** → auto-match,
  - **mid** → human review,
  - **low** → flagged as no match.

## Engineering decisions

- Deterministic-first by design: most records don't need a model, and sending them through
  one would add cost, latency, and a chance of error for no benefit.
- Used confidence thresholds instead of a single cutoff, so the system can auto-match what
  it's sure about and escalate what it isn't, rather than forcing a binary guess.
- Kept a human in the loop for the mid-confidence band. The goal was to remove the
  reconciliation grind, not the engineering judgment.

## Evaluation & validation

- Tuned thresholds against reviewer agreement so the auto-match band stayed trustworthy.

## Measurable impact

- **Engineering cycle time dropped 95%, from 80 hours to 4 hours per aircraft program.**

```chart
{
  "kind": "bar",
  "title": "NCR engineering cycle time per aircraft program",
  "unit": "h",
  "data": [
    { "label": "Manual process", "value": 80, "display": "80 h" },
    { "label": "With matching cascade", "value": 4, "display": "4 h", "highlight": true }
  ],
  "caption": "95% reduction. Hover a bar for its value. Figures reflect the production workflow."
}
```

## Technology stack

Deterministic heuristics · transformer-based semantic similarity · entity resolution ·
confidence thresholds · workflow automation

**Related:** the confidence-gated, human-in-the-loop routing in the **NCR Part Matching
Template (IPC)** mirrors the escalation design in the **Agentic RAG Platform**.

> **Note on scope.** Generalized description of production work; the diagram is conceptual.
