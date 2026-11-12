// The hero laptop: three short files that show the shape of the agentic
// retrieval pattern Kunal builds, and two simulated runs for its terminal.
// Illustrative only: this is not Boeing code and the values are not
// production data. The page says so under the laptop.

export interface LaptopFile {
  name: string;
  lines: string[];
}

export const files: LaptopFile[] = [
  {
    name: "plan.py",
    lines: [
      "# The request becomes an explicit graph.",
      'graph = StateGraph(Request)',
      'graph.add_node("plan", decompose)',
      'graph.add_node("retrieve", hybrid_search)',
      'graph.add_node("cite", draft_with_sources)',
      'graph.add_node("check", self_evaluate)',
      "graph.add_conditional_edges(",
      '    "check", route,',
      '    {"answer": END, "person": "review"},',
      ")"
    ]
  },
  {
    name: "retrieve.py",
    lines: [
      "# Sparse and dense search, then rerank.",
      "def hybrid_search(q):",
      "    sparse = bm25.search(q.text, k=50)",
      "    dense = ann.search(embed(q.text), k=50)",
      "    pool = fuse(sparse, dense)",
      "    return rerank(q.text, pool)[:8]"
    ]
  },
  {
    name: "gate.py",
    lines: [
      "# Unsure answers go to a person.",
      "def route(state):",
      "    score = judge(state.answer, state.sources)",
      "    if score >= THRESHOLD:",
      '        return "answer"',
      '    return "person"  # a reviewer decides'
    ]
  }
];

export interface TerminalRun {
  question: string;
  steps: string[];
  result: { kind: "answer" | "person"; text: string };
}

export const terminalRuns: TerminalRun[] = [
  {
    question: "What changed between revisions B and C?",
    steps: [
      "plan      split into 3 sub-questions",
      "retrieve  bm25 + dense, 8 passages reranked",
      "cite      3 claims, each with a source",
      "check     confidence 0.91, threshold 0.80"
    ],
    result: { kind: "answer", text: "Answered, with citations" }
  },
  {
    question: "Which supplier owns part 7?",
    steps: [
      "plan      split into 2 sub-questions",
      "retrieve  bm25 + dense, 8 passages reranked",
      "cite      2 claims, 1 without a source",
      "check     confidence 0.42, threshold 0.80"
    ],
    result: { kind: "person", text: "Routed to a person for review" }
  }
];
