import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  Container,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";

import { useTimeLine } from "@/apis/websocket/timeline";
import { useTimeLineStore } from "@/store/timeline";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogin || !context.myself) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  useTimeLine();
  const { notes } = useTimeLineStore();

  return (
    <Container>
      {notes.map((n) => (
        <VStack key={n.id}>
          <HStack align="start">
            <Avatar src={n.user.avatarUrl ?? undefined} />
            <VStack>
              <Text>{`${n.user.name} @${n.user.username}${n.user.host ? `@${n.user.host}` : ""}`}</Text>
              <Text
                whiteSpace="pre-wrap"
                wordBreak="keep-all"
                overflowWrap="anywhere"
              >
                {n.text}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      ))}
      {notes.length > 0 && <Button>もっとみる</Button>}
    </Container>
  );
}
