import { Box } from "@chakra-ui/react";
import React from "react";

import { Notification } from "../components/Notification";
import { useColors } from "../utils/Colors";

export const Notifications: React.VFC = () => {
  const colors = useColors();
  return (
    <>
      <Box maxW="95vw" w="6xl" color={colors.textColor}>
        <Notification colors={colors} />
      </Box>
    </>
  );
};
