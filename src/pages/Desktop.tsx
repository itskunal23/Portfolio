import React from "react";
import { useShallow } from "zustand/react/shallow";
import { apps, wallpapers } from "~/configs";
import { usePreferences } from "~/stores/preferences";
import { isModOnly, minMarginY } from "~/utils";
import type { MacActions } from "~/types";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  // useShallow: the object literal is a new reference every render, so without
  // shallow equality this selector would never bail out of a re-render.
  const { dark, focusMode } = usePreferences(
    useShallow((state) => ({
      dark: state.dark,
      focusMode: state.focusMode
    }))
  );

  const getAppsData = (): void => {
    // Build each map in a single pass with direct assignment. (Previously each
    // field was rebuilt with a spread on every iteration — O(n²) allocation
    // for what is a one-time initialization.)
    const showApps: { [key: string]: boolean } = {};
    const appsZ: { [key: string]: number } = {};
    const maxApps: { [key: string]: boolean } = {};
    const minApps: { [key: string]: boolean } = {};

    apps.forEach((app) => {
      showApps[app.id] = !!app.show;
      appsZ[app.id] = 2;
      maxApps[app.id] = false;
      minApps[app.id] = false;
    });

    setState((prev) => ({ ...prev, showApps, appsZ, maxApps, minApps }));
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleLaunchpad = (target: boolean): void => {
    const r = document.querySelector(`#launchpad`) as HTMLElement;
    if (target) {
      r.style.transform = "scale(1)";
      r.style.transition = "ease-in 0.2s";
    } else {
      r.style.transform = "scale(1.1)";
      r.style.transition = "ease-out 0.2s";
    }

    setState((prev) => ({ ...prev, showLaunchpad: target }));
  };

  const toggleSpotlight = (): void => {
    setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
  };

  // Global shortcuts owned by the desktop (listed in configs/shortcuts.ts):
  //   ⌘/Ctrl + K  toggle Spotlight
  //   Esc         close Launchpad (Spotlight handles its own Esc)
  // The ref keeps the document listener reading the latest state/handlers.
  const latest = useRef({ showLaunchpad: state.showLaunchpad, toggleLaunchpad });
  latest.current = { showLaunchpad: state.showLaunchpad, toggleLaunchpad };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModOnly(e) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
      } else if (e.key === "Escape" && latest.current.showLaunchpad) {
        latest.current.toggleLaunchpad(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
  };

  const setAppMax = (id: string, target?: boolean): void => {
    if (target === undefined) target = !state.maxApps[id];
    setState({
      ...state,
      maxApps: { ...state.maxApps, [id]: target },
      hideDockAndTopbar: target
    });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    if (target === undefined) target = !state.minApps[id];
    setState({
      ...state,
      minApps: { ...state.minApps, [id]: target }
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);

    // get the corrosponding dock icon's position
    let r = document.querySelector(`#dock-${id}`) as HTMLElement;
    const dockAppRect = r.getBoundingClientRect();

    r = document.querySelector(`#window-${id}`) as HTMLElement;
    // const appRect = r.getBoundingClientRect();
    const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
    // "+ window.innerWidth" because of the boundary for windows
    const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

    // translate the window to that position
    r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    r.style.transition = "ease-out 0.3s";

    // add it to the minimized app list
    setAppMin(id, true);
  };

  const closeApp = (id: string): void => {
    // Single immutable update: unmaximize, hide the window, and reveal the
    // dock/topbar. (Previously this called setAppMax then setState separately,
    // and the second update clobbered the first because both read the same
    // stale `state` snapshot.)
    setState({
      ...state,
      maxApps: { ...state.maxApps, [id]: false },
      showApps: { ...state.showApps, [id]: false },
      hideDockAndTopbar: false
    });
  };

  const openApp = (id: string): void => {
    const currentApp = apps.find((app) => app.id === id);
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    const alreadyTop = state.appsZ[id] === state.maxZ;
    const isShown = state.showApps[id];
    const isMinimized = state.minApps[id];

    // Fast path: this fires on every mousedown inside a window (focus). If the
    // window is already shown, already the front-most, and not minimized, there
    // is nothing to change — bail out so a plain click never triggers a full
    // Desktop re-render. This is the main per-click cost we're removing.
    if (alreadyTop && isShown && !isMinimized) return;

    const maxZ = state.maxZ + 1;

    // Immutable clones — never mutate the maps in place.
    const showApps = { ...state.showApps, [id]: true };
    const appsZ = { ...state.appsZ, [id]: maxZ };

    // Restore a minimized window to its last position (imperative transform).
    let minApps = state.minApps;
    if (isMinimized) {
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      if (r) {
        r.style.transform = `translate(${r.style.getPropertyValue(
          "--window-transform-x"
        )}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
        r.style.transition = "ease-in 0.3s";
      }
      minApps = { ...state.minApps, [id]: false };
    }

    // Single state update for the whole operation.
    setState({
      ...state,
      showApps,
      appsZ,
      minApps,
      maxZ,
      currentTitle: currentApp.title
    });
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (app.desktop && state.showApps[app.id]) {
        const props = {
          id: app.id,
          title: app.title,
          width: app.width,
          height: app.height,
          minWidth: app.minWidth,
          minHeight: app.minHeight,
          aspectRatio: app.aspectRatio,
          x: app.x,
          y: app.y,
          z: state.appsZ[app.id],
          active: state.appsZ[app.id] === state.maxZ,
          max: state.maxApps[app.id],
          min: state.minApps[app.id],
          close: closeApp,
          setMax: setAppMax,
          setMin: minimizeApp,
          focus: openApp
        };

        return (
          <AppWindow key={`desktop-app-${app.id}`} {...props}>
            {app.content}
          </AppWindow>
        );
      } else {
        return <div key={`desktop-app-${app.id}`} />;
      }
    });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{
        // Focus Mode swaps the photo wallpaper for a plain backdrop.
        backgroundImage: focusMode
          ? "var(--focus-backdrop)"
          : `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
    >
      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />

      {/* Desktop Apps */}
      <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
        {renderAppWindows()}
      </div>

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />
    </div>
  );
}
