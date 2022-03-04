import { chakra } from "@chakra-ui/react";
import { memo } from "react";

import { useGetHeader } from "../features/header";
import { useColorContext } from "../utils/ColorContext";

export const MainHeader = memo(function Fn() {
  const { colors } = useColorContext();
  const headerState = useGetHeader();
  return (
    <chakra.header
      mb="4"
      top="1"
      pos="sticky"
      zIndex="2"
      height="16"
      display="flex"
      justifyContent="center"
      alignItems="center"
      color={colors.text}
      bgColor={colors.base}
      borderRadius="lg"
      backdropFilter="blur(10px) brightness(50%)"
      sx={{ mixBlendMode: "var(--blend)" }}
    >
      {headerState}
    </chakra.header>
  );
});
