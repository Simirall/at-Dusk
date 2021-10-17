import {
  Box,
  Container,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Heading,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { v4 as uuid } from "uuid";

import { ColorModeSwitcher } from "../components/ColorModeSwitcher";

export const LoginForm: React.VFC = () => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
  }, []);

  type Inputs = {
    appname: string;
    instance: string;
    mode: "simple" | "advanced";
  };

  const [fetchState, updateFetchState] = useState<{
    ok: boolean;
    message: string;
  }>({ ok: true, message: "" });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    localStorage.setItem("mode", data.mode);
    const id = uuid();
    const appURL = document.location.href;
    const instanceURL = data.instance;
    const checkMiAuthURL = `https://${instanceURL}/api/endpoints`;
    fetch(checkMiAuthURL, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((text) => {
        if (text.includes("miauth/gen-token")) {
          localStorage.setItem("instanceURL", instanceURL);
          const authURL =
            `https://${instanceURL}/miauth/${id}?name=${data.appname}&callback=${appURL}` +
            "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:pages,write:pages,write:page-likes,read:page-likes,read:user-groups,write:user-groups,read:channels,write:channels,read:gallery,write:gallery,read:gallery-likes,write:gallery-likes";
          window.location.href = authURL;
        } else {
          updateFetchState({
            ok: false,
            message: "インスタンスがMiAuthに対応していないようです",
          });
        }
      })
      .catch(() => {
        updateFetchState({
          ok: false,
          message: "それはMisskeyのインスタンスですか？",
        });
      });
  };

  return (
    <>
      <ColorModeSwitcher
        alignSelf="flex-end"
        boxShadow="base"
        marginBottom={2}
      />
      <Box minW="full">
        <Container boxShadow="base" p={4}>
          <Heading
            as="h3"
            size="2xl"
            marginBottom={6}
            fontWeight="normal"
            bgGradient="linear(to top, #ffa17f, #00223e)"
            bgClip="text"
          >
            at Dusk.
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FormControl isInvalid={errors.appname}>
                <FormLabel htmlFor="appname">アプリ名</FormLabel>
                <Input
                  id="appname"
                  placeholder="@dusk"
                  defaultValue="@dusk"
                  {...register("appname", { required: "アプリ名は必須です" })}
                />
                <FormErrorMessage>
                  {errors.appname && errors.appname.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.instance}>
                <FormLabel htmlFor="instance">インスタンス名</FormLabel>
                <Input
                  id="instance"
                  placeholder="misskey.io"
                  {...register("instance", {
                    required: "インスタンス名は必須です",
                    pattern: {
                      value: /(\S+\.)?\S+\.\S+/,
                      message: "インスタンスのドメインを入力してください。",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.instance && errors.instance.message}
                </FormErrorMessage>
              </FormControl>
              <Controller
                name="mode"
                control={control}
                defaultValue="simple"
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormLabel htmlFor="mode">アプリモード</FormLabel>
                    <Stack direction="row">
                      <Radio value="simple" name="simple" />
                      <FormLabel htmlFor="simple">simple</FormLabel>
                      <Radio value="advanced" name="advanced" />
                      <FormLabel htmlFor="advanced">advanced</FormLabel>
                    </Stack>
                  </RadioGroup>
                )}
              />
              {!fetchState.ok && (
                <FormControl isInvalid={!fetchState.ok}>
                  <FormErrorMessage>{fetchState.message}</FormErrorMessage>
                </FormControl>
              )}
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Register
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
    </>
  );
};
