import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

import type { SubmitHandler } from "react-hook-form";

import { useLoginStore } from "@/store/login";

type LoginInputs = {
  appName: string;
  instance: string;
};

export const LoginForm = () => {
  const [loginError, setLoginError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onLoginSubmit: SubmitHandler<LoginInputs> = (loginData) =>
    authApplication({ loginData: loginData, setLoginError: setLoginError });

  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1",
      );
    }
  }, []);

  return (
    <>
      ログインページです。
      <form onSubmit={handleSubmit(onLoginSubmit)}>
        <input
          placeholder="@dusk"
          defaultValue="@dusk"
          {...register("appName", { required: true })}
        />
        {errors.appName && <span>アプリ名は必須です。</span>}
        <input
          placeholder="example.com"
          defaultValue="honi.club"
          {...register("instance", { required: true })}
        />
        {errors.instance && <span>インスタンス名は必須です。</span>}
        <button type="submit">次へ</button>
        {loginError && <p>{loginError}</p>}
      </form>
    </>
  );
};

const authApplication = async ({
  loginData,
  setLoginError,
}: {
  loginData: LoginInputs;
  setLoginError: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const id = uuid();
  const appURL = document.location.href;
  const checkEndpointURL = `https://${loginData.instance}/api/endpoints`;
  const login = useLoginStore.getState();
  const setLogin = useLoginStore.setState;

  const endpoints: Array<string> = await fetch(checkEndpointURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (!res.ok) {
        setLoginError("それはMisskeyインスタンスですか？");
        return;
      }
      return res.json();
    })
    .catch(() => {
      setLoginError("それはMisskeyインスタンスですか？");
      return;
    });
  if (!endpoints.includes("miauth/gen-token")) {
    setLoginError("インスタンスがMiAuthに対応していないようです。");
    return;
  }
  setLogin({
    ...login,
    instance: loginData.instance,
  });
  const authURL =
    `https://${encodeURIComponent(
      loginData.instance,
    )}/miauth/${id}?name=${encodeURIComponent(
      loginData.appName,
    )}&callback=${appURL}` +
    // "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:pages,write:pages,write:page-likes,read:page-likes,read:user-groups,write:user-groups,read:channels,write:channels,read:gallery,write:gallery,read:gallery-likes,write:gallery-likes";
    "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:channels,write:channels";
  window.location.href = authURL;
};
