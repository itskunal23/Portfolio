// Platform detection for keyboard shortcuts. Apple platforms use ⌘ as the
// primary modifier; everything else uses Ctrl. We read userAgentData when
// available and fall back to the legacy navigator.platform / userAgent.
const detectApple = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData;
  const platform = uaData?.platform || navigator.platform || navigator.userAgent || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
};

export const IS_APPLE = detectApple();

/** Display label for the primary modifier key. */
export const MOD_KEY = IS_APPLE ? "⌘" : "Ctrl";
export const SHIFT_KEY = IS_APPLE ? "⇧" : "Shift";
export const ENTER_KEY = IS_APPLE ? "Return" : "Enter";

/** True when the platform's primary modifier (⌘ or Ctrl) alone is held. */
export const isModOnly = (e: KeyboardEvent): boolean =>
  (IS_APPLE ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey) &&
  !e.altKey &&
  !e.shiftKey;
