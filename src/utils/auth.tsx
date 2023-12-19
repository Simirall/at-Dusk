import { redirect } from "react-router-dom";

import type { RouteObject } from "react-router-dom";

import { clientRoutes } from "@/consts/routes";
import { useLoginStore } from "@/store/login";

export const auth = (routes: Array<RouteObject>) => {
  const isLogin = useLoginStore.getState().isLogin;

  return {
    children: routes,
    loader: async () => {
      if (!isLogin) {
        return redirect(clientRoutes.login);
      }
      return null;
    },
  } as const satisfies RouteObject;
};

export const guest = (routes: Array<RouteObject>) => {
  const isLogin = useLoginStore.getState().isLogin;

  return {
    children: routes,
    loader: async () => {
      if (isLogin) {
        return redirect(clientRoutes.index);
      }
      return null;
    },
  } as const satisfies RouteObject;
};
