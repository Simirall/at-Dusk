import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MeDetailed } from "misskey-js/built/entities";

export type MySelfState = {
  mySelf: MeDetailed | undefined;
};

type MySelfActions = {
  setMySelf: (payload: MeDetailed) => void;
};

export const useMySelfStore = create<MySelfState & MySelfActions>()(
  persist(
    (set) => ({
      mySelf: undefined,
      setMySelf: (payload) =>
        set({
          mySelf: payload,
        }),
    }),
    { name: "mySelf" },
  ),
);
