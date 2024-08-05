import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  Container,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";

import { TimelineTab } from "./-components/TimelineTab";

import { useTimeline } from "@/apis/websocket/timeline";
import { useTimelineStore } from "@/store/timeline";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  useTimeline();
  const { notes } = useTimelineStore();

  return (
    <Container>
      <TimelineTab />
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
