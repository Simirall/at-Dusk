import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useLoginContext } from "../utils/LoginContext";

export const Auth: React.VFC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isLogin = localStorage.getItem("login");
  const { updateToken } = useLoginContext();
  useEffect(() => {
    if (isLogin) updateToken(localStorage.getItem("UserToken") as string);
  });
  return isLogin ? <>{children}</> : <Navigate to="/login" />;
};
