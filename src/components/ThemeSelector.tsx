import { ChakraProvider } from "@chakra-ui/provider";
import React, { useEffect, useState } from "react";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/settingsSlice";
import { getTheme } from "../utils/getTheme";

export const ThemeSelector: React.FC = ({ children }) => {
  const [theme, updateTheme] = useState(getTheme());
  const themeSetting = useAppSelector(settings).theme;
  useEffect(() => {
    updateTheme(getTheme(themeSetting.lightTheme, themeSetting.darkTheme));
  }, [themeSetting]);
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
