import React from "react";
import { websites, wallpapers } from "~/configs";
import { usePreferences } from "~/stores/preferences";
import { checkURL } from "~/utils";
import type { SiteSectionData, SiteData } from "~/types";

interface SafariState {
  goURL: string;
  currentURL: string;
}

interface SafariProps {
  width?: number;
}

interface NavProps {
  width: number;
  setGoURL: (url: string) => void;
}

interface NavSectionProps extends NavProps {
  section: SiteSectionData;
}

const NavSection = ({ width, section, setGoURL }: NavSectionProps) => {
  const grid = width < 640 ? "grid-cols-4" : "grid-cols-9";

  return (
    <div className="mx-auto w-full max-w-screen-md" p="t-8 x-4">
      <div className="font-medium ml-2" text="xl sm:2xl">
        {section.title}
      </div>
      <div className={`mt-3 grid grid-flow-row ${grid}`}>
        {section.sites.map((site: SiteData) => (
          <div key={`safari-nav-${site.id}`} className="h-28 flex flex-col">
            {(() => {
              const open = site.inner
                ? () => setGoURL(site.link)
                : () => window.open(site.link);
              return (
                <button
                  type="button"
                  onClick={open}
                  aria-label={site.title}
                  title={site.title}
                  className="size-16 mx-auto rounded-md overflow-hidden bg-white cursor-pointer
                    flex-center text-black no-outline
                    focus-visible:(ring-2 ring-blue-500 ring-offset-2)"
                >
                  {site.img ? (
                    <img src={site.img} alt="" aria-hidden="true" />
                  ) : (
                    <span className="text-2xl font-semibold" aria-hidden="true">
                      {site.title.charAt(0)}
                    </span>
                  )}
                </button>
              );
            })()}
            <span m="t-2 x-auto" text-sm>
              {site.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const numTracker = Math.floor(Math.random() * 99 + 1);

const NavPage = ({ width, setGoURL }: NavProps) => {
  const dark = usePreferences((state) => state.dark);

  const grid = width < 640 ? "grid-cols-4" : "grid-cols-8";
  const span = width < 640 ? "col-span-3" : "col-span-7";

  return (
    <div
      className="w-full safari-content overflow-y-scroll bg-center bg-cover text-c-black"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`
      }}
    >
      <div className="w-full min-h-full pt-8 bg-c-100/80 backdrop-blur-2xl">
        {/* Favorites */}
        <NavSection section={websites.favorites} setGoURL={setGoURL} width={width} />

        {/* Frequently Visited */}
        <NavSection section={websites.freq} setGoURL={setGoURL} width={width} />

        {/* Privacy Report */}
        <div className="mx-auto w-full max-w-screen-md" p="t-8 x-4 b-16">
          <div font="medium" text="xl sm:2xl">
            Privacy Report
          </div>
          <div
            className={`h-16 w-full mt-4 grid ${grid} shadow-md rounded-xl text-sm`}
            bg="gray-50/70 dark:gray-600/50"
          >
            <div className="col-start-1 col-span-1 flex-center space-x-2">
              <span className="i-fa-solid:shield-alt text-2xl" />
              <span className="text-xl">{numTracker}</span>
            </div>
            <div className={`col-start-2 ${span} hstack px-2`}>
              In the last seven days, Safari has prevent {numTracker} tracker from
              profiling you.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Safari = ({ width }: SafariProps) => {
  const [state, setState] = useState<SafariState>({
    goURL: "",
    currentURL: ""
  });

  const setGoURL = (url: string) => {
    const isValid = checkURL(url);

    if (isValid) {
      if (url.substring(0, 7) !== "http://" && url.substring(0, 8) !== "https://")
        url = `https://${url}`;
    } else if (url !== "") {
      url = `https://www.bing.com/search?q=${url}`;
    }

    setState({
      goURL: url,
      currentURL: url
    });
  };

  const pressURL = (e: React.KeyboardEvent) => {
    const keyCode = e.key;
    if (keyCode === "Enter") setGoURL((e.target as HTMLInputElement).value);
  };

  const buttonColor = state.goURL === "" ? "text-c-400" : "text-c-700";
  const grid = (width as number) < 640 ? "grid-cols-2" : "grid-cols-3";
  const hideLast = (width as number) < 640 ? "hidden" : "flex";

  return (
    <div className="w-full h-full">
      {/* browser topbar */}
      <div className={`h-10 grid ${grid} items-center bg-c-white`}>
        <div className="flex px-2">
          <button
            className={`safari-btn w-7 ${buttonColor}`}
            onClick={() => setGoURL("")}
            disabled={state.goURL === ""}
            title="Back"
            aria-label="Back"
          >
            <span className="i-jam:chevron-left text-xl" />
          </button>
          <button
            className="safari-btn w-7 text-c-400"
            disabled
            title="Forward"
            aria-label="Forward"
          >
            <span className="i-jam:chevron-right text-xl" />
          </button>
          <button
            className="safari-btn w-9 ml-3 text-c-700"
            title="Show Sidebar"
            aria-label="Show Sidebar"
          >
            <span className="i-bi:layout-sidebar text-sm" />
          </button>
        </div>
        <div className="hstack space-x-2 px-2">
          <button
            className="safari-btn w-9 -ml-10 text-c-400"
            title="Privacy Report"
            aria-label="Privacy Report"
          >
            <span className="i-fa-solid:shield-alt text-sm" />
          </button>
          <input
            type="text"
            value={state.currentURL}
            onChange={(e) => setState({ ...state, currentURL: e.target.value })}
            onKeyPress={pressURL}
            className="h-6 w-full p-2 rounded font-normal no-outline text-sm text-center text-c-500 bg-c-200"
            border="2 transparent focus:blue-400 dark:focus:blue-500"
            placeholder="Search or enter website name"
          />
        </div>
        <div className={`${hideLast} justify-end space-x-2 px-2`}>
          <button
            className={`safari-btn w-9 ${buttonColor}`}
            title="Share…"
            aria-label="Share"
          >
            <span className="i-ion:share-outline" />
          </button>
          <button
            className="safari-btn w-9 text-c-700"
            title="Copy Link"
            aria-label="Copy Link"
          >
            <span className="i-ion:copy-outline" />
          </button>
        </div>
      </div>

      {/* browser content */}
      {state.goURL === "" ? (
        <NavPage setGoURL={setGoURL} width={width as number} />
      ) : (
        <iframe
          title={"Safari clone browser"}
          src={state.goURL}
          className="safari-content w-full bg-white"
        />
      )}
    </div>
  );
};

export default Safari;
