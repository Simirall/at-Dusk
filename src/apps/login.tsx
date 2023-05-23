import { Provider, createStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { FC, ReactNode } from "react";

export type LoginState = {
  isLogin: boolean;
  token?: string;
};

const loginStore = createStore();

const loginAtom = atomWithStorage<LoginState>("login", {
  isLogin: false,
});

export const useGetLogin = () => {
  const login = useAtomValue(loginAtom);
  return login;
};

export const useSetLogin = ({ isLogin, token }: LoginState) => {
  const setLogin = useSetAtom(loginAtom);
  setLogin({
    isLogin: isLogin,
    token: isLogin ? token : "",
  });
};

export const getLogin = () => {
  const login = loginStore.get(loginAtom);
  return login;
};

export const subscribeLogin = (fun: () => void) =>
  loginStore.sub(loginAtom, () => fun());

export const setLogin = ({ isLogin, token }: LoginState) => {
  loginStore.set(loginAtom, {
    isLogin: isLogin,
    token: isLogin ? token : "",
  });
};

export const LoginProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={loginStore}>{children}</Provider>
);
