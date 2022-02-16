import React, { memo } from "react";

import { Button } from "../components/ui/Button";

export const Home = memo(function Fn() {
  return (
    <>
      <Button model="primary" width="fit-content">
        REQ
      </Button>
    </>
  );
});
