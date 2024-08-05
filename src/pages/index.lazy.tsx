import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Button,
  Container,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";

import { TimeLineTab } from "./-components/TimeLineTab";

import { useTimeLine } from "@/apis/websocket/timeline";
import { useTimeLineStore } from "@/store/timeline";
import { useWatchCurrentTimeline } from "@/utils/useWatchCurrentTimeline";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  useTimeLine();
  useWatchCurrentTimeline();
  const { notes } = useTimeLineStore();

  return (
    <Container>
      <TimeLineTab />
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
