import { Button, HStack, useTheme, VStack } from "@yamada-ui/react";
import { Link } from "react-router-dom";

import { Header } from "./components/Header";

import type { LoginState } from "@/store/login";
import type { MeDetailed } from "misskey-js/built/entities";

import { clientRoutes } from "@/consts/routes";
import { useLoginStore } from "@/store/login";
import { useMySelfStore } from "@/store/user";

export const Root = () => {
  const login = useLoginStore();
  const myself = useMySelfStore().mySelf;

  return (
    <>
      <Header />
      {login.isLogin && myself ? (
        <Auth login={login} myself={myself} />
      ) : (
        <Guest />
      )}
    </>
  );
};

const Auth = ({
  login,
  myself,
}: {
  login: LoginState & { logout: () => void };
  myself: MeDetailed;
}) => {
  const { themeScheme, changeThemeScheme } = useTheme();
  return (
    <>
      <VStack p="2">
        ログインしています。
        <p>ログインユーザー: {`@${myself.username}@${login.instance}`}</p>
        <HStack>
          <Button
            onClick={() => {
              login.logout();
            }}
          >
            ログアウト
          </Button>
          <Button
            onClick={() => {
              changeThemeScheme(themeScheme === "pooool" ? "gingko" : "pooool");
            }}
          >
            Change Theme
          </Button>
        </HStack>
      </VStack>
    </>
  );
};

const Guest = () => (
  <VStack p="md" align="start">
    <p>未ログインです</p>
    <Button as={Link} to={clientRoutes.login}>
      ログイン
    </Button>
  </VStack>
);
