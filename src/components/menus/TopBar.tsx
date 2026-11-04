import React from "react";
import { format } from "date-fns";
import { isModOnly } from "~/utils";
import type { MacActions } from "~/types";

interface TopBarItemProps {
  forceHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  /** Accessible name for icon-only interactive items. */
  ariaLabel?: string;
  /** Kind of popup this item opens, for assistive tech. */
  popup?: "menu" | "dialog";
  /** Current open state of the controlled menu/popover. */
  expanded?: boolean;
}

const TopBarItem = forwardRef(
  (props: TopBarItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const bg = props.forceHover
      ? "bg-gray-100/30 dark:bg-gray-400/40"
      : "hover:(bg-gray-100/30 dark:bg-gray-400/40)";

    const interactive = props.onClick !== undefined;

    // Keyboard activation for the role="button" items: Enter/Space mirror a
    // click, matching native button behavior for keyboard users.
    const onKeyDown = interactive
      ? (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onClick?.();
          }
        }
      : undefined;

    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={props.ariaLabel}
        aria-haspopup={props.popup}
        aria-expanded={props.popup ? !!props.expanded : undefined}
        className={`no-outline inline-flex hstack space-x-1 h-6 px-1 cursor-default rounded ${bg} ${
          props.className || ""
        }`}
        onClick={props.onClick}
        onKeyDown={onKeyDown}
        onMouseEnter={props.onMouseEnter}
      >
        {props.children}
      </div>
    );
  }
);

const CCMIcon = ({ size }: { size: number }) => {
  return (
    <svg
      viewBox="0 0 29 29"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z" />
    </svg>
  );
};

interface TopBarProps extends MacActions {
  title: string;
  setSpotlightBtnRef: (value: React.RefObject<HTMLDivElement>) => void;
  hide: boolean;
  toggleSpotlight: () => void;
}

interface TopBarState {
  date: Date;
  showControlCenter: boolean;
  showAppleMenu: boolean;
}

const TopBar = (props: TopBarProps) => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const controlCenterBtnRef = useRef<HTMLDivElement>(null);
  const spotlightBtnRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<TopBarState>({
    date: new Date(),
    showControlCenter: false,
    showAppleMenu: false
  });

  // Latest state for the document-level key handler below.
  const stateRef = useRef(state);
  stateRef.current = state;

  useInterval(() => {
    setState((prev) => ({ ...prev, date: new Date() }));
  }, 60 * 1000);

  useEffect(() => {
    props.setSpotlightBtnRef(spotlightBtnRef);
  }, []);

  // Global shortcuts owned by the menu bar (listed in configs/shortcuts.ts):
  //   ⌘/Ctrl + .  toggle Control Center
  //   Esc         close the open menu and return focus to its button
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModOnly(e) && e.key === ".") {
        e.preventDefault();
        setState((prev) => ({
          ...prev,
          showAppleMenu: false,
          showControlCenter: !prev.showControlCenter
        }));
        return;
      }

      if (e.key === "Escape") {
        const { showControlCenter, showAppleMenu } = stateRef.current;
        if (!showControlCenter && !showAppleMenu) return;
        (showControlCenter ? controlCenterBtnRef : appleBtnRef).current?.focus();
        setState((prev) => ({ ...prev, showControlCenter: false, showAppleMenu: false }));
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleControlCenter = (): void => {
    setState((prev) => ({ ...prev, showControlCenter: !prev.showControlCenter }));
  };

  const toggleAppleMenu = (): void => {
    setState((prev) => ({ ...prev, showAppleMenu: !prev.showAppleMenu }));
  };

  const logout = (): void => {
    props.setLogin(false);
  };

  return (
    <div
      className={`topbar w-full h-8 px-2 fixed top-0 hstack justify-between ${
        props.hide ? "z-0" : "z-20"
      } text-sm text-white bg-gray-700/10 backdrop-blur-2xl shadow transition`}
    >
      <div className="hstack space-x-1">
        <TopBarItem
          className="px-2"
          forceHover={state.showAppleMenu}
          onClick={toggleAppleMenu}
          ref={appleBtnRef}
          ariaLabel="Apple menu"
          popup="menu"
          expanded={state.showAppleMenu}
        >
          <span className="i-ri:apple-fill text-base" aria-hidden="true" />
        </TopBarItem>
        <TopBarItem
          className="font-semibold px-2"
          onMouseEnter={() => {
            if (state.showAppleMenu) toggleAppleMenu();
          }}
        >
          {props.title}
        </TopBarItem>
      </div>

      {/* Open this when clicking on Apple logo */}
      {state.showAppleMenu && (
        <AppleMenu
          logout={logout}
          shut={props.shutMac}
          restart={props.restartMac}
          sleep={props.sleepMac}
          toggleAppleMenu={toggleAppleMenu}
          btnRef={appleBtnRef}
        />
      )}

      <div className="hstack flex-row justify-end space-x-2">
        <TopBarItem
          ref={spotlightBtnRef}
          onClick={props.toggleSpotlight}
          ariaLabel="Spotlight Search"
        >
          <span className="i-bx:search text-[17px]" aria-hidden="true" />
        </TopBarItem>
        <TopBarItem
          forceHover={state.showControlCenter}
          onClick={toggleControlCenter}
          ref={controlCenterBtnRef}
          ariaLabel="Control Center"
          popup="dialog"
          expanded={state.showControlCenter}
        >
          <CCMIcon size={16} />
        </TopBarItem>

        {state.showControlCenter && (
          <ControlCenterMenu
            toggleControlCenter={toggleControlCenter}
            btnRef={controlCenterBtnRef}
          />
        )}

        <TopBarItem>
          <span>{format(state.date, "eee MMM d")}</span>
          <span>{format(state.date, "h:mm aa")}</span>
        </TopBarItem>
      </div>
    </div>
  );
};

export default TopBar;
