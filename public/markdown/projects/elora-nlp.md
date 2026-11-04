# ELORA: Multilingual NLP & Semantic Search

*Employee Listening, Organizational Research & Assessments*

A multilingual understanding layer over enterprise feedback, plus a secure semantic search
platform for executives to explore it.

## Problem

The organization collected **100,000+ records** of enterprise feedback in **10+
languages**. Reading and categorizing it by hand didn't scale, and there was no safe,
structured way for leaders to explore what people were actually saying.

## Why it mattered

Leadership needs the signal in that feedback (theme, sentiment, operational risk), but
only if it's accurate, multilingual, and access controlled.

## Technical architecture

![Multilingual NLP and semantic search pipeline](/img/diagrams/elora-nlp.svg)

- **Language detection + spaCy** normalize and tokenize records and route them by
  language.
- **Fine-tuned RoBERTa** classifiers label each record for **theme**, **sentiment**, and
  **operational risk**.
- **Custom embeddings** feed a **ChromaDB** semantic search layer.
- The search layer enforces **JWT authentication**, **RBAC**, and **citation validation**
  so executive-facing exploration stays grounded in real source records and limited to
  authorized users.

## Engineering decisions

- Fine-tuned RoBERTa rather than relying on zero-shot prompting, because classification
  accuracy was the whole point and had to be defensible.
- Built auth, RBAC, and citation validation into the search layer from the start. For an
  executive-facing tool over sensitive feedback, access control and provenance are
  requirements, so they couldn't be bolted on later.

## Evaluation & validation

- Tracked classification quality on a held-out validation set and iterated the models and
  data until quality was production-grade.

## Measurable impact

- Improved validation **F1 from 0.90 to 0.98**.
- Classified themes, sentiment, and operational risk across **100,000+ records in 10+
  languages**.

```chart
{
  "kind": "kpi",
  "title": "Validation F1 (held-out set)",
  "stats": [
    { "value": 0.90, "decimals": 2, "label": "Baseline", "detail": "starting classifier" },
    { "value": 0.98, "decimals": 2, "label": "Fine-tuned RoBERTa", "detail": "+0.08 F1" }
  ],
  "caption": "Near-ceiling accuracy: an 8-point F1 gain on a score already close to 1.0."
}
```

## Technology stack

RoBERTa · spaCy · multilingual classification · ChromaDB · custom embeddings · JWT · RBAC ·
citation validation

**Related:** the structured understanding built here fed the **AI Skill Gap Analysis** MVP,
the other project from my time on ELORA.

> **Note on scope.** Generalized description of production work; the diagram is conceptual.
