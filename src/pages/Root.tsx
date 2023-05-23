import { Landing } from "./Landing";

import { setLogin, useGetLogin } from "@/apps/login";

export const Root = () => {
  const login = useGetLogin();
  return login.isLogin ? (
    <>
      ログインしています。
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
