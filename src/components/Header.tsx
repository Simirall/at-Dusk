import { IconButton } from "@chakra-ui/button";
import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { Flex, Text, Avatar, HStack } from "@chakra-ui/react";
import React from "react";
import { IoNotifications } from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { settings } from "../features/settingsSlice";
import { useColors } from "../utils/Colors";
import { useModalsContext } from "../utils/ModalsContext";

export const Header: React.VFC = () => {
  const user = useAppSelector(settings).userInfo.userData;
  const colors = useColors();
  const { onPostModalOpen } = useModalsContext();

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
        <HStack>
          <Text
            as={RouterLink}
            to="/"
            fontSize="xl"
            color={colors.headerTextColor}
          >
            AT DUSK
          </Text>
          <ColorModeSwitcher
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
          />
        </HStack>
        <HStack alignItems="center">
          <IconButton
            aria-label="settings"
            icon={<SettingsIcon />}
            as={RouterLink}
            to={"/settings"}
            variant="ghost"
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
          />
          <IconButton
            aria-label="notifications"
            icon={<IoNotifications fontSize="1.2em" />}
            as={RouterLink}
            to={"/notifications"}
            variant="ghost"
            color={colors.headerTextColor}
            _hover={{
              bgColor: colors.alpha50,
            }}
          />
          <Text as={RouterLink} to={`/user/@${user.username}`} color="blue.200">
            <Avatar
              key={user.id}
              name={user.username}
              src={user.avatarUrl}
              size="md"
              bg="none"
              cursor="pointer"
              borderColor={colors.primaryColor}
              borderWidth="2px"
              _hover={{
                borderColor: colors.secondaryColor,
                borderWidth: "2px",
              }}
            />
          </Text>
          <IconButton
            aria-label="new note"
            icon={<EditIcon />}
            bgColor={colors.panelColor}
            shadow="md"
            onClick={onPostModalOpen}
          />
        </HStack>
      </Flex>
    </>
  );
};
