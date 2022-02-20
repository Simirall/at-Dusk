import React, { memo } from "react";
import { Link } from "react-router-dom";

import { ColorMode } from "../components/ColorMode";
import { TimeLine } from "../components/TimeLine";

export const Home = memo(function Fn() {
  return (
    <>
      <Link to="/user/@Simirall">USER</Link>
      <ColorMode />
      <TimeLine />
    </>
  );
});
