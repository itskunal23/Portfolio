import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import dracula from "react-syntax-highlighter/dist/esm/styles/prism/dracula";
import prism from "react-syntax-highlighter/dist/esm/styles/prism/prism";
import SyntaxHighlighter from "~/utils/highlighter";
import MetricChart from "~/charts/MetricChart";
// KaTeX styles are only needed by Bear's math rendering, so load them with
// this lazy chunk instead of on the initial page load.
import "katex/dist/katex.min.css";
import bear from "~/configs/bear";
import user from "~/configs/user";
import { usePreferences } from "~/stores/preferences";
import type { BearMdData } from "~/types";

// Verified recruiter shortcuts. Sourced from existing repo content
// (resume PDF, websites config); nothing fabricated.
const RESUME_URL = "/files/kunal-goenka-resume.pdf";
const LINKEDIN_URL = "https://www.linkedin.com/in/kunalgoenka23/";
const EMAIL = "k.goenka23@gmail.com";

interface ContentProps {
  contentID: string;
  contentURL: string;
  narrow: boolean;
}

interface NavProps {
  curSection: number;
  curItem: number;
  setContent: (section: number, item: number) => void;
}

interface BearState extends Omit<ContentProps, "narrow"> {
  curSection: number;
  curItem: number;
}

interface BearProps {
  width?: number;
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  const isChartFence = (child: any): boolean =>
    !!child &&
    typeof child === "object" &&
    /language-chart/.test(child?.props?.className || "");

  return {
    // react-markdown wraps block code in <pre>. For a ```chart fence we skip
    // the <pre> wrapper entirely so the chart is not nested in code styling.
    pre({ node, children, ...props }: any) {
      const only = Array.isArray(children) ? children[0] : children;
      if (isChartFence(only)) return <>{children}</>;
      return <pre {...props}>{children}</pre>;
    },
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      // A ```chart fenced block renders as an animated data visualisation
      // rather than a syntax-highlighted code block.
      if (!inline && match && match[1] === "chart") {
        return <MetricChart source={String(children).replace(/\n$/, "")} />;
      }
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

/* ---------------- Sidebar: identity + navigation + shortcuts ---------------- */

const ShortcutLink = ({
  href,
  icon,
  label,
  download
}: {
  href: string;
  icon: string;
  label: string;
  download?: boolean;
}) => (
  <a
    href={href}
    target={download ? undefined : "_blank"}
    rel="noreferrer"
    aria-label={label}
    title={label}
    className="bear-shortcut group hstack gap-2.5 h-8 px-2.5 rounded-md no-outline
      text-c-600 hover:(bg-c-200 text-c-800)
      focus-visible:(bg-c-200 text-c-800)"
  >
    <span className={`${icon} text-base shrink-0`} aria-hidden="true" />
    <span className="text-[13px] truncate">{label}</span>
  </a>
);

const Sidebar = ({ curSection, curItem, setContent }: NavProps) => {
  return (
    <nav aria-label="Portfolio sections" className="flex flex-col h-full">
      {/* Identity */}
      <header className="shrink-0 px-4 pt-5 pb-4 border-b border-c-200">
        <div className="hstack gap-3">
          <img
            src={user.avatar}
            alt=""
            aria-hidden="true"
            className="size-11 rounded-full object-cover shadow-sm shadow-black/15"
          />
          <div className="min-w-0">
            <div className="text-[15px] font-bold leading-tight text-c-800 truncate">
              {user.name}
            </div>
            <div className="text-[11px] leading-snug text-c-500 mt-0.5">AI Engineer</div>
          </div>
        </div>
        <div className="hstack gap-1.5 mt-3 text-[11px] text-c-500">
          <span
            className="i-ic:baseline-location-on text-xs shrink-0"
            aria-hidden="true"
          />
          <span className="truncate">Washington DC–Baltimore Area</span>
        </div>
      </header>

      {/* Section navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {bear.map((section, sIndex) => (
          <div key={`bear-section-${section.id}`}>
            <div
              className="px-2.5 mb-1 text-[11px] font-semibold uppercase tracking-wide
                text-c-400 hstack gap-1.5"
            >
              <span className={`${section.icon} text-xs`} aria-hidden="true" />
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.md.map((item, iIndex) => {
                const active = curSection === sIndex && curItem === iIndex;
                return (
                  <li key={`bear-nav-${item.id}`}>
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setContent(sIndex, iIndex)}
                      className={`bear-nav-item group w-full hstack gap-2.5 h-8 px-2.5
                        rounded-md text-left no-outline transition-colors duration-150
                        ${
                          active
                            ? "bg-red-500 text-white"
                            : "text-c-700 hover:bg-c-200 active:bg-c-300 focus-visible:bg-c-200"
                        }`}
                    >
                      <span
                        className={`${item.icon} text-base shrink-0 ${
                          active ? "text-white" : "text-c-500 group-hover:text-c-700"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-[13px] truncate flex-1">{item.title}</span>
                      {item.link && (
                        <span
                          className={`i-ant-design:link-outlined text-xs ${
                            active ? "text-white/80" : "text-c-400"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Recruiter shortcuts */}
      <footer className="shrink-0 px-2 py-3 border-t border-c-200 space-y-0.5">
        <ShortcutLink
          href={RESUME_URL}
          icon="i-ic:baseline-picture-as-pdf"
          label="Résumé"
          download
        />
        <ShortcutLink href={LINKEDIN_URL} icon="i-mdi:linkedin" label="LinkedIn" />
        <ShortcutLink
          href={`mailto:${EMAIL}`}
          icon="i-ic:baseline-email"
          label="Email"
          download
        />
      </footer>
    </nav>
  );
};

/* ---------------- Main reading area ---------------- */

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

// Module-level cache shared across every Content mount. Markdown files never
// change at runtime, so once fetched a section is instant on every revisit —
// even after closing and reopening the Bear window.
const mdCache: { [id: string]: string } = {};

type LoadStatus = "loading" | "ready" | "error";

/* A lightweight skeleton so section switches show immediate feedback instead
   of a blank pane while the markdown is fetched and rendered. */
const ContentSkeleton = () => (
  <div
    className="markdown mx-auto w-full max-w-[720px] px-7 py-10 lg:px-10"
    aria-hidden="true"
  >
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-2/3 rounded bg-c-200" />
      <div className="h-4 w-full rounded bg-c-200" />
      <div className="h-4 w-11/12 rounded bg-c-200" />
      <div className="h-4 w-4/5 rounded bg-c-200" />
      <div className="h-32 w-full rounded-lg bg-c-200 mt-6" />
      <div className="h-4 w-full rounded bg-c-200 mt-6" />
      <div className="h-4 w-10/12 rounded bg-c-200" />
    </div>
  </div>
);

const Content = ({ contentID, contentURL }: ContentProps) => {
  const dark = usePreferences((state) => state.dark);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [markdown, setMarkdown] = useState<string | undefined>(() => mdCache[contentID]);
  const [status, setStatus] = useState<LoadStatus>(
    mdCache[contentID] ? "ready" : "loading"
  );

  // Rebuilding the react-markdown `components` map on every render creates new
  // component identities each time, defeating reconciliation. Memoize it and
  // only rebuild when the theme flips.
  const components = useMemo(() => Highlighter(dark as boolean), [dark]);

  useEffect(() => {
    // Reset scroll to top on every section switch.
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    const cached = mdCache[contentID];
    if (cached !== undefined) {
      setMarkdown(cached);
      setStatus("ready");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    setMarkdown(undefined);

    fetch(contentURL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((text) => {
        const fixed = fixImageURL(text, contentURL);
        mdCache[contentID] = fixed;
        if (cancelled) return;
        setMarkdown(fixed);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        if (cancelled) return;
        setStatus("error");
      });

    // Ignore a stale fetch if the user switches sections before it resolves.
    return () => {
      cancelled = true;
    };
  }, [contentID, contentURL]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto overscroll-contain bg-c-50"
      tabIndex={0}
      aria-label="Content"
      aria-busy={status === "loading"}
    >
      {status === "loading" && <ContentSkeleton />}

      {status === "error" && (
        <div className="markdown mx-auto w-full max-w-[720px] px-7 py-10 lg:px-10">
          <p className="text-c-500">This section couldn’t be loaded. Please try again.</p>
        </div>
      )}

      {status === "ready" && markdown !== undefined && (
        <article className="markdown mx-auto w-full max-w-[720px] px-7 py-10 lg:px-10 text-c-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeKatex,
              [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
            ]}
            components={components}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
};

const Bear = ({ width }: BearProps) => {
  const [state, setState] = useState<BearState>({
    curSection: 0,
    curItem: 0,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  // Collapse the sidebar into a top sheet on very narrow windows.
  const narrow = (width ?? 1180) < 640;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const setContent = (section: number, item: number) => {
    const target = bear[section].md[item];
    setState({
      curSection: section,
      curItem: item,
      contentID: target.id,
      contentURL: target.file
    });
    setMobileNavOpen(false);
  };

  const currentTitle = bear[state.curSection].md[state.curItem].title;

  if (narrow) {
    return (
      <div className="bear font-avenir flex flex-col h-full bg-c-50">
        <div className="shrink-0 hstack justify-between h-11 px-3 border-b border-c-200 bg-c-100">
          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-label="Toggle navigation"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="hstack gap-2 h-8 px-2.5 rounded-md text-c-700 hover:bg-c-200 no-outline"
          >
            <span className="i-ic:baseline-menu text-lg" aria-hidden="true" />
            <span className="text-sm font-semibold">{currentTitle}</span>
          </button>
        </div>
        {mobileNavOpen && (
          <div className="shrink-0 max-h-[60%] overflow-y-auto border-b border-c-200 bg-[var(--surface-sidebar)]">
            <Sidebar
              curSection={state.curSection}
              curItem={state.curItem}
              setContent={setContent}
            />
          </div>
        )}
        <div className="flex-1 min-h-0">
          <Content contentID={state.contentID} contentURL={state.contentURL} narrow />
        </div>
      </div>
    );
  }

  return (
    <div className="bear font-avenir flex h-full bg-c-50">
      <aside className="w-60 shrink-0 h-full overflow-hidden border-r border-c-200 bg-[var(--surface-sidebar)]">
        <Sidebar
          curSection={state.curSection}
          curItem={state.curItem}
          setContent={setContent}
        />
      </aside>
      <main className="flex-1 min-w-0 h-full">
        <Content
          contentID={state.contentID}
          contentURL={state.contentURL}
          narrow={false}
        />
      </main>
    </div>
  );
};

export default Bear;
