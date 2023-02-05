import { useLocalStorage } from "@mantine/hooks";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const Auth: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [login] = useLocalStorage<boolean>({
    key: "login",
    defaultValue: false,
  });
  return !login ? <Navigate to="/login" /> : <>{children}</>;
};
