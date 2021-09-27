import React from "react";
import { Redirect } from "react-router-dom";

export const Auth: React.FC = ({ children }) =>
  localStorage.getItem("login") ? <>{children}</> : <Redirect to={"/login"} />;
