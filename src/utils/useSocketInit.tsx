import { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { useGetSocket } from "../features/socket";

import { useAPIObject } from "./useAPIObject";

export const useSocketInit = () => {
  const socket = useGetSocket();
  const timeline = useAppSelector(settings).timeline;
  const timelineObject = useAPIObject({
    id: "timeline",
    type: "connect",
    channel: timeline,
  });
  const notificationObject = useAPIObject({
    id: "notification",
    type: "connect",
    channel: "main",
  });
  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.log("SOCKET OPENED");
        socket.send(JSON.stringify(timelineObject));
        socket.send(JSON.stringify(notificationObject));
      };
    }
  }, [socket, timelineObject, notificationObject]);
};
