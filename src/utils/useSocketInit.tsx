import { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes } from "../features/notesSlice";

import { useSocket } from "./SocketContext";
import { useAPIObject } from "./useAPIObject";

export const useSocketInit = (): void => {
  const socket = useSocket();
  const notes = useAppSelector(allNotes);
  const initNotesObject = useAPIObject({
    id: "initNotes",
    type: "api",
    endpoint: "notes/timeline",
    data: {
      limit: 15,
    },
  });
  const timelineObject = useAPIObject({
    id: "timeline",
    type: "connect",
    channel: "homeTimeline",
  });
  useEffect(() => {
    socket.onopen = () => {
      console.log("SOCKET OPEND");
      socket.send(JSON.stringify(timelineObject));
      if (notes.length === 0) socket.send(JSON.stringify(initNotesObject));
    };
  });
};
