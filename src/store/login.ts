import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useMySelfStore } from "./user";

export type LoginState = {
  isLogin: boolean;
  token?: string;
  instance?: string;
};

type LoginActions = {
  login: (payload: Required<Omit<LoginState, "isLogin">>) => void;
  logout: () => void;
};

export const useLoginStore = create<LoginState & LoginActions>()(
  persist(
    (set) => ({
      isLogin: false,
      login: (payload) =>
        set(() => ({
          isLogin: true,
          ...payload,
        })),
      logout: () => {
        set(() => ({
          isLogin: false,
          token: undefined,
          instance: undefined,
        }));
        useMySelfStore.setState({
          mySelf: undefined,
        });
      },
    }),
    { name: "login" },
  ),
);
