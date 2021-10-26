import { useColorModeValue } from "@chakra-ui/color-mode";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { Header } from "../components/Header";
import { CheckLocation } from "../utils/CheckLocation";
import { SocketProvider } from "../utils/SocketContext";
import { SocketManager } from "../utils/SocketManager";

import { Home } from "./Home";
import { Login } from "./Login";
import { Notes } from "./Notes";
import { Settings } from "./Settings";
import { User } from "./User";

export const App: React.VFC = () => (
  <Router>
    <Flex
      minH="100vh"
      direction="column"
      alignItems="center"
      bgColor={useColorModeValue("light.base", "dark.base")}
      transitionDuration="normal"
      transitionProperty="background-color"
    >
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Auth>
          <SocketProvider>
            <SocketManager>
              <Header />
              <CheckLocation>
                <Switch>
                  <Route exact path="/user/:id">
                    <User />
                  </Route>
                  <Route exact path="/notes/:id">
                    <Notes />
                  </Route>
                  <Route exact path="/settings">
                    <Settings />
                  </Route>
                  <Route exact path="/">
                    <Home />
                  </Route>
                </Switch>
              </CheckLocation>
            </SocketManager>
          </SocketProvider>
        </Auth>
      </Switch>
    </Flex>
  </Router>
);
