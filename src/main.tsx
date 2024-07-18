import { UIProvider, getThemeSchemeScript } from "@yamada-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";

import { Router } from "./Router";
import { theme, config } from "./theme/theme";

const injectThemeSchemeScript = () => {
  const scriptContent = getThemeSchemeScript({
    initialThemeScheme: config.initialThemeScheme,
  });

  const script = document.createElement("script");

  script.textContent = scriptContent;

  document.head.appendChild(script);
};

injectThemeSchemeScript();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UIProvider theme={theme} config={config}>
      <Router />
    </UIProvider>
  </React.StrictMode>,
);
