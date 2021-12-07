import { Button } from "@chakra-ui/button";
import { Box, HStack, Center } from "@chakra-ui/layout";
import { Note as mkNote, User } from "misskey-js/built/entities";
import React, { useState, useEffect } from "react";
import { IoPin } from "react-icons/io5";
import { useInView } from "react-intersection-observer";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { Note } from "../components/Note";
import { settings } from "../features/settingsSlice";
import {
  changeUserNotesType,
  clearUserNotes,
  initNoteLoaded,
  moreUserNote,
  oldestUserNoteId,
  updateMoreUserNote,
  user,
  userNotes,
  UserShow,
} from "../features/userSlice";
import { useColors } from "../utils/Colors";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

export const UserNotes: React.VFC = () => {
  const socket = useSocket();
  const colors = useColors();
  const props = useStyleProps();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(user);
  const userNotesData = useAppSelector(userNotes);
  const motto = useAppSelector(moreUserNote);
  const initLoaded = useAppSelector(initNoteLoaded);
  const changeType = useAppSelector(changeUserNotesType);
  const autoMotto = useAppSelector(settings).autoMotto;
  const [userNotesType, updateUserNotesType] = useState<
    "note" | "note-reply" | "files"
  >("note");
  const userNotesObject = useAPIObject({
    type: "api",
    id: "userNotes",
    endpoint: "users/notes",
    data: {
      limit: 15,
      userId: userData.id,
      includeReplies: userNotesType === "note" ? false : true,
      withFiles: userNotesType === "files" ? true : false,
    },
  }) as APIObject;
  const userNotesObjectJson = JSON.stringify(userNotesObject);
  const moreUserNotesObject = useAPIObject({
    id: "moreUserNotes",
    type: "api",
    endpoint: "users/notes",
    data: {
      limit: 15,
      userId: userData.id,
      untilId: useAppSelector(oldestUserNoteId),
      includeReplies: userNotesType === "note" ? false : true,
      withFiles: userNotesType === "files" ? true : false,
    },
  }) as APIObject;
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (!initLoaded && userNotesObject.body.data.userId) {
      socket.send(userNotesObjectJson);
    }
    if (changeType) {
      socket.send(userNotesObjectJson);
    }
  }, [
    socket,
    userNotesObjectJson,
    initLoaded,
    changeType,
    userNotesObject.body.data.userId,
  ]);
  useEffect(() => {
    if (autoMotto && inView && initLoaded && !changeType && !motto) {
      dispatch(updateMoreUserNote(true));
      socket.send(JSON.stringify(moreUserNotesObject));
    }
  }, [
    inView,
    autoMotto,
    initLoaded,
    changeType,
    motto,
    socket,
    dispatch,
    moreUserNotesObject,
  ]);
  return (
    <>
      <Box maxW="95vw" w="6xl" color={colors.textColor}>
        {userData.id && (
          <Box>
            {userData.pinnedNoteIds.length > 0 && (
              <PinnedNotes userData={userData} colors={colors} />
            )}
            <HStack justify="space-around" mb="1">
              <Button
                {...(userNotesType === "note"
                  ? { ...props.PrimaryButton }
                  : { ...props.AlphaButton })}
                onClick={() => {
                  if (userNotesType !== "note") {
                    updateUserNotesType("note");
                    dispatch(clearUserNotes());
                  }
                }}
              >
                ノート
              </Button>
              <Button
                {...(userNotesType === "note-reply"
                  ? { ...props.PrimaryButton }
                  : { ...props.AlphaButton })}
                onClick={() => {
                  if (userNotesType !== "note-reply") {
                    updateUserNotesType("note-reply");
                    dispatch(clearUserNotes());
                  }
                }}
              >
                投稿と返信
              </Button>
              <Button
                {...(userNotesType === "files"
                  ? { ...props.PrimaryButton }
                  : { ...props.AlphaButton })}
                onClick={() => {
                  if (userNotesType !== "files") {
                    updateUserNotesType("files");
                    dispatch(clearUserNotes());
                  }
                }}
              >
                ファイル付き
              </Button>
            </HStack>
            <UserNotesData userNotesData={userNotesData} colors={colors} />
            {autoMotto ? (
              <Center>
                {!motto ? <Box p="9" ref={ref} /> : <Loading small />}
              </Center>
            ) : (
              <Center marginBottom="2">
                <Button
                  aria-label="more notes"
                  size="lg"
                  onClick={() => {
                    dispatch(updateMoreUserNote(true));
                    socket.send(JSON.stringify(moreUserNotesObject));
                  }}
                >
                  {motto ? <Loading small /> : "もっと"}
                </Button>
              </Center>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

const PinnedNotes: React.VFC<{
  userData: User & UserShow;
  colors: Record<string, string>;
}> = ({ userData, colors }) => {
  return (
    <Box
      p="2"
      border="1px solid"
      borderColor={colors.secondaryColor}
      borderRadius="md"
      mb="2"
    >
      <HStack spacing="0.5" color={colors.secondaryColor} justify="center">
        <IoPin />
        <Box>ピン留めされたノート</Box>
      </HStack>
      {userData.pinnedNotes.map((note) => (
        <Box paddingBlock="1" key={note.id}>
          <Note
            note={note}
            type={{
              id: note.id,
              type:
                note.renoteId && !note.text
                  ? "renote"
                  : note.replyId
                  ? "reply"
                  : note.renoteId
                  ? "quote"
                  : "note",
            }}
            depth={0}
            colors={colors}
          />
        </Box>
      ))}
    </Box>
  );
};

const UserNotesData: React.VFC<{
  userNotesData: Array<mkNote>;
  colors: Record<string, string>;
}> = ({ userNotesData, colors }) => {
  return (
    <>
      {userNotesData.length > 0 ? (
        userNotesData.map((note) => (
          <Box key={note.id} paddingBlock="1">
            <Note
              note={note}
              type={{
                id: note.id,
                type:
                  note.renoteId && !note.text
                    ? "renote"
                    : note.replyId
                    ? "reply"
                    : note.renoteId
                    ? "quote"
                    : "note",
              }}
              depth={0}
              colors={colors}
            />
          </Box>
        ))
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </>
  );
};
