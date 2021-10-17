import { Flex, Text } from "@chakra-ui/react";
import { User } from "misskey-js/built/entities";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { useLoginContext } from "../utils/LoginContext";

export const Header: React.VFC = () => {
  const user = JSON.parse(localStorage.getItem("user") as string) as User;
  const history = useHistory();
  const { updateLogin } = useLoginContext();

  return (
    <Flex
      w="full"
      bgColor="teal.900"
      p="2"
      alignItems="center"
      justifyContent="space-between"
      pos="sticky"
      top="0"
      zIndex="1"
      maxW="6xl"
    >
      <Text as={RouterLink} to="/" fontSize="xl" color="white">
        AT DUSK
      </Text>
      <Flex alignItems="center">
        <Text as={RouterLink} to={`/user/@${user.username}`} color="blue.200">
          {user.username}
        </Text>
        <Text
          cursor="pointer"
          color="teal.500"
          onClick={() => {
            localStorage.clear();
            updateLogin(false);
            history.push("/login");
          }}
        >
          Logout
        </Text>
        <ColorModeSwitcher boxShadow="base" />
      </Flex>
    </Flex>
  );
};
