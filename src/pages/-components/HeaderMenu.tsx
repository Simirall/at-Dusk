import { DotsNine } from "@phosphor-icons/react/dist/ssr";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  VStack,
  useDisclosure,
} from "@yamada-ui/react";

import { LogoutDialog } from "./LogoutDialog";
import { ToggleColorModeButton } from "./ToggleColorModeButton";
import { ToggleThemeButton } from "./ToggleThemeButton";

export const HeaderMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} borderRadius="full" padding={0} size="sm">
        <DotsNine size={20} weight="bold" />
      </MenuButton>

      <MenuList as={VStack} px="2">
        <LogoutButton />
        <HStack justify="center">
          <ToggleThemeButton />
          <ToggleColorModeButton />
        </HStack>
      </MenuList>
    </Menu>
  );
};

const LogoutButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="secondary" onClick={onOpen}>
        ログアウト
      </Button>
      <LogoutDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
};
