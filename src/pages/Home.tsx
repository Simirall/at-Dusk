import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Link } from "@chakra-ui/react";
import { useLoginContext } from "../utils/LoginContext";

export const Home: React.FC = () => {
  const history = useHistory();
  const { updateLogin } = useLoginContext();
  return (
    <Box textAlign="center" fontSize="xl">
      <Link
        color="teal.500"
        fontSize="2xl"
        onClick={() => {
          localStorage.clear();
          updateLogin(false);
          history.push("/login");
        }}
      >
        Logout
      </Link>
    </Box>
  );
};
