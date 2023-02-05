import { useEffect, useRef } from "react";

import { useAppSelector } from "../app/hooks";
import { settings } from "../features/rtk/settingsSlice";

export const useSetTheme = () => {
  const mount = useRef(false);
  const { theme, userInfo } = useAppSelector(settings);
  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      document.querySelector(":root")?.setAttribute("mode", userInfo.themeMode);
      document
        .querySelector(":root")
        ?.setAttribute(
          "theme",
          userInfo.themeMode === "dark" ? theme.darkTheme : theme.lightTheme
        );
    }
  }, [userInfo.themeMode, theme]);
};
