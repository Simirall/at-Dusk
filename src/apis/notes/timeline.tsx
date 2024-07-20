import type { Note } from "misskey-js/entities.js";

import { useTimeLineStore } from "@/store/timeline";
import { fetcher } from "@/utils/fetcher";

export const useGetTimeLine = () => {
  const { addNotesToBottom } = useTimeLineStore();
  const getTimeLine = async (arg?: { untilId?: string }) => {
    const notes = await fetcher<ReadonlyArray<Note>>(["/notes/timeline", arg]);
    addNotesToBottom(notes);
  };

  return { getTimeLine };
};
