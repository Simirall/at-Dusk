import React from "react";

import { useSocketInit } from "./useSocketInit";
import { useSocketRecv } from "./useSocketRecv";

export const SocketManager: React.VFC<{
  children: React.ReactNode;
}> = ({ children }) => {
  useSocketInit();
  useSocketRecv();
  return <>{children}</>;
};
