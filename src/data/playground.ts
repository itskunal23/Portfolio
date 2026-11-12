// The pipeline playground: the steps of the agentic retrieval pattern from
// Kunal's work, laid out on a board visitors can rearrange. Positions are
// fractions of the board (0..1) so layouts scale with the screen.

export interface PlayStep {
  id: string;
  label: string;
  kind: "source" | "step" | "gate" | "human" | "output";
  /** What happens at this step, shown in the run log and on selection. */
  says: string;
}

export const steps: PlayStep[] = [
  { id: "question", label: "Question", kind: "source", says: "A multi-part question comes in." },
  { id: "decompose", label: "Decompose", kind: "step", says: "Split into sub-questions that can be answered and checked one at a time." },
  { id: "tools", label: "MCP tools", kind: "step", says: "The planner calls typed tools over the Model Context Protocol." },
  { id: "hybrid", label: "Hybrid search", kind: "step", says: "BM25 and dense-vector search run side by side." },
  { id: "rerank", label: "Rerank", kind: "step", says: "A cross-encoder reorders candidates for precision." },
  { id: "draft", label: "Cited draft", kind: "step", says: "The answer is drafted with a citation for each claim." },
  { id: "confidence", label: "Confidence", kind: "gate", says: "The system scores its own answer against its sources." },
  { id: "answer", label: "Answer", kind: "output", says: "A grounded answer with sources the reader can follow." },
  { id: "human", label: "Human review", kind: "human", says: "Not confident enough: a person reviews it, and their call feeds back in." }
];

export const wires: { from: string; to: string; human?: boolean }[] = [
  { from: "question", to: "decompose" },
  { from: "decompose", to: "tools" },
  { from: "tools", to: "hybrid" },
  { from: "hybrid", to: "rerank" },
  { from: "rerank", to: "draft" },
  { from: "draft", to: "confidence" },
  { from: "confidence", to: "answer" },
  { from: "confidence", to: "human", human: true },
  { from: "human", to: "answer", human: true }
];

export const runs = [
  { label: "Confident answer", path: ["question", "decompose", "tools", "hybrid", "rerank", "draft", "confidence", "answer"] },
  { label: "Handed to a person", path: ["question", "decompose", "tools", "hybrid", "rerank", "draft", "confidence", "human", "answer"] }
];

type Layout = Record<string, [number, number]>;

/** A loose two-row snake on wide boards. */
export const wideLayout: Layout = {
  question: [0.08, 0.24],
  decompose: [0.27, 0.16],
  tools: [0.47, 0.26],
  hybrid: [0.68, 0.17],
  rerank: [0.88, 0.3],
  draft: [0.72, 0.6],
  confidence: [0.5, 0.7],
  answer: [0.14, 0.72],
  human: [0.33, 0.9]
};

/** A zigzag column on narrow boards. */
export const narrowLayout: Layout = {
  question: [0.3, 0.05],
  decompose: [0.7, 0.15],
  tools: [0.3, 0.26],
  hybrid: [0.7, 0.37],
  rerank: [0.3, 0.48],
  draft: [0.7, 0.59],
  confidence: [0.3, 0.71],
  human: [0.72, 0.82],
  answer: [0.3, 0.94]
};
