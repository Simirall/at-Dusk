import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { LoginState } from "@/apps/login";

import { setLogin, useGetLogin } from "@/apps/login";
import { setMyself } from "@/apps/user";

export const GetToken: React.FC<{
  uuid: string;
}> = ({ uuid }) => {
  const navigate = useNavigate();
  const login = useGetLogin();

  const tokenUrl = `https://${login.instance}/api/miauth/${uuid}/check`;
  fetchData(tokenUrl, login);

  useEffect(() => {
    if (login.isLogin) {
      navigate("/");
    }
  }, [login, navigate]);

  return <>loading...</>;
};

const fetchData = async (tokenUrl: string, login: LoginState) => {
  const data = await fetch(tokenUrl, {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .catch((err) => {
      console.error(err);
    });

  if (data.token) {
    setMyself(data.user);
    setLogin({
      ...login,
      isLogin: true,
      token: data.token,
    });
  }
};
