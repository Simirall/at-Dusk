import { createBrowserRouter } from "react-router-dom";

import { auth, guest } from "./auth";

import type { RouteObject } from "react-router-dom";

import { clientRoutes } from "@/consts/routes";
import { Login } from "@/pages/auth/Login";
import { Root } from "@/pages/Root";

const routes = [
  {
    path: clientRoutes.index,
    element: <Root />,
  },
  guest([
    {
      path: clientRoutes.login,
      element: <Login />,
    },
  ]),
  auth([]),
] satisfies ReadonlyArray<RouteObject>;

export const router = createBrowserRouter(routes);
