import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import SyntaxHighlighter from "~/utils/highlighter";

/**
 * A lightweight, self-contained "editor" view.
 *
 * The snippet below is an illustrative sketch of the kind of agentic RAG
 * orchestration described in the Bear app's case studies. It contains no
 * proprietary source code. It's here to show how the pieces fit together
 * (planner, MCP tools, hybrid retrieval, judge, confidence routing).
 */
const sampleCode = `# agentic_rag.py (illustrative sketch, not production source)
from dataclasses import dataclass


@dataclass
class Answer:
    text: str
    citations: list[str]
    confidence: float


class AgenticRAG:
    """Plan -> retrieve -> generate -> judge -> route."""

    def __init__(self, planner, tools, judge, threshold=0.75):
        self.planner = planner      # LangGraph state machine
        self.tools = tools          # MCP tool servers (typed, discoverable)
        self.judge = judge          # LLM-as-a-judge
        self.threshold = threshold

    def answer(self, query: str) -> Answer:
        subqueries = self.planner.decompose(query)

        contexts = []
        for sub in subqueries:
            # hybrid retrieval: lexical (BM25) + dense vectors, then rerank
            sparse = self.tools.bm25(sub)
            dense = self.tools.vector_search(sub)
            contexts += self.tools.rerank(sub, sparse + dense)

        draft = self.tools.generate(query, contexts)      # grounded + citations
        score = self.judge.evaluate(query, draft, contexts)

        answer = Answer(draft.text, draft.citations, score)

        if answer.confidence < self.threshold:
            # defer: escalate ambiguous cases to human review
            return self.tools.escalate_to_human(query, answer)

        return answer
`;

export default function VSCode() {
  return (
    <div className="size-full flex flex-col bg-[#1e1e1e] text-gray-300">
      <div className="h-8 flex items-center px-3 text-xs bg-[#252526] border-b border-black/40">
        <span className="i-vscode-icons:file-type-python mr-2" />
        agentic_rag.py · Kunal Goenka
      </div>
      <div className="flex-1 overflow-auto text-sm">
        <SyntaxHighlighter
          language="python"
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: "transparent",
            minHeight: "100%"
          }}
        >
          {sampleCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
