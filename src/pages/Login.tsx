import React from "react";
import { Navigate } from "react-router-dom";

import { GetToken } from "./GetToken";
import { LoginForm } from "./LoginForm";

export const Login: React.VFC = () => {
  const session = getUuid();
  return localStorage.getItem("login") ? (
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
