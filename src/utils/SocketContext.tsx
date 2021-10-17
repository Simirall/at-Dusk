import React, { useRef, createContext, useContext } from "react";

const SocketContext = createContext<React.MutableRefObject<WebSocket>>(
  {} as React.MutableRefObject<WebSocket>
);

const SocketProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const socketRef = useRef<WebSocket>(
    new WebSocket(
      "wss://" +
        localStorage.getItem("instanceURL") +
        "/streaming?i=" +
        localStorage.getItem("UserToken")
    )
  );

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
