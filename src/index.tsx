import React from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";

// Imported first so saved preferences (theme, contrast, motion...) are applied
// to <html> before the first render, avoiding a flash of the wrong theme.
import { usePreferences } from "~/stores/preferences";
import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "~/styles/index.css";

export default function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
  };

  if (booting) {
    return <Boot restart={restart} sleep={sleep} setBooting={setBooting} />;
  } else if (login) {
    return (
      <Desktop
        setLogin={setLogin}
        shutMac={shutMac}
        sleepMac={sleepMac}
        restartMac={restartMac}
      />
    );
  } else {
    return (
      <Login
        setLogin={setLogin}
        shutMac={shutMac}
        sleepMac={sleepMac}
        restartMac={restartMac}
      />
    );
  }
}

// The Control Center "Reduce Motion" switch is the source of truth for
// framer-motion too (it defaults to the OS setting on first visit).
const Root = () => {
  const reduceMotion = usePreferences((state) => state.reduceMotion);
  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <App />
    </MotionConfig>
  );
};

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
