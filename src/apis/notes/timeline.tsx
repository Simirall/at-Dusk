import { useCallback } from "react";

import type { Note } from "misskey-js/entities.js";

import { useCurrentTimelineStore } from "@/store/currentTimeline";
import { useTimelineStore } from "@/store/timeline";
import { fetcher } from "@/utils/fetcher";

const apiPath = {
  homeTimeline: "/notes/timeline",
  localTimeline: "/notes/local-timeline",
  hybridTimeline: "/notes/hybrid-timeline",
  globalTimeline: "/notes/global-timeline",
};

export const useGetTimeline = () => {
  const { currentTimeline } = useCurrentTimelineStore();
  const { addNotesToBottom } = useTimelineStore();

  const getTimeline = useCallback(
    async (arg?: { untilId?: string }) => {
      const notes = await fetcher<ReadonlyArray<Note>>([
        apiPath[currentTimeline],
        arg,
      ]);
      addNotesToBottom(notes);
    },
    [addNotesToBottom, currentTimeline],
  );

  return { getTimeline };
};
