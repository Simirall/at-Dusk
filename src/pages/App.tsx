import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { Home } from "./Home";
import { Auth } from "../components/Auth";
import { Login } from "./Login";
import { Header } from "../components/Header";
import { User } from "./User";

export const App: React.VFC = () => (
  <Router>
    <Flex minH="100vh" direction="column" alignItems="center">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Auth>
          <Header />
          <Switch>
            <Route exact path="/user/:id">
              <User />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Auth>
      </Switch>
    </Flex>
  </Router>
);
