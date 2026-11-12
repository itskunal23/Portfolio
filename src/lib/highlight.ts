// A tiny build-time Python highlighter for the hero laptop. It runs during
// the Astro build, so the browser gets plain spans and no highlighting code.

const KEYWORDS = new Set(["def", "return", "if", "else", "for", "in", "and", "or", "not", "import", "from", "class", "None"]);

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Order matters: comments and strings win over everything inside them.
const TOKEN = /(#.*$)|("[^"]*")|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*(?=\())|(\b[A-Za-z_]\w*\b)/g;

/** Highlight one line of Python into HTML spans: k, s, c, n, f. */
export function highlightLine(line: string): string {
  let out = "";
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    const [text, comment, string, number, call, word] = m;
    out += escape(line.slice(last, m.index));
    last = m.index! + text.length;
    const cls = comment ? "c" : string ? "s" : number ? "n" : call ? "f" : word && KEYWORDS.has(word) ? "k" : "";
    out += cls ? `<span class="${cls}">${escape(text)}</span>` : escape(text);
  }
  return out + escape(line.slice(last));
}
