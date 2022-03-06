import { useToast } from "@chakra-ui/react";
import React, { memo } from "react";

import { useGetSocket, useSetSocket } from "../features/recoil/socket";

import { useSocketInit } from "./useSocketInit";
import { useSocketRecv } from "./useSocketRecv";
import { useSwrInit } from "./useSwrInit";

export const SocketManager: React.VFC<{
  children: React.ReactNode;
}> = memo(function Fn({ children }) {
  useSetSocket();
  useSocketInit();
  useSocketRecv();
  useSwrInit();
  const socket = useGetSocket();
  const toast = useToast();
  if (socket) {
    socket.onerror = (err) => {
      console.error(err);
      toast({
        title: "Socket Error.",
        status: "error",
        duration: 3000,
      });
    };
    socket.onclose = () => {
      console.log("SOCKET CLOSED");
      toast({
        title: "Socket Closed.",
        description: "再接続するにはリロードしてください",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    };
  }
  return <>{children}</>;
});
