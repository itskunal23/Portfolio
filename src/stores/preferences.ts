import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ======================================================================
   Portfolio preferences (Control Center)
   ----------------------------------------------------------------------
   Real, observable settings for this site only. Nothing here claims to
   control the visitor's device. Values are persisted to localStorage and
   mirrored onto <html> as classes / CSS variables, so styles can react
   without every component subscribing.
   ====================================================================== */

export type Appearance = "light" | "dark" | "system";

export type AccentId =
  | "multicolor"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "graphite";

export interface AccentSpec {
  id: AccentId;
  label: string;
  /** Space-separated sRGB channels. Undefined for "multicolor". */
  rgb?: string;
  /** Deeper shade for text/links on light backgrounds. */
  strongRgb?: string;
}

// macOS accent palette. "Multicolor" keeps the site's default look
// (brand red for content, system blue for controls).
export const ACCENTS: AccentSpec[] = [
  { id: "multicolor", label: "Multicolor" },
  { id: "blue", label: "Blue", rgb: "0 122 255", strongRgb: "0 98 204" },
  { id: "purple", label: "Purple", rgb: "175 82 222", strongRgb: "137 54 180" },
  { id: "pink", label: "Pink", rgb: "255 45 85", strongRgb: "214 28 70" },
  { id: "red", label: "Red", rgb: "255 59 48", strongRgb: "215 30 42" },
  { id: "orange", label: "Orange", rgb: "255 149 0", strongRgb: "178 92 0" },
  { id: "yellow", label: "Yellow", rgb: "255 204 0", strongRgb: "140 105 0" },
  { id: "green", label: "Green", rgb: "40 205 65", strongRgb: "26 127 55" },
  { id: "graphite", label: "Graphite", rgb: "142 142 147", strongRgb: "88 88 92" }
];

/** Discrete text-size steps for app window content. */
export const TEXT_SCALES = [0.85, 1, 1.15, 1.3];

export const NOTES_MAX_LENGTH = 5000;

export type BooleanPreference =
  | "focusMode"
  | "reduceMotion"
  | "highContrast"
  | "keyboardNav";

const BOOLEAN_KEYS: BooleanPreference[] = [
  "focusMode",
  "reduceMotion",
  "highContrast",
  "keyboardNav"
];

const media = (query: string): MediaQueryList | null =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query)
    : null;

const darkQuery = media("(prefers-color-scheme: dark)");

/** Whether we can follow the device's light/dark setting. */
export const systemAppearanceSupported = darkQuery !== null;

const resolveDark = (appearance: Appearance): boolean =>
  appearance === "system" ? !!darkQuery?.matches : appearance === "dark";

interface PersistedPreferences {
  appearance: Appearance;
  accent: AccentId;
  focusMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  keyboardNav: boolean;
  textScale: number;
  notes: string;
}

export interface PreferencesState extends PersistedPreferences {
  /** Resolved theme (appearance + device setting). Not persisted. */
  dark: boolean;
  setAppearance: (v: Appearance) => void;
  setAccent: (v: AccentId) => void;
  toggle: (key: BooleanPreference) => void;
  setTextScale: (v: number) => void;
  setNotes: (v: string) => void;
}

const defaultAppearance: Appearance = systemAppearanceSupported ? "system" : "light";

const defaults: PersistedPreferences = {
  appearance: defaultAppearance,
  accent: "multicolor",
  focusMode: false,
  // First visit inherits the visitor's OS accessibility settings; after
  // that their explicit choice here wins.
  reduceMotion: !!media("(prefers-reduced-motion: reduce)")?.matches,
  highContrast: !!media("(prefers-contrast: more)")?.matches,
  keyboardNav: false,
  textScale: 1,
  notes: ""
};

// localStorage is user-editable, so validate everything we read back.
const sanitize = (raw: unknown): Partial<PersistedPreferences> => {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const out: Partial<PersistedPreferences> = {};

  if (
    r.appearance === "light" ||
    r.appearance === "dark" ||
    (r.appearance === "system" && systemAppearanceSupported)
  )
    out.appearance = r.appearance;
  if (ACCENTS.some((a) => a.id === r.accent)) out.accent = r.accent as AccentId;
  for (const key of BOOLEAN_KEYS) {
    if (typeof r[key] === "boolean") out[key] = r[key] as boolean;
  }
  if (typeof r.textScale === "number" && TEXT_SCALES.includes(r.textScale))
    out.textScale = r.textScale;
  if (typeof r.notes === "string") out.notes = r.notes.slice(0, NOTES_MAX_LENGTH);

  return out;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaults,
      dark: resolveDark(defaults.appearance),
      setAppearance: (appearance) => set({ appearance, dark: resolveDark(appearance) }),
      setAccent: (accent) => set({ accent }),
      toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<PreferencesState>),
      setTextScale: (textScale) => {
        if (TEXT_SCALES.includes(textScale)) set({ textScale });
      },
      setNotes: (notes) => set({ notes: notes.slice(0, NOTES_MAX_LENGTH) })
    }),
    {
      name: "kg-portfolio:preferences",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): PersistedPreferences => ({
        appearance: s.appearance,
        accent: s.accent,
        focusMode: s.focusMode,
        reduceMotion: s.reduceMotion,
        highContrast: s.highContrast,
        keyboardNav: s.keyboardNav,
        textScale: s.textScale,
        notes: s.notes
      }),
      merge: (persisted, current) => {
        const next = { ...current, ...sanitize(persisted) };
        return { ...next, dark: resolveDark(next.appearance) };
      }
    }
  )
);

/* ---------------- Mirror preferences onto the document ---------------- */

const ACCENT_PROPS = [
  "--accent-rgb",
  "--accent",
  "--accent-strong-rgb",
  "--accent-strong",
  "--tint-rgb",
  "--tint"
];

const applyToDocument = (s: PreferencesState): void => {
  const root = document.documentElement;
  root.classList.toggle("dark", s.dark);
  root.classList.toggle("high-contrast", s.highContrast);
  root.classList.toggle("reduce-motion", s.reduceMotion);
  root.classList.toggle("keyboard-nav", s.keyboardNav);
  root.classList.toggle("focus-mode", s.focusMode);

  const accent = ACCENTS.find((a) => a.id === s.accent);
  if (!accent?.rgb || !accent.strongRgb) {
    // Multicolor: fall back to the theme tokens in theme.css.
    ACCENT_PROPS.forEach((p) => root.style.removeProperty(p));
    return;
  }

  // On dark surfaces the base color already reads well; on light ones use
  // the deeper shade for text so links keep comfortable contrast.
  const strong = s.dark ? accent.rgb : accent.strongRgb;
  root.style.setProperty("--accent-rgb", accent.rgb);
  root.style.setProperty("--accent", `rgb(${accent.rgb})`);
  root.style.setProperty("--accent-strong-rgb", strong);
  root.style.setProperty("--accent-strong", `rgb(${strong})`);
  root.style.setProperty("--tint-rgb", accent.rgb);
  root.style.setProperty("--tint", `rgb(${accent.rgb})`);
};

if (typeof document !== "undefined") {
  applyToDocument(usePreferences.getState());
  usePreferences.subscribe(applyToDocument);

  // Follow live device theme changes while "Auto" is selected.
  darkQuery?.addEventListener?.("change", () => {
    const { appearance } = usePreferences.getState();
    if (appearance === "system") usePreferences.setState({ dark: resolveDark("system") });
  });
}
