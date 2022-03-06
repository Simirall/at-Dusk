import { HStack, Link, Text } from "@chakra-ui/react";
import React from "react";
import { memo } from "react";
import { Link as routerLink } from "react-router-dom";

import {
  useGetLogin,
  useSetIsLogin,
  useSetTheme,
} from "../features/recoil/loginState";

export const Auth: React.VFC<{
  children: React.ReactNode;
}> = memo(function Fn({ children }) {
  useSetIsLogin();
  useSetTheme();
  const { login } = useGetLogin();
  return login ? (
    <>{children}</>
  ) : (
    <>
      <HStack justify="center">
        <Text isTruncated mt="4">
          <Link as={routerLink} to="/login" color="blue.300" isTruncated>
            LOGIN
          </Link>
          REQUIRED
        </Text>
      </HStack>
    </>
  );
});
