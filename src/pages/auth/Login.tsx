import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { loginAtom } from "@/apps/login";
import { clientRoutes } from "@/consts/routes";

export const Login = () => {
  const setLogin = useSetAtom(loginAtom);
  const navigate = useNavigate();
  return (
    <>
      ログインページです。
      <p>
        <button
          onClick={() => {
            setLogin({
              isLogin: true,
              token: "token",
            });
            navigate(clientRoutes.index);
          }}
        >
          LOGIN
        </button>
      </p>
    </>
  );
};
