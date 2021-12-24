import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { Notification } from "../components/Notification";
import { readNotification } from "../features/notificationsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { useAPIObject } from "../utils/useAPIObject";

export const Notifications: React.VFC = () => {
  const { colors } = useColorContext();
  const socket = useSocket();
  const ReadAllNotificationObject = JSON.stringify(
    useAPIObject({
      type: "api",
      id: "readAllNotification",
      endpoint: "notifications/mark-all-as-read",
    })
  );
  const isRead = useAppSelector(readNotification);
  useEffect(() => {
    if (!isRead) {
      socket.send(ReadAllNotificationObject);
    }
  }, [isRead, socket, ReadAllNotificationObject]);
  return (
    <>
      <Box maxW="95vw" w="6xl" color={colors.textColor}>
        <Notification />
      </Box>
    </>
  );
};
