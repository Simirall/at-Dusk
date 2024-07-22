import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import type { LoginState } from "@/store/login";

import { useLoginStore } from "@/store/login";
import { useMySelfStore } from "@/store/user";

export const Route = createLazyFileRoute("/login/_layout/getToken")({
  component: GetToken,
});

function GetToken() {
  const { session } = Route.useSearch();
  const navigate = useNavigate();
  const login = useLoginStore();

  const tokenUrl = `https://${login.instance}/api/miauth/${session}/check`;
  fetchData(tokenUrl, login);

  useEffect(() => {
    if (login.isLogin) {
      navigate({ to: "/", replace: true });
    }
  }, [login, navigate]);

  return <>loading...</>;
}

const fetchData = async (tokenUrl: string, login: LoginState) => {
  const setMyself = useMySelfStore.setState;
  const setLogin = useLoginStore.setState;

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
    setMyself({ mySelf: data.user });
    setLogin({
      ...login,
      isLogin: true,
      token: data.token,
    });
  }
};
