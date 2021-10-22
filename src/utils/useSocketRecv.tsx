import { Note } from "misskey-js/built/entities";
import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { set } from "../features/noteDetailsSlice";
import { addUpper, addLower } from "../features/notesSlice";

import { useSocket } from "./SocketContext";

export const useSocketRecv = (): void => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const data = res.body;
      switch (res.type) {
        case "channel":
          switch (data.id) {
            case "timeline":
              dispatch(addUpper(data.body));
              break;
          }
          break;
        case "api:initNotes":
          data.res.forEach((note: Note) => {
            dispatch(addLower(note));
          });
          break;
        case "api:noteDetails":
          dispatch(set(data.res));
          break;
      }
    };
  });
};
