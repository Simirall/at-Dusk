import { useLocalStorage } from "@mantine/hooks";
import { Navigate } from "react-router-dom";

import { GetToken } from "./GetToken";
import { LoginForm } from "./LoginForm";

export const Login = () => {
  const session = getUuid();
  const [login] = useLocalStorage<boolean>({
    key: "login",
  });
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
