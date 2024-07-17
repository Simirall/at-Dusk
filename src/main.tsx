import { UIProvider, getThemeSchemeScript } from "@yamada-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { theme, config } from "./theme/theme";
import { router } from "./utils/router";

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
      <RouterProvider router={router} />
    </UIProvider>
  </React.StrictMode>,
);
