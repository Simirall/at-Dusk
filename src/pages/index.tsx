import { createFileRoute, redirect } from "@tanstack/react-router";
import { Container, Text } from "@yamada-ui/react";

import { useMySelfStore } from "@/store/user";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin || !context.myself) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  const { mySelf } = useMySelfStore();
  return (
    <Container>
      <Text>{`おかえりなさい、${mySelf?.name}さん`}</Text>
    </Container>
  );
}
