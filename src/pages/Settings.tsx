import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Icon } from "@chakra-ui/icon";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, HStack, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoColorPalette } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, setSettings, settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";

export const Settings: React.VFC = () => {
  const { colors } = useColorContext();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();
  const settingsValue = useAppSelector(settings);

  const onSubmitTheme = (data: { lightTheme: string; darkTheme: string }) => {
    dispatch(setTheme({ theme: data }));
  };
  const onSubmitGenerall = (data: {
    autoMotto: boolean;
    TLPostForm: boolean;
    defaultVisibility: "public" | "home" | "followers" | "specified";
    defaultLocalOnly: boolean;
  }) => {
    dispatch(setSettings(data));
  };
  useEffect(() => {
    document.title = "設定 | at Dusk.";
  }, []);
  return (
    <>
      <Flex p="2" flexDir="column" color={colors.textColor}>
        <Box m="1">
          <form onSubmit={handleSubmit(onSubmitTheme)}>
            <HStack mb="1">
              <Icon as={IoColorPalette} fontSize="2xl" />
              <Box>テーマ</Box>
            </HStack>
            <HStack color={colors.headerTextColor} justify="center">
              <Box>
                <FormLabel color={colors.textColor}>Light Mode</FormLabel>
                <Select
                  {...register("lightTheme")}
                  defaultValue={settingsValue.theme.lightTheme}
                  variant="flushed"
                  color={colors.textColor}
                  sx={{
                    option: {
                      backgroundColor: colors.panelColor,
                    },
                  }}
                >
                  <option value="illuminating">illuminating</option>
                  <option value="moss">moss gray</option>
                </Select>
              </Box>
              <Box>
                <FormLabel color={colors.textColor}>Dark Mode</FormLabel>
                <Select
                  {...register("darkTheme")}
                  defaultValue={settingsValue.theme.darkTheme}
                  variant="flushed"
                  color={colors.textColor}
                  sx={{
                    option: {
                      backgroundColor: colors.panelColor,
                    },
                  }}
                >
                  <option value="chillout">chillout</option>
                  <option value="Ginkgo">Ginkgo biloba</option>
                </Select>
              </Box>
            </HStack>
            <Button colorScheme="blue" marginTop="2" w="full" type="submit">
              更新
            </Button>
          </form>
        </Box>
        <Divider marginBlock="4" />
        <Box m="1">
          <HStack mb="2">
            <SettingsIcon fontSize="xl" />
            <Box>設定</Box>
          </HStack>
          <form onSubmit={handleSubmit(onSubmitGenerall)}>
            <VStack>
              <FormLabel userSelect="none">
                <Switch
                  marginRight="2"
                  size="lg"
                  defaultChecked={settingsValue.autoMotto}
                  {...register("autoMotto")}
                />
                自動でもっと読む
              </FormLabel>
              <FormLabel userSelect="none">
                <Switch
                  marginRight="2"
                  size="lg"
                  defaultChecked={settingsValue.TLPostForm}
                  {...register("TLPostForm")}
                />
                TL上部に投稿フォームを表示する
              </FormLabel>
              <FormLabel userSelect="none">
                デフォルトの公開範囲
                <Select
                  {...register("defaultVisibility")}
                  defaultValue={settingsValue.defaultVisibility}
                  color={colors.textColor}
                  size="sm"
                  sx={{
                    option: {
                      backgroundColor: colors.panelColor,
                    },
                  }}
                >
                  <option value="public">公開</option>
                  <option value="home">ホーム</option>
                  <option value="followers">フォロワー</option>
                  <option value="specified">ダイレクト</option>
                </Select>
              </FormLabel>
              <FormLabel userSelect="none">
                <Switch
                  marginRight="2"
                  defaultChecked={settingsValue.defaultLocalOnly}
                  {...register("defaultLocalOnly")}
                />
                ローカルのみ
              </FormLabel>
            </VStack>
            <Button colorScheme="blue" marginTop="2" w="full" type="submit">
              保存
            </Button>
          </form>
        </Box>
        <Button
          marginTop="10"
          colorScheme="red"
          size="lg"
          onClick={() => {
            localStorage.clear();
            location.reload();
          }}
        >
          Logout
        </Button>
      </Flex>
    </>
  );
};
