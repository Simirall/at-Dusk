import { useEffect } from "react";

import { useGetSocket } from "../features/socket";

export const useSocketRecv = () => {
  const socket = useGetSocket();
  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        console.log(JSON.parse(e.data));
      };
    }
  }, [socket]);
};
