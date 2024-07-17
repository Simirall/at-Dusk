import {
  extendConfig,
  extendTheme,
  withDefaultColorScheme,
} from "@yamada-ui/react";

import { Menu } from "./components/menu";
import { themeSchemes } from "./themeSchemes";

import type { UsageTheme } from "@yamada-ui/react";

export const initialThemeScheme = "pooool";

const fonts: UsageTheme = {
  fonts: {
    heading: "'IBM Plex Sans JP', sans-serif",
    body: "'IBM Plex Sans JP', sans-serif",
    mono: "'IBM Plex Mono', 'IBM Plex Sans JP', sans-serif",
  },
};

export const theme = extendTheme(
  {
    ...fonts,
    themeSchemes: themeSchemes,
    // ↓これでbg="bg"とかが動く
    colors: {
      bg: "",
      base: "",
      lightText: "",
      darkText: "",
    },
    styles: {
      globalStyle: ({ theme, themeScheme, colorMode }) => ({
        body: {
          bg: theme.themeSchemes[themeScheme ?? initialThemeScheme].colors.base[
            colorMode === "light" ? 100 : 700
          ],
          color:
            theme.themeSchemes[themeScheme ?? initialThemeScheme].colors[
              colorMode === "light" ? "lightText" : "darkText"
            ],
        },
      }),
    },
    components: {
      Menu,
    },
  },
  withDefaultColorScheme({
    colorScheme: "primary",
  }),
)();

export const config = extendConfig({
  initialThemeScheme: initialThemeScheme,
  initialColorMode: "system",
});
