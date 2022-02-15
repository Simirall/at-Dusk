import { CSSReset, ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { RecoilRoot } from "recoil";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "./app/store";
import "focus-visible";
import { App } from "./pages/App";
import { ColorProvider } from "./utils/ColorContext";
import { FocusVisible } from "./utils/FocusVisible";
import * as serviceWorkerRegistration from "./utils/serviceWorkerRegistration";

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <CSSReset />
    <FocusVisible />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RecoilRoot>
          <ChakraProvider>
            <ColorProvider>
              <App />
            </ColorProvider>
          </ChakraProvider>
        </RecoilRoot>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
