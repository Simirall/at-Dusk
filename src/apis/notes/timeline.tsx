import type { Note } from "misskey-js/entities.js";

import { useCurrentTimelineStore } from "@/store/currentTimeline";
import { useTimeLineStore } from "@/store/timeline";
import { fetcher } from "@/utils/fetcher";

const apiPath = {
  homeTimeline: "/notes/timeline",
  localTimeline: "/notes/local-timeline",
  hybridTimeline: "/notes/hybrid-timeline",
  globalTimeline: "/notes/global-timeline",
};

export const useGetTimeLine = () => {
  const { currentTimeline } = useCurrentTimelineStore();
  const { addNotesToBottom } = useTimeLineStore();

  const getTimeLine = async (arg?: { untilId?: string }) => {
    const notes = await fetcher<ReadonlyArray<Note>>([
      apiPath[currentTimeline],
      arg,
    ]);
    addNotesToBottom(notes);
  };

  return { getTimeLine };
};
