import { Box } from "@mantine/core";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../style/theme.scss";
import { Auth } from "../components/Auth";
import { useSetTheme } from "../utils/useSetTheme";

import { Home } from "./Home";
import { Login } from "./Login";

export const App = () => {
  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
  }, []);

  useSetTheme();

  return (
    <>
      <Box>
        <Router>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route
              path="*"
              element={
                <Auth>
                  <Routes>
                    {/* <Route path="user">
                        <Route path=":id" element={<UserPage />} />
                      </Route> */}
                    {/* <Route path="settings" element={<Settings />} /> */}
                    <Route path="/" element={<Home />} />
                  </Routes>
                </Auth>
              }
            />
          </Routes>
        </Router>
      </Box>
    </>
  );
};
