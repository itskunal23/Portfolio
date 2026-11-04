import React from "react";
import useRaf from "@rooks/use-raf";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue
} from "framer-motion";
import { usePreferences } from "~/stores/preferences";

// Hover effect is adopted from https://github.com/PuruVJ/macos-web/blob/main/src/components/dock/DockItem.tsx

const useDockHoverAnimation = (
  mouseX: MotionValue,
  ref: React.RefObject<HTMLImageElement>,
  dockSize: number,
  dockMag: number,
  enabled: boolean
) => {
  const distanceLimit = dockSize * 6;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / (dockMag * 0.65),
    -distanceLimit / (dockMag * 0.85),
    0,
    distanceLimit / (dockMag * 0.85),
    distanceLimit / (dockMag * 0.65),
    distanceLimit
  ];
  const widthOutput = [
    dockSize,
    dockSize * (dockMag * 0.55),
    dockSize * (dockMag * 0.75),
    dockSize * dockMag,
    dockSize * (dockMag * 0.75),
    dockSize * (dockMag * 0.55),
    dockSize
  ];
  const beyondTheDistanceLimit = distanceLimit + 1;

  const distance = useMotionValue(beyondTheDistanceLimit);
  const widthPX = useSpring(useTransform(distance, distanceInput, widthOutput), {
    stiffness: 1700,
    damping: 90
  });

  const width = useTransform(widthPX, (width) => `${width / 16}rem`);

  // The rAF loop only runs while `enabled` (the dock is hovered). When the
  // pointer leaves the dock we run it once more below to settle every icon
  // back to its base size, then it goes idle — no per-frame work at rest.
  useRaf(() => {
    const el = ref.current;
    const mouseXVal = mouseX.get();
    if (el && mouseXVal !== null) {
      const rect = el.getBoundingClientRect();
      const imgCenterX = rect.left + rect.width / 2;
      // difference between the x coordinate value of the mouse pointer
      // and the img center x coordinate value
      const distanceDelta = mouseXVal - imgCenterX;
      distance.set(distanceDelta);
      return;
    }

    distance.set(beyondTheDistanceLimit);
  }, enabled);

  // When the dock stops being hovered, reset the distance once so the spring
  // animates the icon back to its resting width even though the loop is off.
  useEffect(() => {
    if (!enabled) distance.set(beyondTheDistanceLimit);
  }, [enabled, distance, beyondTheDistanceLimit]);

  return { width, widthPX };
};

interface DockItemProps {
  id: string;
  title: string;
  img: string;
  mouseX: MotionValue;
  dockHovered: boolean;
  desktop: boolean;
  openApp: (id: string) => void;
  isOpen: boolean;
  link?: string;
  dockSize: number;
  dockMag: number;
}

export default function DockItem({
  id,
  title,
  img,
  mouseX,
  dockHovered,
  desktop,
  openApp,
  isOpen,
  link,
  dockSize,
  dockMag
}: DockItemProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { winWidth } = useWindowSize();
  const reduceMotion = usePreferences((state) => state.reduceMotion);
  // Magnification is only shown on >=640px screens (see the style guard
  // below), so only arm the rAF loop there, only while hovering, and never
  // when Reduce Motion is on.
  const magnify = winWidth >= 640 && !reduceMotion;
  const animationEnabled = dockHovered && magnify;
  const { width } = useDockHoverAnimation(
    mouseX,
    imgRef,
    dockSize,
    dockMag,
    animationEnabled
  );

  const launchable = desktop || id === "launchpad";
  const tooltipId = `dock-tooltip-${id}`;

  const image = (
    <motion.img
      ref={imgRef}
      src={img}
      alt={title}
      title={title}
      draggable={false}
      style={
        magnify
          ? { width, willChange: "width" }
          : winWidth < 640
            ? {}
            : { width: `${dockSize / 16}rem` }
      }
    />
  );

  return (
    <li id={`dock-${id}`} className="relative flex flex-col justify-end mb-1">
      <p
        id={tooltipId}
        role="tooltip"
        className="tooltip absolute inset-x-0 mx-auto w-max rounded-md bg-c-300/80"
        p="x-3 y-1"
        text="sm c-black"
      >
        {title}
      </p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="no-outline rounded-xl"
          aria-label={title}
          aria-describedby={tooltipId}
        >
          {image}
        </a>
      ) : launchable ? (
        <button
          type="button"
          className="no-outline rounded-xl"
          aria-label={`Open ${title}`}
          aria-describedby={tooltipId}
          onClick={() => openApp(id)}
        >
          {image}
        </button>
      ) : (
        image
      )}
      <div
        className={`size-1 mx-auto rounded-full bg-c-800 ${isOpen ? "" : "invisible"}`}
      />
    </li>
  );
}
