import { Center } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { useLocation, useMatch } from "react-router";

import { useAppDispatch } from "../app/hooks";
import { Loading } from "../components/Loading";
import { clearNoteDetails } from "../features/noteDetailsSlice";
import { clearUserData } from "../features/userSlice";

import { useSocketOpen } from "./SocketContext";

export const CheckLocation: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, updateUsername] = useState("");
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userMatch = useMatch("/user/:id");
  const { isSocketOpen } = useSocketOpen();
  useEffect(() => {
    dispatch(clearNoteDetails());
    if (userMatch) {
      if (userMatch.params.id && userMatch.params.id !== username) {
        updateUsername(userMatch.params.id);
        dispatch(clearUserData());
      }
    } else {
      if (!location.pathname.startsWith("/user")) dispatch(clearUserData());
    }
  }, [location.pathname, dispatch, userMatch, username]);
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
