import { Moon, Sun } from "@phosphor-icons/react";
import { Button, useColorMode, useColorModeValue } from "@yamada-ui/react";

export const ToggleColorModeButton = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(
    <Moon weight="bold" size={20} />,
    <Sun weight="bold" size={20} />,
  );

  return (
    <Button
      onClick={toggleColorMode}
      aria-label="Change Color Scheme"
      p="0"
      borderRadius="full"
      size="sm"
    >
      {icon}
    </Button>
  );
};
