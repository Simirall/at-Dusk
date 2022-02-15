import React from "react";
import { memo } from "react";
import { Navigate } from "react-router-dom";

import {
  useGetLogin,
  useSetIsLogin,
  useSetTheme,
} from "../features/loginState";

export const Auth: React.VFC<{
  children: React.ReactNode;
}> = memo(function Fn({ children }) {
  useSetIsLogin();
  useSetTheme();
  const { login } = useGetLogin();
  return login ? <>{children}</> : <Navigate to="/login" />;
});
