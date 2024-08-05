import { useEffect, useRef } from "react";

import { useGetTimeLine } from "@/apis/notes/timeline";
import { useCurrentTimelineStore } from "@/store/currentTimeline";
import { useTimeLineStore } from "@/store/timeline";

export const useWatchCurrentTimeline = () => {
  const { currentTimeline } = useCurrentTimelineStore();
  const { notes } = useTimeLineStore();
  const { getTimeLine } = useGetTimeLine();
  const isFetchingNote = useRef(false);

  useEffect(() => {
    if (!isFetchingNote.current && notes.length === 0) {
      isFetchingNote.current = true;
      getTimeLine().then(() => {
        isFetchingNote.current = false;
      });
    }
  }, [currentTimeline, notes, getTimeLine]);
};
