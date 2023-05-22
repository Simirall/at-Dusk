import { createBrowserRouter } from "react-router-dom";

import { auth, guest } from "./auth";

import type { RouteObject } from "react-router-dom";

import { Login } from "@/pages/auth/Login";
import { Root } from "@/pages/Root";

const routes = [
  {
    path: "/",
    element: <Root />,
  },
  guest([
    {
      path: "/login",
      element: <Login />,
    },
  ]),
  auth([
    {
      path: "/profile",
      element: <>profile</>,
    },
  ]),
] satisfies ReadonlyArray<RouteObject>;

export const router = createBrowserRouter(routes);
