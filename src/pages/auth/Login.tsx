import { Navigate } from "react-router-dom";

import { GetToken } from "./GetToken";
import { LoginForm } from "./LoginForm";

import { useLoginStore } from "@/store/login";

export const Login: React.FC = () => {
  const session = getUuid();
  const isLogin = useLoginStore().isLogin;

  return isLogin ? (
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
