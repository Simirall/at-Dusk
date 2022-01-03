import { CSSReset, ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "./app/store";
import "focus-visible";
import { ThemeSelector } from "./components/ThemeSelector";
import { App } from "./pages/App";
import { ColorProvider } from "./utils/ColorContext";
import { FocusVisible } from "./utils/FocusVisible";
import { LoginProvider } from "./utils/LoginContext";
import { ModalsProvider } from "./utils/ModalsContext";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <CSSReset />
    <FocusVisible />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LoginProvider>
          <ModalsProvider>
            <ThemeSelector>
              <ColorProvider>
                <App />
              </ColorProvider>
            </ThemeSelector>
          </ModalsProvider>
        </LoginProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
