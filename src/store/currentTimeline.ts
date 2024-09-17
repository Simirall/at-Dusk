import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Timelines =
  | "homeTimeline"
  | "localTimeline"
  | "hybridTimeline"
  | "globalTimeline";

export type CurrentTimelineState = {
  currentTimeline: Timelines;
};

type CurrentTimelineActions = {
  setCurrentTimeline: (payload: Timelines) => void;
};

export const useCurrentTimelineStore = create<
  CurrentTimelineState & CurrentTimelineActions
>()(
  persist(
    (set) => ({
      currentTimeline: "homeTimeline",
      setCurrentTimeline: (payload) => {
        set(() => ({
          currentTimeline: payload,
        }));
      },
    }),
    { name: "currentTimeline" },
  ),
);
