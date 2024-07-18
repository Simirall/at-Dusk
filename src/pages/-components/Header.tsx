import { Link } from "@tanstack/react-router";
import { Avatar, HStack, Heading } from "@yamada-ui/react";

import { HeaderMenu } from "./HeaderMenu";
import { ToggleColorModeButton } from "./ToggleColorModeButton";

import { useMySelfStore } from "@/store/user";

export const Header = () => {
  const { mySelf } = useMySelfStore();

  return (
    <HStack
      justifyContent="space-between"
      px="md"
      py="2"
      bg="bg"
      color="darkText"
    >
      <Heading size="lg" isTruncated fontWeight="light" as={Link} to="/">
        at Dusk.
      </Heading>
      {mySelf ? (
        <HStack g="md">
          <Avatar
            size="sm"
            src={mySelf.avatarUrl ?? undefined}
            alt={`${mySelf.username} icon`}
          />
          <HeaderMenu />
        </HStack>
      ) : (
        <ToggleColorModeButton />
      )}
    </HStack>
  );
};
