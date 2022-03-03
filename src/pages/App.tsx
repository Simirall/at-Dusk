import { Flex } from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { useColorContext } from "../utils/ColorContext";
import { SocketManager } from "../utils/SocketManager";

import { Home } from "./Home";
import { Login } from "./Login";
import { UserPage } from "./UserPage";

import "../style/theme.scss";

export const App: React.VFC = memo(function Fn() {
  const { colors } = useColorContext();
  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
  }, []);
  return (
    <Flex
      minH="100vh"
      direction="column"
      color={colors.text}
      bgColor={colors.base}
      transition="0.3s ease-in"
    >
      <Router>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="*"
            element={
              <Auth>
                <SocketManager>
                  <Routes>
                    <Route path="user">
                      <Route path=":id" element={<UserPage />} />
                    </Route>
                    <Route path="/" element={<Home />} />
                  </Routes>
                </SocketManager>
              </Auth>
            }
          />
        </Routes>
      </Router>
    </Flex>
  );
});
