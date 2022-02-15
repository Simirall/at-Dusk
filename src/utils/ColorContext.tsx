import React, { createContext, useContext } from "react";

import { useColors } from "./Colors";

interface ColorType {
  colors: Record<string, string>;
}

const ColorContext = createContext({} as ColorType);

const ColorProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const colors = useColors();
  return (
    <>
      <ColorContext.Provider value={{ colors }}>
        {children}
      </ColorContext.Provider>
    </>
  );
};

const useColorContext = (): ColorType => useContext(ColorContext);

export { ColorProvider, useColorContext };
