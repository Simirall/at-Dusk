import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import { useGetTimeline } from "../notes/timeline";

import type { Timelines } from "@/store/currentTimeline";
import type { Note } from "misskey-js/entities.js";

import { useCurrentTimelineStore } from "@/store/currentTimeline";
import { useLoginStore } from "@/store/login";
import { useTimelineStore } from "@/store/timeline";

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

export const useTimeline = () => {
  const { instance, token } = useLoginStore();
  const { addNoteToTop } = useTimelineStore();
  const { currentTimeline } = useCurrentTimelineStore();
  const { clear } = useTimelineStore();
  const { getTimeline } = useGetTimeline();

  const prevTimeline = useRef(currentTimeline);
  const socketRef = useRef<ReconnectingWebSocket>();

  useEffect(() => {
    if (instance && token && !socketRef.current) {
      const socket = new ReconnectingWebSocket(
        `wss://${instance}/streaming?i=${token}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        getTimeline().then(() => {
          socket.send(
            streamTimelineObject({
              type: "connect",
              channel: currentTimeline,
            }),
          );
        });
      };

      socket.onmessage = (event: MessageEvent) => {
        const response: ChannelNote<typeof currentTimeline> = JSON.parse(
          event.data,
        );
        addNoteToTop(response.body.body);
      };
    }
  }, [instance, token, addNoteToTop, currentTimeline, getTimeline]);

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        streamTimelineObject({
          type: "disconnect",
          channel: prevTimeline.current,
        }),
      );
      clear();
      prevTimeline.current = currentTimeline;
      getTimeline().then(() => {
        socketRef.current?.send(
          streamTimelineObject({
            type: "connect",
            channel: currentTimeline,
          }),
        );
      });
    }
  }, [currentTimeline, getTimeline, clear]);
};
