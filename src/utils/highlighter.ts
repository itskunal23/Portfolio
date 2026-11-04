// Shared, lightweight syntax highlighter.
//
// The default `Prism` export from react-syntax-highlighter bundles ~300
// language grammars. `PrismLight` ships none, so we register only the
// languages this site can realistically render. Unregistered languages
// still render as plain (unhighlighted) code, so nothing breaks.
import { PrismLight } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";

const languages: Record<string, any> = {
  python,
  py: python,
  typescript,
  ts: typescript,
  tsx,
  javascript,
  js: javascript,
  jsx,
  bash,
  sh: bash,
  shell: bash,
  json,
  sql,
  yaml,
  yml: yaml,
  css,
  markdown,
  md: markdown
};

for (const [name, grammar] of Object.entries(languages)) {
  PrismLight.registerLanguage(name, grammar);
}

export default PrismLight;
