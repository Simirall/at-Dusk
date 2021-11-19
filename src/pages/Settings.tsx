import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Icon } from "@chakra-ui/icon";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, HStack, VStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import { Switch } from "@chakra-ui/switch";
import React from "react";
import { useForm } from "react-hook-form";
import { IoColorPalette } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setTheme,
  setMotto,
  setTLPostForm,
  settings,
} from "../features/settingsSlice";
import { useColors } from "../utils/Colors";
import { useLoginContext } from "../utils/LoginContext";

export const Settings: React.VFC = () => {
  const colors = useColors();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();
  const { updateLogin } = useLoginContext();
  const { headerTextColor } = useColors();
  const settingsValue = useAppSelector(settings);

  const onSubmitTheme = (data: { lightTheme: string; darkTheme: string }) => {
    dispatch(setTheme({ theme: data }));
  };
  const onSubmitGenerall = (data: {
    autoMotto: boolean;
    TLPostForm: boolean;
  }) => {
    dispatch(setMotto(data.autoMotto));
    dispatch(setTLPostForm(data.TLPostForm));
  };

  return (
    <>
      <Flex p="2" flexDir="column" color={colors.textColor}>
        <Box m="1">
          <form onSubmit={handleSubmit(onSubmitTheme)}>
            <HStack mb="1">
              <Icon as={IoColorPalette} fontSize="2xl" />
              <Box>テーマ</Box>
            </HStack>
            <HStack color={headerTextColor}>
              <Box>
                <FormLabel color={colors.textColor}>Light Mode</FormLabel>
                <Select
                  {...register("lightTheme")}
                  defaultValue={settingsValue.theme.lightTheme}
                  variant="flushed"
                  color={colors.textColor}
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
            updateLogin(false);
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Flex>
    </>
  );
};
