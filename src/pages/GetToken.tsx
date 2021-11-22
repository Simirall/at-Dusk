import { Box, Center } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { store } from "../app/store";
import { Loading } from "../components/Loading";
import { setUserInfo } from "../features/settingsSlice";
import { useLoginContext } from "../utils/LoginContext";

export const GetToken: React.VFC<{
  uuid: string;
}> = ({ uuid }) => {
  const navigate = useNavigate();
  const { login, updateLogin } = useLoginContext();
  const tokenUrl = `https://${
    store.getState().settings.userInfo.instance
  }/api/miauth/${uuid}/check`;
  fetchData(tokenUrl, updateLogin);
  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [login, navigate]);
  return (
    <Box w="full">
      <Center>
        <Loading />
      </Center>
    </Box>
  );
};

function fetchData(
  tokenUrl: string,
  updateLogin: React.Dispatch<React.SetStateAction<boolean>>
) {
  fetch(tokenUrl, {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      if (text.token) {
        localStorage.setItem("userId", text.user.id);
        const settings = store.getState().settings.userInfo;
        store.dispatch(
          setUserInfo({ ...settings, login: text.ok, userToken: text.token })
        );
        Promise.allSettled([fetchMeta(), fetchUser(text.user.id)]).then(() => {
          updateLogin(true);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function fetchMeta() {
  await fetch(
    `https://${store.getState().settings.userInfo.instance}/api/meta`,
    {
      method: "POST",
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      const settings = store.getState().settings.userInfo;
      store.dispatch(setUserInfo({ ...settings, instanceMeta: text }));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
async function fetchUser(id: string) {
  const body = {
    userId: id,
  };
  await fetch(
    `https://${store.getState().settings.userInfo.instance}/api/users/show`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      const settings = store.getState().settings.userInfo;
      store.dispatch(setUserInfo({ ...settings, userData: text }));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
