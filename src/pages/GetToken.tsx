import { Box, Center } from "@chakra-ui/layout";
import React from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

import { Loading } from "../components/Loading";
import { useLoginContext } from "../utils/LoginContext";

export const GetToken: React.VFC<{
  uuid: string;
}> = ({ uuid }) => {
  const navigate = useNavigate();
  const { updateLogin } = useLoginContext();
  const tokenUrl = `https://${localStorage.getItem(
    "instanceURL"
  )}/api/miauth/${uuid}/check`;
  fetchData(tokenUrl, navigate, updateLogin);
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
  navigate: NavigateFunction,
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
        localStorage.setItem("login", text.ok);
        localStorage.setItem("UserToken", text.token);
        localStorage.setItem("UserId", text.user.id);
        localStorage.setItem("UserName", text.user.username);
        Promise.allSettled([fetchMeta(), fetchUser()]).then(() => {
          updateLogin(true);
          navigate("/");
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function fetchMeta() {
  await fetch(`https://${localStorage.getItem("instanceURL")}/api/meta`, {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      localStorage.setItem("meta", JSON.stringify(text));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
async function fetchUser() {
  const body = {
    username: localStorage.getItem("UserName"),
  };
  await fetch(`https://${localStorage.getItem("instanceURL")}/api/users/show`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      localStorage.setItem("user", JSON.stringify(text));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
