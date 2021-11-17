import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { User } from "misskey-js/built/entities";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { useColors } from "../utils/Colors";

import { PostModal } from "./PostModal";

export const Header: React.VFC = () => {
  const user = JSON.parse(localStorage.getItem("user") as string) as User;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const colors = useColors();

  return (
    <>
      <Flex
        w="full"
        bgColor={colors.primaryColor}
        p="2"
        alignItems="center"
        justifyContent="space-between"
        pos="sticky"
        top="0"
        zIndex="5"
        maxW="6xl"
      >
        <Text
          as={RouterLink}
          to="/"
          fontSize="xl"
          color={colors.headerTextColor}
        >
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
            color={colors.headerTextColor}
          />
          <ColorModeSwitcher
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
          />
          <IconButton
            aria-label="new note"
            marginLeft="2"
            icon={<EditIcon />}
            bgColor={colors.panelColor}
            shadow="md"
            onClick={onOpen}
          />
        </Flex>
      </Flex>
      <PostModal isModalOpen={isOpen} onModalClose={onClose} />
    </>
  );
};
