import { useMotionValue } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { apps } from "~/configs";

interface DockProps {
  open: (id: string) => void;
  showApps: {
    [key: string]: boolean;
  };
  showLaunchpad: boolean;
  toggleLaunchpad: (target: boolean) => void;
  hide: boolean;
}

export default function Dock({
  open,
  showApps,
  showLaunchpad,
  toggleLaunchpad,
  hide
}: DockProps) {
  const { dockSize, dockMag } = useStore(
    useShallow((state) => ({
      dockSize: state.dockSize,
      dockMag: state.dockMag
    }))
  );

  const openApp = (id: string) => {
    if (id === "launchpad") toggleLaunchpad(!showLaunchpad);
    else {
      toggleLaunchpad(false);
      open(id);
    }
  };

  const mouseX = useMotionValue<number | null>(null);

  // Only run the per-item magnification rAF loops while the dock is actually
  // hovered. Without this gate, every DockItem runs a requestAnimationFrame
  // loop (reading getBoundingClientRect every frame) for the entire session,
  // which is a continuous main-thread cost and a major source of general lag.
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`dock fixed inset-x-0 mx-auto bottom-1 ${hide ? "z-0" : "z-50"}`}
      w="full sm:max"
      overflow="x-scroll sm:x-visible"
    >
      <ul
        aria-label="Dock"
        className="flex space-x-2 px-2 backdrop-blur-2xl bg-c-white/20"
        border="~ c-400/40 rounded-none sm:rounded-xl"
        onMouseEnter={() => setHovered(true)}
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => {
          mouseX.set(null);
          setHovered(false);
        }}
        style={{
          height: `${(dockSize + 15) / 16}rem`
        }}
      >
        {apps.map((app) => (
          <DockItem
            key={`dock-${app.id}`}
            id={app.id}
            title={app.title}
            img={app.img}
            mouseX={mouseX}
            dockHovered={hovered}
            desktop={app.desktop}
            openApp={openApp}
            isOpen={app.desktop && showApps[app.id]}
            link={app.link}
            dockSize={dockSize}
            dockMag={dockMag}
          />
        ))}
      </ul>
    </div>
  );
}
