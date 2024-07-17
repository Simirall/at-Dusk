import { defaultTheme } from "@yamada-ui/react";

import { initialThemeScheme } from "../theme";

import type { ComponentMultiStyle, MenuProps } from "@yamada-ui/react";

const YmdMenu: ComponentMultiStyle<MenuProps> = defaultTheme.components.Menu;

export const Menu: ComponentMultiStyle<MenuProps> = {
  baseStyle: ({ theme, themeScheme, colorMode }) => ({
    list: {
      // @ts-expect-error listはあります！
      ...YmdMenu.baseStyle?.list,
      bg: theme.themeSchemes[themeScheme ?? initialThemeScheme].colors.base[
        colorMode === "light" ? 50 : 600
      ],
    },
  }),
};
