import { Button, Card, Input, InputWrapper, Stack, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

export const LoginForm: React.FC = memo(function Fn() {
  const [error, updateError] = useState("");
  const [, setInstance] = useLocalStorage<string>({
    key: "instance",
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<{ appname: string; instance: string }>();

  const onSubmit = (data: { appname: string; instance: string }) => {
    const id = uuid();
    const appURL = document.location.href;
    (async () => {
      try {
        const res = await fetch(`https://${data.instance}/api/endpoint`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ endpoint: "miauth/gen-token" }),
        });
        if (!res.ok) throw new Error(res.statusText);
        else if (res.status === 204)
          updateError("MiAuthに対応していないようです。");
        else {
          setInstance(data.instance);
          const authURL =
            `https://${data.instance}/miauth/${id}?name=${data.appname}&callback=${appURL}` +
            "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes";
          window.location.href = authURL;
        }
      } catch (error) {
        console.error(error);
        updateError("それはMisskeyインスタンスですか？");
      }
    })();
  };
  return (
    <Stack
      sx={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        height: "100vh",
        "@supports(height: 100dvh)": {
          height: "100dvh",
        },
      }}
      align="center"
      justify="space-evenly"
    >
      <Title
        order={1}
        sx={{
          fontSize: "3rem",
          fontWeight: "normal",
          backgroundImage: "linear-gradient(to top, #ffa17f, #00223e)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        at Dusk.
      </Title>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack align="center">
            <InputWrapper
              id="appname"
              required
              label="アプリケーション名"
              description="Misskeyに登録するこのアプリの名前です。"
            >
              <Input
                id="appname"
                defaultValue="@dusk"
                {...register("appname")}
                required
              />
            </InputWrapper>
            <InputWrapper
              id="instance"
              required
              label="インスタンス名"
              description="Misskey v12以降が必要です。"
              error={error}
              sx={{
                width: "100%",
              }}
            >
              <Input
                id="instance"
                placeholder="misskey.io"
                {...register("instance")}
                required
              />
            </InputWrapper>
            <Button
              loading={isSubmitting}
              type="submit"
              sx={{
                width: "fit-content",
              }}
            >
              LOGIN
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
});
