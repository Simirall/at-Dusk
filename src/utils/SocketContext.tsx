import React, { useRef, createContext, useContext } from "react";

const SocketContext = createContext<React.MutableRefObject<WebSocket>>(
  {} as React.MutableRefObject<WebSocket>
);

interface Props {
  children: React.ReactChild;
}

const SocketProvider: React.VFC<Props> = ({ children }) => {
  const socketRef = useRef<WebSocket>(
    new WebSocket(
      "wss://" +
        localStorage.getItem("instanceURL") +
        "/streaming?i=" +
        localStorage.getItem("UserToken")
    )
  );
  console.log("SOCKET OPEND");

  socketRef.current.onerror = (e) => {
    console.error(e);
  };

  socketRef.current.onclose = () => {
    console.log("SOCKET CLOSED");
  };

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = (): WebSocket => {
  const socket = useContext(SocketContext);
  return socket.current;
};

export { SocketProvider, useSocket };
