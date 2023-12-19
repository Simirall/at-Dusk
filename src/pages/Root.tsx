import { Landing } from "./Landing";

import { useLoginStore } from "@/store/login";
import { useMySelfStore } from "@/store/user";

export const Root = () => {
  const login = useLoginStore();
  const myself = useMySelfStore().mySelf;

  return login.isLogin && myself ? (
    <>
      ログインしています。
      <p>ログインユーザー: {`@${myself.username}@${login.instance}`}</p>
      <p>
        <button
          onClick={() => {
            login.logout();
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
