import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { SettingsIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { User } from "misskey-js/built/entities";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { useColors } from "../utils/Colors";

export const Header: React.VFC = () => {
  const user = JSON.parse(localStorage.getItem("user") as string) as User;
  const { primaryColor, headerTextColor } = useColors();

  return (
    <Flex
      w="full"
      bgColor={primaryColor}
      p="2"
      alignItems="center"
      justifyContent="space-between"
      pos="sticky"
      top="0"
      zIndex="5"
      maxW="6xl"
    >
      <Text as={RouterLink} to="/" fontSize="xl" color={headerTextColor}>
        AT DUSK
      </Text>
      <Flex alignItems="center">
        <Text as={RouterLink} to={`/user/@${user.username}`} color="blue.200">
          {user.username}
        </Text>
        <IconButton
          aria-label="settings"
          icon={<SettingsIcon />}
          as={RouterLink}
          to={"/settings"}
          marginLeft="2"
          variant="ghost"
          color={headerTextColor}
        />
        <ColorModeSwitcher
          color={headerTextColor}
          _hover={{
            backgroundColor: useColorModeValue(
              "blackAlpha.50",
              "whiteAlpha.50"
            ),
          }}
        />
      </Flex>
    </Flex>
  );
};
