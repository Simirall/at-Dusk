import React from "react";
import { Redirect } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { GetToken } from "./GetToken";

export const Login: React.VFC = () => {
  const session = getUuid();
  return localStorage.getItem("login") ? (
    <Redirect to={"/"} />
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
