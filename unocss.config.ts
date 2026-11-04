import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  transformerAttributifyJsx
} from "unocss";

const colorReg = (prefix: string) => new RegExp("^" + prefix + "-([0-9a-z]+)(/(\\d+))?$");

const colorAttr = (prefix: string, [, color, , opacity]: RegExpMatchArray) => {
  let lightColor = "",
    darkColor = "";

  if (["black", "white"].includes(color)) {
    lightColor = color;
    darkColor = color === "white" ? "black" : "white";
  } else {
    lightColor = `gray-${color}`;
    darkColor = `gray-${(
      (+color === 900 || +color === 50 ? 950 : 900) - +color
    ).toString()}`;
  }

  const attr = `${prefix}-${lightColor}${opacity ? "/" + opacity : ""}`;
  const darkAttr = `${prefix}-${darkColor}${opacity ? "/" + opacity : ""}`;

  return `${attr} dark:${darkAttr}`;
};

export default defineConfig({
  shortcuts: [
    ["flex-center", "flex items-center justify-center"],
    ["hstack", "flex items-center"],
    ["vstack", "hstack flex-col"],
    // Removes the default outline but restores a visible, keyboard-only focus
    // ring via :focus-visible so controls stay operable and discoverable for
    // keyboard and assistive-tech users (WCAG 2.4.7 Focus Visible).
    [
      "no-outline",
      "outline-none focus:outline-none focus-visible:(outline-none ring-2 ring-blue-500/70 ring-offset-1 ring-offset-transparent)"
    ],
    [colorReg("text-c"), (v) => colorAttr("text", v)],
    [colorReg("border-c"), (v) => colorAttr("border", v)],
    [colorReg("bg-c"), (v) => colorAttr("bg", v)],
    ["shadow-menu", "shadow-md shadow-black/25 dark:shadow-black/50"],
    // Traffic-light buttons. A press state (active:brightness/scale) and a
    // hover brighten give the mandatory visual feedback the HIG requires so
    // the control never feels dead; focus-visible ring comes from no-outline.
    [
      "window-btn",
      "size-3 text-black rounded-full flex-center no-outline transition duration-100 hover:brightness-110 active:brightness-90 active:scale-90"
    ],
    ["border-menu", "border-gray-500/50"],
    [
      "menu-box",
      "fixed top-8.5 text-c-black bg-c-200/90 border border-menu rounded-lg shadow-menu"
    ],
    // Safari toolbar controls. Adds the missing hover tint and a clear press
    // state (active darken + slight scale) so icon-only buttons respond to
    // input instead of feeling inert. Min height keeps a comfortable target.
    [
      "safari-btn",
      "h-7 min-w-7 no-outline rounded flex-center border border-c-300 transition-colors duration-150 hover:bg-c-200 active:(bg-c-300 scale-95) disabled:(opacity-40 cursor-not-allowed hover:bg-transparent)"
    ],
    // Control Center circular switch: "on" uses the accent tint (follows the
    // Accent Color preference), "off" is a neutral translucent disc.
    [
      "cc-btn",
      "flex-center shrink-0 rounded-full size-8 text-white bg-[var(--tint)] transition-colors duration-150"
    ],
    [
      "cc-btn-off",
      "flex-center shrink-0 rounded-full size-8 text-c-700 bg-gray-400/25 dark:bg-gray-300/25 transition-colors duration-150"
    ],
    // Small round stepper / back button used inside Control Center modules.
    [
      "cc-step",
      "flex-center shrink-0 rounded-full size-7 no-outline text-c-700 bg-gray-400/25 dark:bg-gray-300/20 hover:bg-gray-400/40 active:scale-95 disabled:(opacity-35 hover:bg-gray-400/25)"
    ],
    ["cc-text", "text-xs text-c-500"],
    ["cc-grid", "bg-c-200/80 rounded-xl cc-grid-shadow backdrop-blur-2xl"]
  ],
  rules: [["cc-grid-shadow", { "box-shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.3)" }]],
  presets: [
    presetUno(),
    // `icon` is a component prop in several places (e.g. SliderComponent,
    // ShortcutLink) whose value is a full icon class like "i-ion:sunny".
    // Without ignoring it, the attributify preset rewrites the attribute into
    // an invalid utility (e.g. "ion:icon-sunny"), which UnoCSS then fails to
    // resolve at build time. Ignoring it keeps those icons rendering.
    presetAttributify({ ignoreAttributes: ["icon"] }),
    presetIcons({
      warn: true,
      extraProperties: {
        display: "inline-block"
      }
    })
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    // The JSX attributify transformer scans source with a naive element regex
    // and rewrites any token UnoCSS can parse into `token=""`. Bare CSS length
    // and percentage literals (e.g. "0px", "-10%") are valid UnoCSS tokens, so
    // when they appear inside string literals or expressions they can be
    // corrupted into invalid syntax. These are never meaningful as valueless
    // JSX attributes, so we bypass them to keep the fast regex transformer safe.
    transformerAttributifyJsx({
      blocklist: [/^-?\d*\.?\d+(px|%|rem|em|vh|vw|vmin|vmax|pt|cm|mm|in|ex|ch|fr)$/]
    })
  ]
});
