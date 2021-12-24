import React, { createContext, useContext } from "react";

import { useColors } from "./Colors";
import { useStyleProps } from "./StyleProps";

interface ColorType {
  colors: Record<string, string>;
  props: Record<string, Record<string, string | Record<string, string>>>;
}

const ColorContext = createContext({} as ColorType);

const ColorProvider: React.VFC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const colors = useColors();
  const props = useStyleProps();
  return (
    <>
      <ColorContext.Provider value={{ colors, props }}>
        {children}
      </ColorContext.Provider>
    </>
  );
};

const useColorContext = (): ColorType => useContext(ColorContext);

export { ColorProvider, useColorContext };
