import { Box } from "@chakra-ui/react";
import React from "react";

import { useAppSelector } from "../app/hooks";
import { PostForm } from "../components/PostForm";
import { TimeLine } from "../components/TimeLine";
import { settings } from "../features/settingsSlice";
import { useColors } from "../utils/Colors";

export const Home: React.VFC = () => {
  const settingsValue = useAppSelector(settings);
  const colors = useColors();
  return (
    <Box h="full">
      {settingsValue.TLPostForm && (
        <Box
          mt="2"
          mb="1"
          p="2"
          pb="1"
          borderRadius="md"
          bgColor={colors.panelColor}
        >
          <PostForm />
        </Box>
      )}
      <TimeLine />
    </Box>
  );
};
