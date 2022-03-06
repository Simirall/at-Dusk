import { Note } from "misskey-js/built/entities";
import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { useGetSocket } from "../features/recoil/socket";
import { addLower } from "../features/rtk/notesSlice";
import { useGetInitNotes } from "../features/swr/useGetInitNotes";

export const useSwrInit = () => {
  const initNotes = useGetInitNotes();
  const dispatch = useAppDispatch();
  const socket = useGetSocket();
  useEffect(() => {
    if (initNotes.data && socket) {
      Promise.all([
        dispatch(addLower(initNotes.data)),
        sendSubNotes(socket, initNotes.data),
      ]);
    }
  }, [initNotes, dispatch, socket]);
};

const sendSubNotes = async (socket: WebSocket, notes: Array<Note>) => {
  notes.forEach(async (note: Note) => {
    socket.send(
      JSON.stringify({
        type: "subNote",
        body: {
          id: note.renoteId && !note.text ? note.renoteId : note.id,
        },
      })
    );
  });
};
