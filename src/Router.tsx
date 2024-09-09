import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { useLoginStore } from "./store/login";
import { useMySelfStore } from "./store/user";

import type { LoginState } from "./store/login";
import type { MySelfState } from "./store/user";

export type RouterContext = { auth: LoginState; myself: MySelfState };

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
    myself: undefined!,
  },
});

export const Router = () => {
  const loginStore = useLoginStore();
  const myselfStore = useMySelfStore();

  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth: loginStore, myself: myselfStore }}
      />
    </>
  );
};
