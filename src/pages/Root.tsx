import { useAtomValue } from "jotai";

import { Landing } from "./Landing";

import { loginAtom } from "@/apps/login";

export const Root = () => {
  const login = useAtomValue(loginAtom);
  return login.isLogin ? <>ログインしています。</> : <Landing />;
};
