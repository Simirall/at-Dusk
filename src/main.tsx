import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { loginStore } from "./apps/login";
import { router } from "./utils/router";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={loginStore}>
      <ChakraProvider resetCSS>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
