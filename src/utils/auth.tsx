import { redirect } from "react-router-dom";

import type { RouteObject } from "react-router-dom";

import { loginAtom, loginStore } from "@/apps/login";
import { clientRoutes } from "@/consts/routes";

export const auth = (routes: Array<RouteObject>) => {
  let isLogin = loginStore.get(loginAtom).isLogin;
  loginStore.sub(loginAtom, () => {
    isLogin = loginStore.get(loginAtom).isLogin;
  });

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
  let isLogin = loginStore.get(loginAtom).isLogin;
  loginStore.sub(loginAtom, () => {
    isLogin = loginStore.get(loginAtom).isLogin;
  });

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
