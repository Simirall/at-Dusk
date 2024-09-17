import { UIProvider, getThemeSchemeScript } from "@yamada-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";

import { Router } from "./Router";
import { config, theme } from "./theme/theme";
import { fetcher } from "./utils/fetcher";

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
      <SWRConfig value={{ fetcher: fetcher }}>
        <Router />
      </SWRConfig>
    </UIProvider>
  </React.StrictMode>,
);
