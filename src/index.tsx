import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import {
  ChakraProvider,
  CSSReset,
  theme,
  ColorModeScript,
} from "@chakra-ui/react";
import "focus-visible";
import { FocusVisible } from "./utils/FocusVisible";
import { LoginProvider } from "./utils/LoginContext";
import { SocketProvider } from "./utils/SocketContext";
import { App } from "./pages/App";
import * as serviceWorker from "./utils/serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <CSSReset />
    <FocusVisible />
    <Provider store={store}>
      <LoginProvider>
        <SocketProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </SocketProvider>
      </LoginProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
