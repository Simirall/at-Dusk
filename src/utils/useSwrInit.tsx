import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { useGetSocket } from "../features/recoil/socket";
import { addLower } from "../features/rtk/notesSlice";
import { useGetInitNotes } from "../features/swr/useGetInitNotes";

import { sendSubNotes } from "./sendSubNotes";

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
