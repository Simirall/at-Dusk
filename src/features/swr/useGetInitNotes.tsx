import { Note } from "misskey-js/built/entities";
import useSWR from "swr";

import { useAppSelector } from "../../app/hooks";
import { useAPIObject } from "../../utils/useAPIObject";
import { allNotes } from "../notesSlice";
import { settings } from "../settingsSlice";

export const useGetInitNotes = (): {
  data: Array<Note>;
  error: Error;
  isLoading: boolean;
} => {
  const notes = useAppSelector(allNotes);
  const userInfo = useAppSelector(settings).userInfo;
  const timeline = useAppSelector(settings).timeline;
  const body = useAPIObject({
    type: "api",
    data: {
      limit: 15,
    },
  }) as string;
  const fetcher = (path: string) =>
    fetch(`https://${userInfo.instance}/api${path}`, {
      method: "POST",
      body: body,
    }).then((r) => r.json());
  const { data, error } = useSWR(
    notes.length === 0 ? getAPITimeline(timeline) : null,
    fetcher
  );
  return { data, error, isLoading: !error && !data };
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
