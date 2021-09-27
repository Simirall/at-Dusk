import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, CSSReset, theme } from "@chakra-ui/react";

import { App } from "./pages/App";
import * as serviceWorker from "./utils/serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <CSSReset />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
