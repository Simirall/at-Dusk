import { useColorMode } from "@chakra-ui/react";
import React, { memo } from "react";
import { FaMoon } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";

import { IconButton } from "./ui/IconButton";

export const ColorMode: React.VFC = memo(function Fn() {
  const mode = useAppSelector(settings).userInfo.themeMode;
  const dispatch = useAppDispatch();
  const { setColorMode } = useColorMode();
  const { colors } = useColorContext();
  return (
    <IconButton
      size="md"
      fontSize="lg"
      color={colors.text}
      onClick={() => {
        dispatch(setTheme({ themeMode: mode === "dark" ? "light" : "dark" }));
        setColorMode(mode === "dark" ? "light" : "dark");
      }}
      icon={<FaMoon />}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    />
  );
});
