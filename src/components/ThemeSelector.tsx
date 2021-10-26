import { ChakraProvider } from "@chakra-ui/provider";
import React, { useEffect, useState } from "react";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { getTheme } from "../utils/getTheme";

export const ThemeSelector: React.FC = ({ children }) => {
  const [theme, updateTheme] = useState(getTheme());
  const themeSetting = useAppSelector(settings);
  useEffect(() => {
    updateTheme(
      getTheme(themeSetting.theme.lightTheme, themeSetting.theme.darkTheme)
    );
    localStorage.setItem("light-theme", themeSetting.theme.lightTheme);
    localStorage.setItem("dark-theme", themeSetting.theme.darkTheme);
  }, [themeSetting]);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
