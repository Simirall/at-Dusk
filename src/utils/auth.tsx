import { redirect } from "react-router-dom";

import type { RouteObject } from "react-router-dom";

import { loginAtom, loginStore } from "@/apps/login";

export const auth = (routes: Array<RouteObject>) => {
  let isLogin = loginStore.get(loginAtom).isLogin;
  loginStore.sub(loginAtom, () => {
    isLogin = loginStore.get(loginAtom).isLogin;
  });

  return {
    children: routes,
    loader: async () => {
      if (!isLogin) {
        return redirect("/login");
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
        return redirect("/");
      }
      return null;
    },
  } as const satisfies RouteObject;
};
