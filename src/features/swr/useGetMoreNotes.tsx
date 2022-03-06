import useSWR from "swr";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sendSubNotes } from "../../utils/sendSubNotes";
import { useAPIObject } from "../../utils/useAPIObject";
import { useGetSocket } from "../recoil/socket";
import {
  addLower,
  allNotes,
  isLastInstanceNote,
  moreNote,
  oldestNoteId,
  updateMoreNote,
} from "../rtk/notesSlice";
import { settings } from "../rtk/settingsSlice";

export const useGetMoreNotes = (
  inView: boolean,
  mottoClicked: boolean
): {
  isLoading: boolean;
} => {
  const { userInfo, timeline } = useAppSelector(settings);
  const socket = useGetSocket();
  const notes = useAppSelector(allNotes);
  const last = useAppSelector(isLastInstanceNote);
  const dispatch = useAppDispatch();
  const oldest = useAppSelector(oldestNoteId);
  const motto = useAppSelector(moreNote);
  const body = useAPIObject({
    type: "api",
    data: {
      limit: 15,
      untilId: oldest,
    },
  }) as string;
  const fetcher = async (socket: WebSocket, path: string) => {
    console.log(
      socket && !last && notes.length !== 0 && motto && (inView || mottoClicked)
    );
    dispatch(updateMoreNote(false));
    const res = await fetch(`https://${userInfo.instance}/api${path}`, {
      method: "POST",
      body: body,
    });
    if (!res.ok) {
      const text = await res.json();
      console.error(text);
      const error = new Error(await text.error.message);
      error.name = await text.error.code;
      throw error;
    }
    const text = await res.json();
    console.log(text);
    Promise.all([dispatch(addLower(text)), sendSubNotes(socket, text)]);
    return text;
  };
  const { data, error } = useSWR(
    socket && !last && notes.length !== 0 && motto && (inView || mottoClicked)
      ? [socket, getAPITimeline(timeline), oldest]
      : null,
    fetcher
  );
  return { isLoading: !error && !data };
};

const getAPITimeline = (
  timeline:
    | "homeTimeline"
    | "localTimeline"
    | "hybridTimeline"
    | "globalTimeline"
) =>
  timeline === "homeTimeline"
    ? "/notes/timeline"
    : timeline === "localTimeline"
    ? "/notes/local-timeline"
    : timeline === "hybridTimeline"
    ? "/notes/hybrid-timeline"
    : "/notes/global-timeline";
