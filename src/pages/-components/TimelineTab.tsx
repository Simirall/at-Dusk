import { Campfire, Lamp, Meteor, Park } from "@phosphor-icons/react";
import { Button, ButtonGroup } from "@yamada-ui/react";
import { useMemo } from "react";

import { useMeta } from "@/apis/meta/meta";
import {
  useCurrentTimelineStore,
  type Timelines,
} from "@/store/currentTimeline";

const optionalTimelines = (
  localTimelineEnabled?: boolean,
  globalTimelineEnabled?: boolean,
) => {
  const t: Array<Timelines> = [];
  if (localTimelineEnabled) {
    t.push("localTimeline", "hybridTimeline");
  }
  if (globalTimelineEnabled) {
    t.push("globalTimeline");
  }
  return t;
};

const timelineLabel = {
  homeTimeline: "ホーム",
  localTimeline: "ローカル",
  hybridTimeline: "ソーシャル",
  globalTimeline: "グローバル",
};

const timelineIcon = {
  homeTimeline: <Lamp size={24} weight="fill" />,
  localTimeline: <Campfire size={24} weight="fill" />,
  hybridTimeline: <Park size={24} weight="fill" />,
  globalTimeline: <Meteor size={24} weight="fill" />,
};

export const TimelineTab = () => {
  const { currentTimeline, setCurrentTimeline } = useCurrentTimelineStore();
  const features = useMeta().data?.features;
  const timelines = useMemo<Array<Timelines>>(
    () => [
      "homeTimeline",
      ...optionalTimelines(features?.localTimeline, features?.globalTimeline),
    ],
    [features],
  );

  if (!features) {
    return <Button isLoading variant="outline" disabled />;
  }

  return (
    <ButtonGroup gap="4">
      {timelines.map((t) => (
        <Button
          key={t}
          variant={currentTimeline === t ? "solid" : "outline"}
          onClick={() => {
            if (currentTimeline !== t) {
              setCurrentTimeline(t);
            }
          }}
        >
          {timelineIcon[t]}
          {timelineLabel[t]}
        </Button>
      ))}
    </ButtonGroup>
  );
};
