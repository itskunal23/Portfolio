import { MOD_KEY, SHIFT_KEY, ENTER_KEY } from "~/utils";

export interface ShortcutItem {
  label: string;
  /** Keys pressed together, in order. */
  keys: string[];
}

export interface ShortcutGroup {
  title: string;
  items: ShortcutItem[];
}

// Every entry here must match real behavior:
//  - Portfolio shortcuts are handled in Desktop.tsx (⌘/Ctrl K, Esc for
//    Launchpad) and TopBar.tsx (⌘/Ctrl ., Esc for menus). Spotlight handles
//    its own Esc / arrows / Return.
//  - Navigation entries are native browser behavior on real buttons/radios.
const shortcuts: ShortcutGroup[] = [
  {
    title: "Portfolio",
    items: [
      { label: "Spotlight search", keys: [MOD_KEY, "K"] },
      { label: "Control Center", keys: [MOD_KEY, "."] },
      { label: "Close menu or panel", keys: ["Esc"] }
    ]
  },
  {
    title: "Keyboard navigation",
    items: [
      { label: "Next control", keys: ["Tab"] },
      { label: "Previous control", keys: [SHIFT_KEY, "Tab"] },
      { label: "Press button", keys: [ENTER_KEY] },
      { label: "Flip a switch", keys: ["Space"] },
      { label: "Change option in a group", keys: ["←", "→"] }
    ]
  },
  {
    title: "Spotlight",
    items: [
      { label: "Choose result", keys: ["↑", "↓"] },
      { label: "Open result", keys: [ENTER_KEY] }
    ]
  },
  {
    title: "Browser",
    items: [{ label: "Exit fullscreen", keys: ["Esc"] }]
  }
];

export default shortcuts;
