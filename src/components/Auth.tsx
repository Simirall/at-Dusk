import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { useLoginContext } from "../utils/LoginContext";

export const Auth: React.VFC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const info = useAppSelector(settings).userInfo;
  const { updateToken } = useLoginContext();
  useEffect(() => {
    if (info?.login) updateToken(info?.userToken as string);
  });
  return info?.login ? <>{children}</> : <Navigate to="/login" />;
};
