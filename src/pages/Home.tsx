import React, { memo } from "react";

import { ColorMode } from "../components/ColorMode";
import { TimeLine } from "../components/TimeLine";

export const Home = memo(function Fn() {
  return (
    <>
      <ColorMode />
      <TimeLine />
    </>
  );
});
