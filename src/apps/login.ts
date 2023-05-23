import { createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type LoginState = {
  isLogin: boolean;
  token?: string;
};

export const loginStore = createStore();

export const loginAtom = atomWithStorage<LoginState>("login", {
  isLogin: false,
});

loginStore.sub(loginAtom, () => {
  console.log(`Login: ${loginStore.get(loginAtom).isLogin}`);
});
