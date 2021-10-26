import { CSSReset, ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { store } from "./app/store";
import "focus-visible";
import { ThemeSelector } from "./components/ThemeSelector";
import { App } from "./pages/App";
import { FocusVisible } from "./utils/FocusVisible";
import { LoginProvider } from "./utils/LoginContext";
import * as serviceWorker from "./utils/serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <CSSReset />
    <FocusVisible />
    <Provider store={store}>
      <LoginProvider>
        <ThemeSelector>
          <App />
        </ThemeSelector>
      </LoginProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
