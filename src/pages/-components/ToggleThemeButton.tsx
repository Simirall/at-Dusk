import { PaintRoller } from "@phosphor-icons/react";
import { Button, useTheme } from "@yamada-ui/react";

export const ToggleThemeButton = () => {
  const { themeScheme, changeThemeScheme } = useTheme();

  return (
    <Button
      onClick={() => {
        changeThemeScheme(themeScheme === "pooool" ? "gingko" : "pooool");
      }}
      aria-label="Change Color Scheme"
      p="0"
      borderRadius="full"
      size="sm"
    >
      <PaintRoller size={20} weight="fill" />
    </Button>
  );
};
