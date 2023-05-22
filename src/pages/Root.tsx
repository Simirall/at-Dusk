import { useAtomValue } from "jotai";
import { Link } from "react-router-dom";

import { Landing } from "./Landing";
import { loginAtom } from "../apps/login";

export const Root = () => {
  const login = useAtomValue(loginAtom);
  return login.isLogin ? (
    <>
      ログインしています。
      <p>
        <Link to="/profile">PROFILE</Link>
      </p>
      <p>
        <button></button>
      </p>
    </>
  ) : (
    <Landing />
  );
};
