import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { User } from "misskey-js/built/entities";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";

export const Header: React.VFC = () => {
  const user = JSON.parse(localStorage.getItem("user") as string) as User;

  return (
    <Flex
      w="full"
      bgColor="teal.900"
      p="2"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text as={RouterLink} to="/" fontSize="xl" color="white">
        AT DUSK
      </Text>
      <Flex alignItems="center">
        <Text as={RouterLink} to={`/user/${user.username}`} color="blue.200">
          {user.username}
        </Text>
        <ColorModeSwitcher boxShadow="base" />
      </Flex>
    </Flex>
  );
};
