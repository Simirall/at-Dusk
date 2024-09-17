import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, HStack, Heading } from "@yamada-ui/react";

import { HeaderMenu } from "./HeaderMenu";
import { ToggleColorModeButton } from "./ToggleColorModeButton";

import { useMySelfStore } from "@/store/user";

export const Header = () => {
  const { mySelf } = useMySelfStore();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  return (
    <HStack
      justifyContent="space-between"
      px="md"
      py="2"
      bg="bg"
      color="darkText"
      pos="sticky"
      top="0"
      zIndex="1"
    >
      <Heading
        size="lg"
        isTruncated
        fontWeight="light"
        cursor="pointer"
        onClick={() => {
          if (matchRoute({ to: "/" })) {
            window.scroll({
              top: 0,
              behavior: "smooth",
            });
          } else {
            navigate({ to: "/" });
          }
        }}
      >
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
