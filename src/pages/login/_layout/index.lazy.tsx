import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, Input, Text, VStack } from "@yamada-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import z from "zod";

import type { SubmitHandler } from "react-hook-form";

import { useLoginStore } from "@/store/login";

const LoginSchema = z.object({
  appName: z.string().min(1).max(20),
  instance: z.string().min(1).max(255),
});

type LoginType = z.infer<typeof LoginSchema>;

export const Route = createLazyFileRoute("/login/_layout/")({
  component: Login,
});

function Login() {
  const [loginError, setLoginError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onLoginSubmit: SubmitHandler<LoginType> = (loginData) =>
    authApplication({ loginData: loginData, setLoginError: setLoginError });

  return (
    <VStack p="md">
      <Text>ログインページです。</Text>
      <VStack as="form" onSubmit={handleSubmit(onLoginSubmit)}>
        <Input
          placeholder="@dusk"
          defaultValue="@dusk"
          {...register("appName", { required: true })}
        />
        {errors.appName && <Text color="warning">アプリ名は必須です。</Text>}
        <Input
          placeholder="example.com"
          defaultValue="honi.club"
          {...register("instance", { required: true })}
        />
        {errors.instance && (
          <Text color="warning">インスタンス名は必須です。</Text>
        )}
        <Button type="submit">次へ</Button>
        {loginError && <p>{loginError}</p>}
      </VStack>
    </VStack>
  );
}

const authApplication = async ({
  loginData,
  setLoginError,
}: {
  loginData: LoginType;
  setLoginError: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const id = uuid();
  const appURL = `${document.location.href}/getToken`;
  const checkEndpointURL = `https://${loginData.instance}/api/endpoints`;
  const login = useLoginStore.getState();
  const setLogin = useLoginStore.setState;

  const endpoints: ReadonlyArray<string> = await fetch(checkEndpointURL, {
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
  const authURL = `https://${encodeURIComponent(loginData.instance)}/miauth/${id}?name=${encodeURIComponent(
    loginData.appName,
  )}&callback=${appURL}&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:channels,write:channels`;
  window.location.href = authURL;
};
