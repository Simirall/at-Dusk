import { Flex } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Auth } from "../components/Auth";
import { Header } from "../components/Header";
import { SocketProvider } from "../utils/SocketContext";
import { SocketManager } from "../utils/SocketManager";

import { Home } from "./Home";
import { Login } from "./Login";
import { User } from "./User";

export const App: React.VFC = () => (
  <Router>
    <Flex minH="100vh" direction="column" alignItems="center">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Auth>
          <SocketProvider>
            <SocketManager>
              <Header />
              <Switch>
                <Route exact path="/user/:id">
                  <User />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
              </Switch>
            </SocketManager>
          </SocketProvider>
        </Auth>
      </Switch>
    </Flex>
  </Router>
);
