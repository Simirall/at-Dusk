import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type LoginState = {
  isLogin: boolean;
  token?: string;
  instance?: string;
};

const defaultStore = getDefaultStore();

const loginAtom = atomWithStorage<LoginState>("login", {
  isLogin: false,
});

export const useGetLogin = () => {
  const login = useAtomValue(loginAtom);
  return login;
};

export const useSetLogin = ({ isLogin, token, instance }: LoginState) => {
  const setLogin = useSetAtom(loginAtom);
  setLogin({
    isLogin: isLogin,
    token: token ?? "",
    instance: instance ?? "",
  });
};

export const getLogin = () => {
  const login = defaultStore.get(loginAtom);
  return login;
};

export const setLogin = ({ isLogin, token, instance }: LoginState) => {
  defaultStore.set(loginAtom, {
    isLogin: isLogin,
    token: token ?? "",
    instance: instance ?? "",
  });
};

export const subscribeLogin = (fun: () => void) =>
  defaultStore.sub(loginAtom, () => fun());
