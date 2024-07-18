import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login/_layout")({
  beforeLoad: ({ context }) => {
    if (context.auth.isLogin && context.myself.mySelf) {
      throw redirect({ to: "/", replace: true });
    }
  },
});
