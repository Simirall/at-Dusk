import { Landing } from "./Landing";

import { setLogin, useGetLogin } from "@/apps/login";
import { useGetMySelf } from "@/apps/user";

export const Root = () => {
  const login = useGetLogin();
  const myself = useGetMySelf();
  return login.isLogin && myself ? (
    <>
      ログインしています。
      <p>ログインユーザー: {`@${myself.username}@${login.instance}`}</p>
      <p>
        <button
          onClick={() => {
            setLogin({
              isLogin: false,
            });
          }}
        >
          ログアウト
        </button>
      </p>
    </>
  ) : (
    <Landing />
  );
};
