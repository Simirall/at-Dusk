import { useEffect, useRef } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

import { useGetTimeLine } from "../notes/timeline";

import type { Note } from "misskey-js/entities.js";

import { useLoginStore } from "@/store/login";
import { useTimeLineStore } from "@/store/timeline";

const id = "homeTimeLine";

type ChannelNote = {
  type: "channel";
  body: {
    id: typeof id;
    type: "note";
    body: Note;
  };
};

const connectHomeTimeLineObject = JSON.stringify({
  type: "connect",
  body: {
    channel: "homeTimeline",
    id: id,
  },
});

export const useTimeLine = () => {
  const { instance, token } = useLoginStore();
  const { addNoteToTop } = useTimeLineStore();
  const { getTimeLine } = useGetTimeLine();

  const socketRef = useRef<ReconnectingWebSocket>();

  useEffect(() => {
    if (instance && token && !socketRef.current) {
      const socket = new ReconnectingWebSocket(
        `wss://${instance}/streaming?i=${token}`,
      );
      socketRef.current = socket;

      socket.onopen = () => {
        if (useTimeLineStore.getState().notes.length === 0) {
          getTimeLine();
        }
        socket.send(connectHomeTimeLineObject);
      };

      socket.onmessage = (event: MessageEvent) => {
        const response: ChannelNote = JSON.parse(event.data);
        addNoteToTop(response.body.body);
      };
    }
  }, [instance, token, addNoteToTop, getTimeLine]);
};
