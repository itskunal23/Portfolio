import type { LaunchpadData } from "~/types";

const launchpadApps: LaunchpadData[] = [
  {
    id: "resume",
    title: "Résumé",
    img: "img/icons/launchpad/resume.png",
    link: "/files/kunal-goenka-resume.pdf"
  },
  {
    id: "email",
    title: "Email",
    img: "img/sites/gmail.svg",
    link: "mailto:k.goenka23@gmail.com"
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    img: "img/sites/linkedin.svg",
    link: "https://www.linkedin.com/in/kunalgoenka23/"
  },
  {
    id: "github",
    title: "GitHub",
    img: "img/sites/github.svg",
    link: "https://github.com/itskunal23"
  }
];

export default launchpadApps;
