import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Box, Flex, HStack } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setTheme, settings } from "../features/settingsSlice";
import { useColors } from "../utils/Colors";
import { useLoginContext } from "../utils/LoginContext";

export const Settings: React.VFC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { updateLogin } = useLoginContext();
  const { theme } = useAppSelector(settings);
  const { register, handleSubmit } = useForm();
  const { headerTextColor } = useColors();

  const onSubmit = (data: { lightTheme: string; darkTheme: string }) => {
    dispatch(setTheme({ theme: data }));
  };

  return (
    <>
      <Flex p="2" flexDir="column">
        <Box m="1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <HStack color={headerTextColor}>
              <Box>
                <FormLabel>Light Mode</FormLabel>
                <Select
                  {...register("lightTheme")}
                  defaultValue={theme.lightTheme}
                  variant="flushed"
                >
                  <option value="illuminating">illuminating</option>
                  <option value="moss">moss gray</option>
                </Select>
              </Box>
              <Box>
                <FormLabel>Dark Mode</FormLabel>
                <Select
                  {...register("darkTheme")}
                  defaultValue={theme.darkTheme}
                  variant="flushed"
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
        <Button
          marginTop="10"
          colorScheme="red"
          size="lg"
          onClick={() => {
            localStorage.clear();
            updateLogin(false);
            history.push("/login");
          }}
        >
          Logout
        </Button>
      </Flex>
    </>
  );
};
