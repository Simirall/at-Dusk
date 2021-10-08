import React from "react";
import { History } from "history";
import { useHistory } from "react-router-dom";
import { useLoginContext } from "../utils/LoginContext";
import { Progress } from "@chakra-ui/progress";
import { Box, Container, Heading, Stack } from "@chakra-ui/layout";

type Props = {
  uuid: string;
};

export const GetToken: React.VFC<Props> = ({ uuid }) => {
  const history = useHistory();
  const { updateLogin } = useLoginContext();
  const tokenUrl = `https://${localStorage.getItem(
    "instanceURL"
  )}/api/miauth/${uuid}/check`;
  fetchData(tokenUrl, history, updateLogin);
  return (
    <Box w="full">
      <Container>
        <Stack marginTop={4}>
          <Heading size="md" textAlign="center">
            Logining...
          </Heading>
          <Progress size="xs" isIndeterminate w="full" />
        </Stack>
      </Container>
    </Box>
  );
};

function fetchData(
  tokenUrl: string,
  history: History,
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
          history.push("/");
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
