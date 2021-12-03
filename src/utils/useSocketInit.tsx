import { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes } from "../features/notesSlice";
import { settings } from "../features/settingsSlice";

import { useSocket, useSocketOpen } from "./SocketContext";
import { useAPIObject } from "./useAPIObject";

export const useSocketInit = (): void => {
  const timeline = useAppSelector(settings).timeline;
  const socket = useSocket();
  const { updateSocketOpen } = useSocketOpen();
  const notes = useAppSelector(allNotes);
  const initNotesObject = useAPIObject({
    id: "initNotes",
    type: "api",
    endpoint: `notes/${
      timeline === "homeTimeline"
        ? "timeline"
        : timeline === "localTimeline"
        ? "local-timeline"
        : timeline === "hybridTimeline"
        ? "hybrid-timeline"
        : "global-timeline"
    }`,
    data: {
      limit: 15,
    },
  });
  const timelineObject = useAPIObject({
    id: "timeline",
    type: "connect",
    channel: timeline,
  });
  useEffect(() => {
    socket.onopen = () => {
      console.log("SOCKET OPEND");
      updateSocketOpen(true);
      socket.send(JSON.stringify(timelineObject));
      if (notes.length === 0) socket.send(JSON.stringify(initNotesObject));
    };
  });
};
