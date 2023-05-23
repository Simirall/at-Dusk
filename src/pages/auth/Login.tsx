import { useNavigate } from "react-router-dom";

import { setLogin } from "@/apps/login";
import { clientRoutes } from "@/consts/routes";

export const Login = () => {
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
