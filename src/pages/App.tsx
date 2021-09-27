import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { Home } from "./Home";
import { Auth } from "../components/Auth";
import { Login } from "./Login";
import { LoginProvider } from "../utils/LoginContext";

export const App: React.FC = () => (
  <Router>
    <LoginProvider>
      <Flex minH="100vh" p={2} direction="column" alignItems="center">
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Auth>
            <Route exact path="/">
              <Home />
            </Route>
          </Auth>
        </Switch>
      </Flex>
    </LoginProvider>
  </Router>
);
