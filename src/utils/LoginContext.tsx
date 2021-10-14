import React, { useState, createContext, useContext } from "react";

interface LoginType {
  login: boolean;
  token: string;
  updateLogin: React.Dispatch<React.SetStateAction<boolean>>;
  updateToken: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
  children: React.ReactChild;
}

const LoginContext = createContext({} as LoginType);

const LoginProvider: React.VFC<Props> = ({ children }) => {
  const [login, updateLogin] = useState<boolean>(false);
  const [token, updateToken] = useState<string>("");
  return (
    <>
      <LoginContext.Provider value={{ login, updateLogin, token, updateToken }}>
        {children}
      </LoginContext.Provider>
    </>
  );
};

const useLoginContext = (): LoginType => useContext(LoginContext);

export { LoginProvider, useLoginContext };
