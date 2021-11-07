import { Box } from "@chakra-ui/react";
import React from "react";

import { TimeLine } from "../components/TimeLine";

export const Home: React.VFC = () => {
  return (
    <Box h="full">
      <TimeLine />
    </Box>
  );
};
