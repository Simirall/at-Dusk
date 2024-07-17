import { DotsNine } from "@phosphor-icons/react/dist/ssr";
import { Box, Button, Menu, MenuButton, MenuList } from "@yamada-ui/react";

import { ToggleColorModeButton } from "./ToggleColorModeButton";

export const HeaderMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} borderRadius="full" padding={0} size="sm">
        <DotsNine />
      </MenuButton>

      <MenuList>
        <Box mx="auto">
          <ToggleColorModeButton />
        </Box>
      </MenuList>
    </Menu>
  );
};
