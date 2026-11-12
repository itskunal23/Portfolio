/** A step in an execution graph. `col` is the stage, `row` the lane. */
export interface GraphNode {
  id: string;
  label: string;
  /** One or two sentences shown when the step is selected. */
  detail: string;
  col: number;
  row: number;
  /** `human` marks steps where a person makes the call. */
  kind?: "source" | "step" | "gate" | "human" | "output";
}

export interface GraphEdge {
  from: string;
  to: string;
  /** `human` edges hand work to a person; drawn in the human-path color. */
  kind?: "auto" | "human";
}

export interface Graph {
  cols: number;
  rows: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Node-id sequences the "Trace a request" control plays, in turn. */
  traces: { label: string; path: string[] }[];
  caption: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line technical description (Engineer mode, case study lede). */
  summary: string;
  /** The same idea in plain English, for non-specialists (default mode). */
  plain: string;
  org: string;
  team: string;
  period: string;
  role: string;
  problem: string;
  context: string;
  approach: string[];
  graph: Graph;
  contribution: string[];
  stack: string[];
  outcome: { metrics: Metric[]; text: string };
  /**
   * The one number a list card shows. `engineer` is the technical figure shown
   * in Engineer mode; without it, the card keeps the plain figure.
   */
  card?: { plain: Metric; engineer?: Metric };
  decisions: { title: string; body: string }[];
  /** Shown on professional work: what was generalized for public view. */
  scope: string;
  links?: { label: string; href: string }[];
  featured?: boolean;
}

export interface Role {
  title: string;
  team?: string;
  start: string;
  end: string;
  location: string;
  points: string[];
  /** Short focus line for the home career table, in both tones. */
  focus: { plain: string; engineer: string };
  /** Verified outcomes, as listed on LinkedIn. */
  impact: string[];
  projects?: string[];
}

export interface Employer {
  org: string;
  arrangement: string;
  roles: Role[];
}
