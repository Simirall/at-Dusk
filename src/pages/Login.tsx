import React from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";

import { GetToken } from "./GetToken";
import { LoginForm } from "./LoginForm";

export const Login: React.VFC = () => {
  const session = getUuid();
  const login = useAppSelector(settings).userInfo?.login;
  return login ? (
    <Navigate to="/" />
  ) : session ? (
    <GetToken uuid={session} />
  ) : (
    <LoginForm />
  );
};

function getUuid(): string | null {
  const params = new URLSearchParams(document.location.search.substring(1));
  const session = params.get("session");
  return session;
}
