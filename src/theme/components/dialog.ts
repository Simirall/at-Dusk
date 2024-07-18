import { defaultTheme } from "@yamada-ui/react";

import { initialThemeScheme } from "../theme";

import type { ComponentMultiStyle, DialogProps } from "@yamada-ui/react";

const YmdDialog: ComponentMultiStyle<DialogProps> =
  defaultTheme.components.Dialog;

export const Dialog: ComponentMultiStyle<DialogProps> = {
  baseStyle: ({ theme, themeScheme, colorMode }) => ({
    ...YmdDialog.baseStyle,
    container: {
      // @ts-expect-error containerはあります！
      ...YmdDialog.baseStyle?.container,
      bg: theme.themeSchemes[themeScheme ?? initialThemeScheme].colors.base[
        colorMode === "light" ? 50 : 600
      ],
    },
  }),
};
