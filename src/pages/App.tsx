import { Flex } from "@chakra-ui/react";
import React, { memo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { useColorContext } from "../utils/ColorContext";

import { Login } from "./Login";

import "../style/theme.scss";

export const App: React.VFC = memo(function Fn() {
  const { colors } = useColorContext();
  return (
    <Flex minH="100vh" direction="column" bgColor={colors.base}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <Auth>
                <>LOGINED</>
              </Auth>
            }
          />
        </Routes>
      </Router>
    </Flex>
  );
});
