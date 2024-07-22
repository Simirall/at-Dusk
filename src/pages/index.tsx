import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin || !context.myself) {
      throw redirect({ to: "/login" });
    }
  },
});
