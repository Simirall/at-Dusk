import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "./app/store";
import { GlobalStyles } from "./components/GlobalStyles";
import { App } from "./pages/App";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";

const root = createRoot(document.getElementById("root") as HTMLElement);
const persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider withCSSVariables withGlobalStyles withNormalizeCSS>
          <GlobalStyles />
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
