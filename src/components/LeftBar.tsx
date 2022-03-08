import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import { IoHome, IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useColorContext } from "../utils/ColorContext";

import { ColorMode } from "./ColorMode";
import { IconButton } from "./ui/IconButton";

export const LeftBar = memo(function Fn() {
  const bool = false;
  const { colors } = useColorContext();
  return (
    <Box
      bgColor={colors.primary}
      height="calc(var(--vh, 1vh) * 100)"
      top="0"
      pos="sticky"
      px="4"
      py="2"
      sx={{
        "@media (max-aspect-ratio: 3/2), (max-width: 800px)": {
          ".leftbar-label": {
            display: "none",
          },
          px: 2,
        },
      }}
    >
      <VStack justify="space-between" height="full" color={colors.textPrimary}>
        <VStack alignItems="start" height="full">
          <HStack>
            <IconButton
              model="alpha"
              aria-label="timeline"
              fontSize="1em"
              icon={<IoHome color={colors.textPrimary} />}
              as={Link}
              to="/"
            />
            <Box className="leftbar-label" {...(bool && { display: "none" })}>
              タイムライン
            </Box>
          </HStack>
          <HStack>
            <IconButton
              model="alpha"
              aria-label="settings"
              fontSize="1em"
              icon={<IoSettings color={colors.textPrimary} />}
              as={Link}
              to="/settings"
            />
            <Box className="leftbar-label" {...(bool && { display: "none" })}>
              設定
            </Box>
          </HStack>
        </VStack>
        <ColorMode />
      </VStack>
    </Box>
  );
});
