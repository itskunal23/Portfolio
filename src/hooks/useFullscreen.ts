import {
  FULLSCREEN_EVENTS,
  enterFullScreen,
  exitFullScreen,
  isFullScreen,
  isFullScreenSupported
} from "~/utils";

/**
 * Tracks the document's real fullscreen state. State comes from the
 * `fullscreenchange` event, so it stays correct when the user exits with Esc
 * or the browser's own UI, not just through our toggle.
 */
export function useFullscreen() {
  const [active, setActive] = useState<boolean>(isFullScreen);

  useEffect(() => {
    const sync = () => setActive(isFullScreen());
    FULLSCREEN_EVENTS.forEach((e) => document.addEventListener(e, sync));
    return () => FULLSCREEN_EVENTS.forEach((e) => document.removeEventListener(e, sync));
  }, []);

  const toggle = useCallback(() => {
    const action = isFullScreen() ? exitFullScreen() : enterFullScreen();
    // A rejection means the browser refused (no user gesture, permissions
    // policy, unsupported context). State simply stays as it was.
    action.catch(() => setActive(isFullScreen()));
  }, []);

  return { supported: isFullScreenSupported(), active, toggle };
}
