import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";

export const Loading: React.VFC<{ small?: boolean }> = ({ small }) => {
  return (
    <>
      <Box m="4">
        {small ? (
          <Spinner size="lg" color="teal.500" thickness="4px" />
        ) : (
          <Spinner size="xl" color="teal.500" thickness="4px" />
        )}
      </Box>
    </>
  );
};
