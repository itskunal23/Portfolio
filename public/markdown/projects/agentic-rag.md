# Enterprise Agentic RAG Platform

*The Boeing Company · Enterprise AI & Data*

A platform that answers multi-part enterprise questions by planning, retrieving, and
verifying.

## Problem

Enterprise users asked multi-part questions over large, heterogeneous knowledge sources.
A naive "retrieve top-k, stuff into a prompt" approach produced confident but wrong
answers, had no way to decompose compound questions, and gave reviewers no signal about
when to trust an answer.

## Why it mattered

In a regulated environment, a hallucinated answer is a liability. The system had to be
grounded, auditable, and able to defer to a human when uncertain.

## Technical architecture

![Agentic RAG execution lifecycle](/img/diagrams/agentic-rag.svg)

- **LangGraph state machine** orchestrates the request as an explicit graph of steps
  rather than an open-ended agent loop, which keeps execution deterministic and traceable.
- **Query decomposition** breaks a compound question into sub-queries that can be
  retrieved and answered independently, then recombined.
- **MCP tool servers** expose retrieval and data tools through the Model Context Protocol,
  so the planner discovers and calls typed tools instead of hard-coded functions.
- **Hybrid retrieval** runs **BM25 (sparse / lexical)** alongside **dense vector** search,
  then fuses and reranks candidates with a **cross-encoder** for precision.
- **Grounded generation** produces answers with inline citations tied to retrieved spans.
- **LLM-as-a-judge** evaluates each answer for grounding and relevance.
- **Confidence-based routing** sends high-confidence answers straight to the user and
  escalates low-confidence or ambiguous cases to **human-in-the-loop** review, whose
  feedback re-enters the graph.

## Engineering decisions

- Chose an explicit state machine over a free-roaming agent to keep behavior predictable
  and debuggable. Every run is a traversal you can inspect.
- Used hybrid retrieval because lexical and semantic search fail on different queries, and
  reranking recovers precision that fusion alone loses.
- Built evaluation into the runtime (judge plus confidence gate) rather than running it
  offline after the fact, so the system can decide when not to answer.

## Evaluation & validation

- Automated **LLM-as-a-judge** scoring on grounding and answer quality, run continuously
  rather than only at release.
- Confidence thresholds tuned against the escalation rate reviewers could sustain.

## Measurable impact

- **Hallucination rate reduced by 60%** compared to the baseline retrieval approach.

```chart
{
  "kind": "bar",
  "title": "Relative hallucination rate vs baseline",
  "unit": "%",
  "data": [
    { "label": "Baseline retrieval", "value": 100, "display": "100%" },
    { "label": "Agentic RAG platform", "value": 40, "display": "−60%", "highlight": true }
  ],
  "caption": "Normalized to the baseline approach (100%). Lower is better."
}
```

## Technology stack

Model Context Protocol (MCP) · LangGraph · Python · hybrid retrieval (BM25 + dense
vectors) · cross-encoder reranking · LLM-as-a-judge · human-in-the-loop routing

**Related:** this platform retrieves over the **Document Intelligence** pipeline. See also
**NCR Entity Resolution** for the same confidence-based, human-in-the-loop pattern applied
to matching.

> **Note on scope.** This is a generalized description of production work. The diagram is a
> conceptual explanation of the architecture; it does not reproduce internal source code,
> data, or system details.
