// Thin wrapper over the browser Fullscreen API (with the WebKit prefix still
// needed by Safari). Browsers only allow entering fullscreen from a user
// gesture, and some contexts (iPhone Safari, iframes without
// allowfullscreen) don't support it at all, so callers should check
// isFullScreenSupported() and handle a rejected promise.

interface FsElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface FsDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
}

export const FULLSCREEN_EVENTS = ["fullscreenchange", "webkitfullscreenchange"];

export const isFullScreenSupported = (): boolean => {
  if (typeof document === "undefined") return false;
  const doc = document as FsDocument;
  return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
};

export const isFullScreen = (): boolean => {
  if (typeof document === "undefined") return false;
  const doc = document as FsDocument;
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
};

export const enterFullScreen = async (): Promise<void> => {
  if (isFullScreen()) return;
  const el = document.documentElement as FsElement;
  if (el.requestFullscreen) await el.requestFullscreen();
  else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
};

export const exitFullScreen = async (): Promise<void> => {
  if (!isFullScreen()) return;
  const doc = document as FsDocument;
  if (doc.exitFullscreen) await doc.exitFullscreen();
  else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
};
