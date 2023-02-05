import { Loader, Stack } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { store } from "../app/store";
import { setUserInfo } from "../features/rtk/settingsSlice";

export const GetToken: React.FC<{
  uuid: string;
}> = ({ uuid }) => {
  const navigate = useNavigate();
  const [login, setLogin] = useLocalStorage<boolean>({
    key: "login",
  });
  const [instance] = useLocalStorage<boolean>({
    key: "instance",
  });
  const mount = useRef(false);
  const tokenUrl = `https://${instance}/api/miauth/${uuid}/check`;

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      if (login) {
        navigate("/");
      } else {
        verifyLogin(tokenUrl, setLogin);
      }
    }
  }, [login, navigate, tokenUrl, setLogin]);

  return (
    <Stack
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        height: "100vh",
        "@supports(height: 100dvh)": {
          height: "100dvh",
        },
      }}
      align="center"
      justify="space-evenly"
    >
      <Loader size="xl" />
    </Stack>
  );
};

const verifyLogin = async (
  tokenUrl: string,
  setLogin: (val: boolean | ((prevState: boolean) => boolean)) => void
) => {
  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error(res.statusText);
    else {
      const text = await res.json();
      if (text.token) {
        const settings = store.getState().settings.userInfo;
        localStorage.setItem("userId", text.user.id);
        store.dispatch(
          setUserInfo({ ...settings, login: text.ok, userToken: text.token })
        );
        setLogin(true);
      }
    }
  } catch (error) {
    console.error(error);
    localStorage.clear();
    window.location.href = "/login";
  }
};
