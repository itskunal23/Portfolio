import React from "react";
import { useShallow } from "zustand/react/shallow";
import { shortcuts } from "~/configs";
import { useFullscreen } from "~/hooks";
import {
  usePreferences,
  ACCENTS,
  TEXT_SCALES,
  NOTES_MAX_LENGTH,
  systemAppearanceSupported,
  type Appearance
} from "~/stores/preferences";
import { MOD_KEY } from "~/utils";

/* ======================================================================
   Control Center
   ----------------------------------------------------------------------
   Every control here changes something visible in the portfolio. Nothing
   pretends to control the visitor's device (no Wi-Fi, Bluetooth, volume,
   battery...). Preferences persist via the preferences store.
   ====================================================================== */

type View = "main" | "shortcuts" | "notes";

/* ---------------- Primitives ---------------- */

interface SwitchProps {
  on: boolean;
  onToggle: () => void;
  icon: string;
  title: string;
  /** Longer explanation, shown as a tooltip and read by screen readers. */
  description: string;
}

/** Circular switch with a title and short caption (macOS Wi-Fi-style row). */
const SwitchRow = ({
  on,
  onToggle,
  icon,
  title,
  caption,
  description
}: SwitchProps & { caption: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={title}
    title={description}
    onClick={onToggle}
    className="no-outline hstack gap-2 w-full text-left rounded-lg cursor-default"
  >
    <span className={on ? "cc-btn" : "cc-btn-off"} aria-hidden="true">
      <span className={`${icon} text-base`} />
    </span>
    <span className="min-w-0">
      <span className="block font-medium leading-4 truncate">{title}</span>
      <span className="block cc-text leading-4 truncate">{caption}</span>
    </span>
  </button>
);

/** Compact square module with an icon switch and a two-line label. */
const SwitchTile = ({ on, onToggle, icon, title, description }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={title}
    title={description}
    onClick={onToggle}
    className="cc-grid no-outline flex-center flex-col gap-1.5 px-1 py-2 cursor-default"
  >
    <span className={on ? "cc-btn" : "cc-btn-off"} aria-hidden="true">
      <span className={`${icon} text-base`} />
    </span>
    <span className="text-[11px] leading-3.5 text-center font-medium">{title}</span>
  </button>
);

/** Module that opens a detail view inside the Control Center. */
const DrillTile = ({
  view,
  icon,
  title,
  caption,
  onOpen
}: {
  view: View;
  icon: string;
  title: string;
  caption: string;
  onOpen: (v: View) => void;
}) => (
  <button
    type="button"
    data-cc-tile={view}
    onClick={() => onOpen(view)}
    className="cc-grid col-span-2 no-outline hstack gap-2 p-2 text-left cursor-default transition-colors hover:bg-c-300/80"
  >
    <span className="cc-btn-off" aria-hidden="true">
      <span className={`${icon} text-base`} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-medium leading-4 truncate">{title}</span>
      <span className="block cc-text leading-4 truncate">{caption}</span>
    </span>
    <span
      className="i-jam:chevron-right text-base text-c-500 shrink-0"
      aria-hidden="true"
    />
  </button>
);

const DetailHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="hstack gap-2 mb-2">
    <button
      type="button"
      className="cc-step"
      onClick={onBack}
      aria-label="Back to Control Center"
      data-cc-back
    >
      <span className="i-jam:chevron-left text-lg" aria-hidden="true" />
    </button>
    <h2 className="text-sm font-semibold">{title}</h2>
  </div>
);

/* ---------------- Main view ---------------- */

const APPEARANCE_OPTIONS: {
  id: Appearance;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "light",
    label: "Light",
    icon: "i-ion:sunny",
    description: "Always use light mode"
  },
  { id: "dark", label: "Dark", icon: "i-ion:moon", description: "Always use dark mode" },
  {
    id: "system",
    label: "Auto",
    icon: "i-bi:circle-half",
    description: "Match your device's light or dark setting"
  }
];

const appearanceOptions = APPEARANCE_OPTIONS.filter(
  (o) => o.id !== "system" || systemAppearanceSupported
);

const notesPreview = (notes: string): string => {
  const firstLine = notes
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l !== "");
  return firstLine || "Jot things down";
};

const MainView = ({ openView }: { openView: (v: View) => void }) => {
  const fullscreen = useFullscreen();
  const p = usePreferences(
    useShallow((s) => ({
      appearance: s.appearance,
      accent: s.accent,
      focusMode: s.focusMode,
      reduceMotion: s.reduceMotion,
      highContrast: s.highContrast,
      keyboardNav: s.keyboardNav,
      textScale: s.textScale,
      notes: s.notes,
      setAppearance: s.setAppearance,
      setAccent: s.setAccent,
      toggle: s.toggle,
      setTextScale: s.setTextScale
    }))
  );

  const scaleIndex = Math.max(0, TEXT_SCALES.indexOf(p.textScale));
  const currentAccent = ACCENTS.find((a) => a.id === p.accent) ?? ACCENTS[0];

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Experience */}
      <section
        aria-label="Experience"
        className="cc-grid col-span-2 row-span-2 p-2 flex flex-col justify-around gap-2"
      >
        {fullscreen.supported && (
          <SwitchRow
            on={fullscreen.active}
            onToggle={fullscreen.toggle}
            icon={fullscreen.active ? "i-bi:fullscreen-exit" : "i-bi:fullscreen"}
            title="Fullscreen"
            caption={fullscreen.active ? "Esc to exit" : "Hide browser UI"}
            description="Use the browser's fullscreen mode so the portfolio fills the screen"
          />
        )}
        <SwitchRow
          on={p.focusMode}
          onToggle={() => p.toggle("focusMode")}
          icon="i-ri:focus-3-line"
          title="Focus Mode"
          caption="Fewer distractions"
          description="Plain backdrop, auto-hiding Dock and dimmed background windows"
        />
        <SwitchRow
          on={p.reduceMotion}
          onToggle={() => p.toggle("reduceMotion")}
          icon="i-mdi:motion-pause-outline"
          title="Reduce Motion"
          caption="Fewer animations"
          description="Turn off Dock magnification, chart animations and transitions"
        />
      </section>

      {/* Appearance */}
      <section className="cc-grid col-span-2 p-2" aria-labelledby="cc-appearance-label">
        <div id="cc-appearance-label" className="font-medium leading-4 mb-1.5">
          Appearance
        </div>
        <div
          role="radiogroup"
          aria-labelledby="cc-appearance-label"
          className={`grid ${
            appearanceOptions.length === 3 ? "grid-cols-3" : "grid-cols-2"
          } gap-0.5 p-0.5 rounded-lg bg-gray-400/20 dark:bg-gray-300/15`}
        >
          {appearanceOptions.map((o) => {
            const checked = p.appearance === o.id;
            return (
              <label
                key={o.id}
                title={o.description}
                className={`cc-segment flex-center flex-col gap-0.5 h-9 rounded-md cursor-default transition-colors ${
                  checked
                    ? "bg-white text-c-black shadow-sm dark:bg-gray-500"
                    : "text-c-600 hover:bg-gray-400/20"
                }`}
              >
                <input
                  type="radio"
                  name="cc-appearance"
                  value={o.id}
                  checked={checked}
                  onChange={() => p.setAppearance(o.id)}
                  className="sr-only"
                />
                <span className={`${o.icon} text-sm`} aria-hidden="true" />
                <span className="text-[10px] leading-none font-medium">{o.label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Accessibility switches */}
      <SwitchTile
        on={p.highContrast}
        onToggle={() => p.toggle("highContrast")}
        icon="i-mdi:contrast-box"
        title="High Contrast"
        description="Opaque surfaces, stronger borders and darker text"
      />
      <SwitchTile
        on={p.keyboardNav}
        onToggle={() => p.toggle("keyboardNav")}
        icon="i-ic:baseline-keyboard"
        title="Keyboard Navigation"
        description="Show a bold focus ring on the control you reach with Tab"
      />

      {/* Text size */}
      <section
        className="cc-grid col-span-4 px-2.5 py-2 hstack justify-between gap-2"
        aria-labelledby="cc-text-size-label"
      >
        <div className="min-w-0">
          <div id="cc-text-size-label" className="font-medium leading-4">
            Text Size
          </div>
          <div className="cc-text leading-4">Content in app windows</div>
        </div>
        <div className="hstack gap-1.5">
          <button
            type="button"
            className="cc-step"
            aria-label="Decrease text size"
            disabled={scaleIndex <= 0}
            onClick={() => p.setTextScale(TEXT_SCALES[scaleIndex - 1])}
          >
            <span className="text-[11px] font-semibold leading-none" aria-hidden="true">
              A
            </span>
          </button>
          <output
            aria-live="polite"
            aria-label={`Text size ${Math.round(p.textScale * 100)} percent`}
            className="w-10 text-center text-xs font-medium tabular-nums"
          >
            {Math.round(p.textScale * 100)}%
          </output>
          <button
            type="button"
            className="cc-step"
            aria-label="Increase text size"
            disabled={scaleIndex >= TEXT_SCALES.length - 1}
            onClick={() => p.setTextScale(TEXT_SCALES[scaleIndex + 1])}
          >
            <span className="text-base font-semibold leading-none" aria-hidden="true">
              A
            </span>
          </button>
        </div>
      </section>

      {/* Accent color */}
      <section
        className="cc-grid col-span-4 px-2.5 py-2"
        aria-labelledby="cc-accent-label"
      >
        <div className="hstack justify-between mb-2">
          <span id="cc-accent-label" className="font-medium leading-4">
            Accent Color
          </span>
          <span className="cc-text">{currentAccent.label}</span>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="cc-accent-label"
          className="hstack justify-between px-0.5"
        >
          {ACCENTS.map((a) => {
            const checked = p.accent === a.id;
            return (
              <label
                key={a.id}
                title={a.rgb ? a.label : "Multicolor: the site's default colors"}
                className={`cc-swatch relative size-5 rounded-full flex-center cursor-default ${
                  a.rgb ? "" : "cc-swatch-multicolor"
                }`}
                style={a.rgb ? { backgroundColor: `rgb(${a.rgb})` } : undefined}
              >
                <input
                  type="radio"
                  name="cc-accent"
                  value={a.id}
                  checked={checked}
                  onChange={() => p.setAccent(a.id)}
                  aria-label={a.label}
                  className="sr-only"
                />
                {checked && (
                  <span
                    className="size-2 rounded-full bg-white shadow-sm"
                    aria-hidden="true"
                  />
                )}
              </label>
            );
          })}
        </div>
      </section>

      {/* Productivity */}
      <DrillTile
        view="shortcuts"
        icon="i-material-symbols:keyboard-command-key"
        title="Shortcuts"
        caption={`${MOD_KEY} K Spotlight`}
        onOpen={openView}
      />
      <DrillTile
        view="notes"
        icon="i-ri:sticky-note-line"
        title="Quick Notes"
        caption={notesPreview(p.notes)}
        onOpen={openView}
      />
    </div>
  );
};

/* ---------------- Shortcuts view ---------------- */

const ShortcutsView = () => (
  <div className="space-y-2">
    {shortcuts.map((group, gi) => (
      <section
        key={group.title}
        className="cc-grid px-2.5 py-2"
        aria-labelledby={`cc-shortcuts-${gi}`}
      >
        <h3
          id={`cc-shortcuts-${gi}`}
          className="cc-text text-[10px] font-semibold uppercase tracking-wide mb-1.5"
        >
          {group.title}
        </h3>
        <dl className="space-y-1.5">
          {group.items.map((item) => (
            <div key={item.label} className="hstack justify-between gap-3">
              <dt className="text-[13px] leading-5 min-w-0">{item.label}</dt>
              <dd className="hstack gap-1 shrink-0">
                {item.keys.map((k) => (
                  <kbd key={k} className="cc-kbd">
                    {k}
                  </kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    ))}
  </div>
);

/* ---------------- Quick Notes view ---------------- */

const smallBtn =
  "h-6 px-2.5 rounded-md text-xs font-medium no-outline cursor-default bg-gray-400/25 dark:bg-gray-300/20 hover:bg-gray-400/40 disabled:(opacity-40 hover:bg-gray-400/25)";

const canCopy =
  typeof window !== "undefined" &&
  window.isSecureContext &&
  typeof navigator !== "undefined" &&
  typeof navigator.clipboard?.writeText === "function";

const NotesView = () => {
  const { notes, setNotes } = usePreferences(
    useShallow((s) => ({ notes: s.notes, setNotes: s.setNotes }))
  );
  const [cleared, setCleared] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (message: string) => {
    setStatus(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus(""), 2000);
  };

  const copy = () => {
    navigator.clipboard.writeText(notes).then(
      () => flash("Copied to clipboard"),
      () => flash("Couldn't copy. Select the text and copy it instead.")
    );
  };

  const clear = () => {
    setCleared(notes);
    setNotes("");
    flash("Notes cleared");
  };

  const undo = () => {
    if (cleared === null) return;
    setNotes(cleared);
    setCleared(null);
    flash("Notes restored");
  };

  return (
    <div>
      <label htmlFor="cc-notes" className="sr-only">
        Quick notes
      </label>
      <textarea
        id="cc-notes"
        value={notes}
        maxLength={NOTES_MAX_LENGTH}
        onChange={(e) => {
          setNotes(e.target.value);
          if (cleared !== null) setCleared(null);
        }}
        placeholder="Questions, follow-ups, things to ask Kunal…"
        spellCheck
        className="cc-grid cc-notes block w-full h-48 p-2.5 resize-none text-[13px] leading-5 text-c-black no-outline"
      />
      <div className="hstack justify-between gap-2 mt-2">
        <span className="cc-text min-w-0 truncate">
          <span aria-live="polite">{status}</span>
          {!status && "Saved in this browser only"}
        </span>
        <div className="hstack gap-1.5 shrink-0">
          {canCopy && (
            <button type="button" className={smallBtn} onClick={copy} disabled={!notes}>
              Copy
            </button>
          )}
          {cleared !== null && notes === "" ? (
            <button type="button" className={smallBtn} onClick={undo}>
              Undo
            </button>
          ) : (
            <button type="button" className={smallBtn} onClick={clear} disabled={!notes}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Panel ---------------- */

interface CCMProps {
  toggleControlCenter: () => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({ toggleControlCenter, btnRef }: CCMProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("main");
  const prevView = useRef<View>("main");

  useClickOutside(panelRef, toggleControlCenter, [btnRef]);

  // Put focus somewhere sensible on open and on every view change, and
  // return to the module you came from when going back.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let target: HTMLElement | null;
    if (view === "notes") target = panel.querySelector<HTMLElement>("#cc-notes");
    else if (view === "shortcuts")
      target = panel.querySelector<HTMLElement>("[data-cc-back]");
    else if (prevView.current !== "main")
      target = panel.querySelector<HTMLElement>(`[data-cc-tile="${prevView.current}"]`);
    else target = panel.querySelector<HTMLElement>("button, input");

    target?.focus({ preventScroll: true });
    if (target instanceof HTMLTextAreaElement) {
      const end = target.value.length;
      target.setSelectionRange(end, end);
    }
    prevView.current = view;
  }, [view]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Control Center"
      onKeyDown={(e) => {
        // In a detail view, Esc goes back one level instead of closing the
        // panel (TopBar's document listener handles closing).
        if (e.key === "Escape" && view !== "main") {
          e.stopPropagation();
          setView("main");
        }
      }}
      className="cc-panel fixed top-9.5 right-0 sm:right-1.5 w-80 max-w-full max-h-[calc(100vh-3rem)] overflow-y-auto p-2.5 text-c-black bg-c-100/70 border border-menu rounded-2xl shadow-menu"
    >
      {view === "main" && <MainView openView={setView} />}
      {view === "shortcuts" && (
        <>
          <DetailHeader title="Keyboard Shortcuts" onBack={() => setView("main")} />
          <ShortcutsView />
        </>
      )}
      {view === "notes" && (
        <>
          <DetailHeader title="Quick Notes" onBack={() => setView("main")} />
          <NotesView />
        </>
      )}
    </div>
  );
}
