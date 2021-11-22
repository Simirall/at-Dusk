import { Center } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useLocation } from "react-router";

import { useAppDispatch } from "../app/hooks";
import { Loading } from "../components/Loading";
import { clear } from "../features/noteDetailsSlice";

import { useSocketOpen } from "./SocketContext";

export const CheckLocation: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isSocketOpen } = useSocketOpen();
  useEffect(() => {
    dispatch(clear());
  }, [location.pathname, dispatch]);
  return (
    <>
      {isSocketOpen ? (
        children
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </>
  );
};
