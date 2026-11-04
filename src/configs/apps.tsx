import { lazy } from "react";
import type { AppsData } from "~/types";

// Code-split every app window. Each app (and its heavy dependency subtree,
// e.g. Bear pulls in react-markdown + KaTeX + Prism, Typora pulls in milkdown)
// is only downloaded and evaluated the first time that app is opened, instead
// of being parsed up-front on page load. AppWindow renders these inside a
// Suspense boundary that shows a loading fallback while the chunk loads.
const Bear = lazy(() => import("~/components/apps/Bear"));
const Typora = lazy(() => import("~/components/apps/Typora"));
const Safari = lazy(() => import("~/components/apps/Safari"));
const VSCode = lazy(() => import("~/components/apps/VSCode"));
const Terminal = lazy(() => import("~/components/apps/Terminal"));

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "bear",
    title: "Profile: Kunal Goenka",
    desktop: true,
    width: 1180,
    height: 760,
    minWidth: 560,
    minHeight: 460,
    show: true,
    y: -20,
    img: "img/icons/bear.png",
    content: <Bear />
  },
  {
    id: "typora",
    title: "Typora",
    desktop: true,
    width: 600,
    height: 580,
    y: -20,
    img: "img/icons/typora.png",
    content: <Typora />
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: <Safari />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "resume",
    title: "Résumé",
    desktop: false,
    img: "img/icons/launchpad/resume.png",
    link: "/files/kunal-goenka-resume.pdf"
  }
];

export default apps;
