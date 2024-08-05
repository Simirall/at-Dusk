import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import type { Timelines } from "@/store/currentTimeline";
import type { Note } from "misskey-js/entities.js";

import { useCurrentTimelineStore } from "@/store/currentTimeline";
import { useLoginStore } from "@/store/login";
import { useTimeLineStore } from "@/store/timeline";

type ChannelNote<T> = {
  type: "channel";
  body: {
    id: T;
    type: "note";
    body: Note;
  };
};

const streamTimelineObject = ({
  type,
  channel,
}: {
  type: "connect" | "disconnect";
  channel: Timelines;
}) =>
  JSON.stringify({
    type: type,
    body: {
      channel: channel,
      id: channel,
    },
  });

export const useTimeLine = () => {
  const { instance, token } = useLoginStore();
  const { addNoteToTop } = useTimeLineStore();
  const { currentTimeline } = useCurrentTimelineStore();

  const prevTimeline = useRef(currentTimeline);
  const socketRef = useRef<ReconnectingWebSocket>();

  useEffect(() => {
    if (instance && token && !socketRef.current) {
      const socket = new ReconnectingWebSocket(
        `wss://${instance}/streaming?i=${token}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(
          streamTimelineObject({
            type: "connect",
            channel: currentTimeline,
          }),
        );
      };

      socket.onmessage = (event: MessageEvent) => {
        const response: ChannelNote<typeof currentTimeline> = JSON.parse(
          event.data,
        );
        addNoteToTop(response.body.body);
      };
    }
  }, [instance, token, addNoteToTop, currentTimeline]);

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log(currentTimeline, prevTimeline.current);
      socketRef.current.send(
        streamTimelineObject({
          type: "disconnect",
          channel: prevTimeline.current,
        }),
      );
      socketRef.current.send(
        streamTimelineObject({
          type: "connect",
          channel: currentTimeline,
        }),
      );
      prevTimeline.current = currentTimeline;
    }
  }, [currentTimeline]);
};
