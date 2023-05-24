import { getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { UserDetailed } from "misskey-js/built/entities";

const defaultStore = getDefaultStore();

const myselfAtom = atomWithStorage<UserDetailed | undefined>(
  "myself",
  undefined,
);

export const useGetMySelf = () => {
  const myself = useAtomValue(myselfAtom);
  return myself;
};

export const useSetMyself = (user: UserDetailed) => {
  const setMyself = useSetAtom(myselfAtom);
  setMyself(user);
};

export const getMyself = () => {
  const myself = defaultStore.get(myselfAtom);
  return myself;
};

export const setMyself = (user: UserDetailed) => {
  defaultStore.set(myselfAtom, user);
};

export const subscribeMyself = (fun: () => void) =>
  defaultStore.sub(myselfAtom, () => fun());
