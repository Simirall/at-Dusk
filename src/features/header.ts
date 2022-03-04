import { ReactElement } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const headerState = atom<ReactElement | string>({
  key: "headerState",
  default: "",
});

export const useSetHeader = (elm: ReactElement | string) => {
  const setHeader = useSetRecoilState(headerState);
  setHeader(elm);
};

export const useGetHeader = () => {
  return useRecoilValue(headerState);
};
