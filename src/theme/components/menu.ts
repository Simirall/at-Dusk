import { defaultTheme } from "@yamada-ui/react";

import { initialThemeScheme } from "../theme";

import type { ComponentMultiStyle, MenuProps } from "@yamada-ui/react";

const YmdMenu: ComponentMultiStyle<"Menu", MenuProps> =
  defaultTheme.components.Menu;

export const Menu: ComponentMultiStyle<"Menu", MenuProps> = {
  baseStyle: ({ theme, themeScheme, colorMode }) => ({
    ...YmdMenu.baseStyle,
    content: {
      // @ts-expect-error contentはあります！
      ...YmdMenu.baseStyle?.content,
      minW: "unset",
    },
    list: {
      // @ts-expect-error listはあります！
      ...YmdMenu.baseStyle?.list,
      bg: theme.themeSchemes[themeScheme ?? initialThemeScheme].colors.base[
        colorMode === "light" ? 50 : 600
      ],
    },
  }),
};
