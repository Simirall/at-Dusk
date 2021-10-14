import React from "react";
import { Redirect } from "react-router-dom";
import { useLoginContext } from "../utils/LoginContext";

type Props = {
  children: React.ReactNode;
};

export const Auth: React.VFC<Props> = ({ children }) => {
  const { updateToken } = useLoginContext();
  const isLogin = localStorage.getItem("login");
  if (isLogin) updateToken(localStorage.getItem("UserToken") as string);
  return isLogin ? <>{children}</> : <Redirect to={"/login"} />;
};
