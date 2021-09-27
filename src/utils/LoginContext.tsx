import React, { useState, createContext, useContext } from "react";

interface LoginType {
  login: boolean;
  updateLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext({} as LoginType);

const LoginProvider: React.FC = ({ children }) => {
  const [login, updateLogin] = useState<boolean>(false);
  return (
    <>
      <LoginContext.Provider value={{ login, updateLogin }}>
        {children}
      </LoginContext.Provider>
    </>
  );
};

const useLoginContext = (): LoginType => useContext(LoginContext);

export { LoginProvider, useLoginContext };
