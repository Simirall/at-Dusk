import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useColorContext } from "../utils/ColorContext";

import { ColorMode } from "./ColorMode";
import { IconButton } from "./ui/IconButton";

export const LeftBar = memo(function Fn() {
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
      <VStack justify="space-between" height="full">
        <HStack>
          <IconButton
            model="alpha"
            label="timeline"
            icon={<IoHome />}
            as={Link}
            to="/"
          />
          <Box className="leftbar-label">タイムライン</Box>
        </HStack>
        <ColorMode />
      </VStack>
    </Box>
  );
});
