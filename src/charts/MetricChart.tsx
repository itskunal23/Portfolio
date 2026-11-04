import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotionConfig, animate } from "framer-motion";

/* ======================================================================
   MetricChart
   Apple-HIG-flavoured data visualisation for the Bear reading surface.
   Authored in markdown via a ```chart fenced code block whose body is a
   JSON spec. Three kinds:

     - "kpi"  animated count-up stat cards (single headline numbers)
     - "bar"  comparative bars (e.g. 80h vs 4h), grow-from-zero on view
     - "line" animated drawn line for growth over time

   Design intent:
     - Dark-mode optimised, single restrained accent (the site red).
     - Minimal chrome: faint or no gridlines, no 3D, no clutter.
     - Smooth ease-in-out animation when the chart scrolls into view.
     - Hover/focus reveals a clean, typography-first tooltip.
     - Honours prefers-reduced-motion.
   ====================================================================== */

/* ----------------------------- spec types ----------------------------- */

interface KpiStat {
  /** Final numeric value to count up to. */
  value: number;
  /** Text shown before the number (e.g. "$"). */
  prefix?: string;
  /** Text shown after the number (e.g. "%", "h", "+", "K"). */
  suffix?: string;
  /** Decimal places to animate/display. Default 0. */
  decimals?: number;
  /** Caption under the number. */
  label: string;
  /** Optional one-line detail shown smaller. */
  detail?: string;
  /** Optional name of the tool/project this stat came from (shown as a
   *  small attribution caption under the detail line). */
  tool?: string;
}

interface BarDatum {
  label: string;
  value: number;
  /** Optional value shown on the bar instead of the raw number. */
  display?: string;
  /** Mark this bar as the "highlight" (accent) vs muted baseline. */
  highlight?: boolean;
}

interface LineDatum {
  label: string;
  value: number;
}

interface ChartSpecBase {
  title?: string;
  caption?: string;
}

interface KpiSpec extends ChartSpecBase {
  kind: "kpi";
  stats: KpiStat[];
}

interface BarSpec extends ChartSpecBase {
  kind: "bar";
  unit?: string;
  data: BarDatum[];
}

interface LineSpec extends ChartSpecBase {
  kind: "line";
  unit?: string;
  data: LineDatum[];
}

interface DonutDatum {
  label: string;
  /** 0–100 proficiency / completion. */
  value: number;
  /** Optional short caption under the percentage. */
  detail?: string;
}

interface DonutSpec extends ChartSpecBase {
  kind: "donut";
  data: DonutDatum[];
}

interface ChipGroup {
  label: string;
  items: string[];
}

interface ChipsSpec extends ChartSpecBase {
  kind: "chips";
  groups: ChipGroup[];
}

type ChartSpec = KpiSpec | BarSpec | LineSpec | DonutSpec | ChipsSpec;

// Resolve the brand accent from the centralized semantic token layer
// (src/styles/theme.css) so charts automatically track light/dark,
// increased-contrast, and Display-P3 contexts instead of hard-coding a hex.
const ACCENT = "var(--accent)";
// Mutable 4-tuple (not `as const`): framer-motion's imperative animate()
// wants a mutable BezierDefinition, and a readonly tuple fails that overload.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // ease-out-expo-ish, HIG-smooth

/* --------------------------- number helpers --------------------------- */

const formatNumber = (n: number, decimals = 0): string => {
  const rounded = Number(n.toFixed(decimals));
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/* ------------------------------ count-up ------------------------------ */

const CountUp = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  play
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  play: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionConfig();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!play) {
      node.textContent = `${prefix}0${suffix}`;
      return;
    }

    if (reduce) {
      node.textContent = `${prefix}${formatNumber(value, decimals)}${suffix}`;
      return;
    }

    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate(latest) {
        node.textContent = `${prefix}${formatNumber(latest, decimals)}${suffix}`;
      }
    });
    return () => controls.stop();
  }, [play, value, decimals, prefix, suffix, reduce]);

  return <span ref={ref} aria-hidden="true">{`${prefix}0${suffix}`}</span>;
};

/* -------------------------------- KPI --------------------------------- */

const KpiChart = memo(({ spec, play }: { spec: KpiSpec; play: boolean }) => (
  <div className="metric-kpi-grid" data-cols={Math.min(spec.stats.length, 3)}>
    {spec.stats.map((s, i) => {
      const full = `${s.prefix ?? ""}${formatNumber(s.value, s.decimals ?? 0)}${
        s.suffix ?? ""
      }`;
      return (
        <motion.div
          key={`${s.label}-${i}`}
          className="metric-kpi-card"
          initial={{ opacity: 0, y: 10 }}
          animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
        >
          <div className="metric-kpi-value" title={full}>
            <CountUp
              value={s.value}
              decimals={s.decimals}
              prefix={s.prefix}
              suffix={s.suffix}
              play={play}
            />
            <span className="sr-only">{full}</span>
          </div>
          <div className="metric-kpi-label">{s.label}</div>
          {s.detail && <div className="metric-kpi-detail">{s.detail}</div>}
          {s.tool && <div className="metric-kpi-tool">{s.tool}</div>}
        </motion.div>
      );
    })}
  </div>
));
KpiChart.displayName = "KpiChart";

/* -------------------------------- BAR --------------------------------- */

const BarChart = memo(({ spec, play }: { spec: BarSpec; play: boolean }) => {
  // Memoized so the scale isn't recomputed on unrelated re-renders.
  const max = useMemo(
    () => Math.max(...spec.data.map((d) => d.value), 0) || 1,
    [spec.data]
  );

  return (
    <div className="metric-bar-list">
      {spec.data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const shown = d.display ?? `${formatNumber(d.value)}${spec.unit ?? ""}`;
        // Accessibility: the highlighted bar must not rely on color alone
        // (HIG "Inclusive color"). We add a redundant, non-color signal — a
        // leading marker glyph, a solid vs. dashed outline, and an explicit
        // "(highlight)" in the accessible label — so the distinction survives
        // for color-blind users and in grayscale.
        const stateLabel = d.highlight ? " (highlight)" : "";
        return (
          <div
            className={`metric-bar-row${d.highlight ? " is-highlight" : ""}`}
            key={`${d.label}-${i}`}
          >
            <div className="metric-bar-head">
              <span className="metric-bar-name">
                {d.highlight && (
                  <span className="metric-bar-marker" aria-hidden="true">
                    ▶
                  </span>
                )}
                {d.label}
              </span>
              <span
                className="metric-bar-val"
                style={{ color: d.highlight ? ACCENT : undefined }}
              >
                {shown}
              </span>
            </div>
            <div
              className="metric-bar-track"
              role="img"
              aria-label={`${d.label}: ${shown}${stateLabel}`}
            >
              <motion.div
                className={`metric-bar-fill${d.highlight ? " is-highlight" : ""}`}
                style={{
                  background: d.highlight ? ACCENT : "currentColor",
                  opacity: d.highlight ? 1 : 0.28
                }}
                initial={{ width: 0 }}
                animate={play ? { width: `${pct}%` } : { width: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.12 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
BarChart.displayName = "BarChart";

/* -------------------------------- LINE -------------------------------- */

const W = 640;
const H = 220;
const padX = 32;
const padY = 28;
const innerW = W - padX * 2;
const innerH = H - padY * 2;

const LineChart = memo(({ spec, play }: { spec: LineSpec; play: boolean }) => {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useReducedMotionConfig();

  // All SVG geometry depends only on the data. Memoize it so moving the mouse
  // across points (which flips `hover` state) no longer re-derives the points,
  // line path, and area path on every hover transition.
  const { points, linePath, areaPath } = useMemo(() => {
    const values = spec.data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const pts = spec.data.map((d, i) => {
      const x =
        spec.data.length === 1
          ? padX + innerW / 2
          : padX + (i / (spec.data.length - 1)) * innerW;
      const y = padY + innerH - ((d.value - min) / span) * innerH;
      return { x, y, d };
    });

    const lPath = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const aPath =
      `${lPath} L ${pts[pts.length - 1].x.toFixed(1)} ${padY + innerH} ` +
      `L ${pts[0].x.toFixed(1)} ${padY + innerH} Z`;

    return { points: pts, linePath: lPath, areaPath: aPath };
  }, [spec.data]);

  const gradientId = useId();

  return (
    <div className="metric-line-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="metric-line-svg"
        preserveAspectRatio={`xMidYMid meet`}
        role="img"
        aria-label={spec.title ?? `Line chart`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.22" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* faint baseline only */}
        <line
          x1={padX}
          y1={padY + innerH}
          x2={W - padX}
          y2={padY + innerH}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {/* filled area */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
        />

        {/* drawn line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={ACCENT}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={play ? { pathLength: 1 } : { pathLength: reduce ? 1 : 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        />

        {/* data points */}
        {points.map((p, i) => (
          <motion.g
            key={`pt-${i}`}
            initial={{ opacity: 0 }}
            animate={play ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            style={{ cursor: "pointer", outline: "none" }}
            aria-label={`${p.d.label}: ${formatNumber(p.d.value)}${spec.unit ?? ""}`}
          >
            <circle cx={p.x} cy={p.y} r={hover === i ? 5.5 : 3.5} fill={ACCENT} />
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
          </motion.g>
        ))}

        {/* tooltip */}
        {hover !== null && (
          <g className="metric-line-tip" pointerEvents="none">
            <line
              x1={points[hover].x}
              y1={padY}
              x2={points[hover].x}
              y2={padY + innerH}
              stroke={ACCENT}
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            <foreignObject
              x={Math.min(Math.max(points[hover].x - 70, 2), W - 142)}
              y={Math.max(points[hover].y - 54, 2)}
              width="140"
              height="46"
            >
              <div className="metric-line-tooltip">
                <div className="metric-line-tooltip-label">{points[hover].d.label}</div>
                <div className="metric-line-tooltip-value">
                  {formatNumber(points[hover].d.value)}
                  {spec.unit ?? ""}
                </div>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>

      {/* x-axis labels */}
      <div className="metric-line-axis">
        {spec.data.map((d, i) => (
          <span key={`xl-${i}`} className="metric-line-axis-label">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
});
LineChart.displayName = "LineChart";

/* ------------------------------- DONUT -------------------------------- */

const DonutRing = ({
  datum,
  play,
  index
}: {
  datum: DonutDatum;
  play: boolean;
  index: number;
}) => {
  const reduce = useReducedMotionConfig();
  const R = 26;
  const C = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(100, datum.value));
  const offset = C - (pct / 100) * C;

  return (
    <div className="metric-donut-cell">
      <div className="metric-donut-ring">
        <svg viewBox="0 0 64 64" role="img" aria-label={`${datum.label}: ${pct}%`}>
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="6"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={ACCENT}
            strokeWidth="6"
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? offset : C }}
            animate={play ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.1 + index * 0.1 }}
          />
        </svg>
        <div className="metric-donut-pct" style={{ color: ACCENT }}>
          <CountUp value={pct} suffix="%" play={play} />
        </div>
      </div>
      <div className="metric-donut-label">{datum.label}</div>
      {datum.detail && <div className="metric-donut-detail">{datum.detail}</div>}
    </div>
  );
};

const DonutChart = memo(({ spec, play }: { spec: DonutSpec; play: boolean }) => (
  <div className="metric-donut-grid" data-cols={Math.min(spec.data.length, 4)}>
    {spec.data.map((d, i) => (
      <DonutRing key={`${d.label}-${i}`} datum={d} play={play} index={i} />
    ))}
  </div>
));
DonutChart.displayName = "DonutChart";

/* ------------------------------- CHIPS -------------------------------- */

const ChipsChart = memo(({ spec, play }: { spec: ChipsSpec; play: boolean }) => (
  <div className="metric-chips">
    {spec.groups.map((group, gi) => (
      <div className="metric-chip-group" key={`${group.label}-${gi}`}>
        <div className="metric-chip-group-label">{group.label}</div>
        <div className="metric-chip-row">
          {group.items.map((item, ii) => (
            <motion.span
              className="metric-chip"
              key={`${item}-${ii}`}
              initial={{ opacity: 0, y: 6 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{
                duration: 0.35,
                ease: EASE,
                delay: gi * 0.08 + ii * 0.03
              }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    ))}
  </div>
));
ChipsChart.displayName = "ChipsChart";

/* ------------------------------ wrapper ------------------------------- */

const parseSpec = (raw: string): ChartSpec | { error: string } => {
  try {
    const spec = JSON.parse(raw) as ChartSpec;
    if (!spec || typeof spec !== "object" || !("kind" in spec)) {
      return { error: `Chart spec is missing a "kind" field.` };
    }
    return spec;
  } catch (e) {
    return { error: `Invalid chart JSON: ${(e as Error).message}` };
  }
};

// Trigger entrance animations slightly before the chart is fully on screen.
// Kept at module scope so the value is computed once and shared across every
// MetricChart instance instead of being rebuilt on each render.
const IN_VIEW_MARGIN = "-10% 0px -10% 0px";

const MetricChart = ({ source }: { source: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN as any });

  const result = useMemo(() => parseSpec(source), [source]);

  if ("error" in result) {
    return (
      <div ref={ref} className={`metric-chart metric-chart-error`}>
        {result.error}
      </div>
    );
  }

  const spec = result;

  return (
    <motion.figure
      ref={ref}
      className="metric-chart"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {spec.title && <figcaption className="metric-chart-title">{spec.title}</figcaption>}

      {spec.kind === "kpi" && <KpiChart spec={spec} play={inView} />}
      {spec.kind === "bar" && <BarChart spec={spec} play={inView} />}
      {spec.kind === "line" && <LineChart spec={spec} play={inView} />}
      {spec.kind === "donut" && <DonutChart spec={spec} play={inView} />}
      {spec.kind === "chips" && <ChipsChart spec={spec} play={inView} />}

      {spec.caption && <p className="metric-chart-caption">{spec.caption}</p>}
    </motion.figure>
  );
};

export default MetricChart;
