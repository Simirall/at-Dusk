import { IconButton } from "@chakra-ui/button";
import { Box, HStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IoCafe, IoFastFood, IoGlobe, IoHome } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { PostForm } from "../components/PostForm";
import { TimeLine } from "../components/TimeLine";
import { clear } from "../features/notesSlice";
import { setTimeline, settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, StreamObject, useAPIObject } from "../utils/useAPIObject";

export const Home: React.VFC = () => {
  const socket = useSocket();
  const settingsValue = useAppSelector(settings);
  const dispatch = useAppDispatch();
  const { colors, props } = useColorContext();
  const disconnectObject = useAPIObject({
    id: "timeline",
    type: "disconnect",
  });
  const connectObject = useAPIObject({
    id: "timeline",
    type: "connect",
  }) as StreamObject;
  const buttonTextProps = (tl: string) =>
    settingsValue.timeline === tl
      ? { color: colors.headerTextColor }
      : { color: colors.textColor };
  const buttonProps = (tl: string) =>
    settingsValue.timeline === tl ? props.PrimaryButton : props.AlphaButton;
  const initNotesObject = useAPIObject({
    id: "initNotes",
    type: "api",
    endpoint: "notes/timeline",
    data: {
      limit: 15,
    },
  }) as APIObject;
  useEffect(() => {
    document.title = "タイムライン | at Dusk.";
  }, []);
  return (
    <Box h="full">
      <HStack bgColor={colors.panelColor} p="1" mt="2" borderRadius="md">
        <HStack>
          <IconButton
            aria-label="home"
            icon={<IoHome />}
            fontSize="1.4em"
            size="sm"
            {...buttonTextProps("homeTimeline")}
            {...buttonProps("homeTimeline")}
            title="ホーム"
            onClick={() => {
              if (settingsValue.timeline !== "homeTimeline") {
                socket.send(JSON.stringify(disconnectObject));
                dispatch(clear());
                dispatch(setTimeline({ timeline: "homeTimeline" }));
                connectObject.body.channel = "homeTimeline";
                socket.send(JSON.stringify(connectObject));
                initNotesObject.body.endpoint = "notes/timeline";
                socket.send(JSON.stringify(initNotesObject));
              }
            }}
          />
          <IconButton
            aria-label="local"
            icon={<IoFastFood />}
            fontSize="1.4em"
            size="sm"
            {...buttonTextProps("localTimeline")}
            {...buttonProps("localTimeline")}
            title="ローカル"
            onClick={() => {
              if (settingsValue.timeline !== "localTimeline") {
                socket.send(JSON.stringify(disconnectObject));
                dispatch(clear());
                dispatch(setTimeline({ timeline: "localTimeline" }));
                connectObject.body.channel = "localTimeline";
                socket.send(JSON.stringify(connectObject));
                initNotesObject.body.endpoint = "notes/local-timeline";
                socket.send(JSON.stringify(initNotesObject));
              }
            }}
          />
          <IconButton
            aria-label="social"
            icon={<IoCafe />}
            fontSize="1.4em"
            size="sm"
            {...buttonTextProps("hybridTimeline")}
            {...buttonProps("hybridTimeline")}
            title="ソーシャル"
            onClick={() => {
              if (settingsValue.timeline !== "hybridTimeline") {
                socket.send(JSON.stringify(disconnectObject));
                dispatch(clear());
                dispatch(setTimeline({ timeline: "hybridTimeline" }));
                connectObject.body.channel = "hybridTimeline";
                socket.send(JSON.stringify(connectObject));
                initNotesObject.body.endpoint = "notes/hybrid-timeline";
                socket.send(JSON.stringify(initNotesObject));
              }
            }}
          />
          <IconButton
            aria-label="global"
            icon={<IoGlobe />}
            fontSize="1.4em"
            size="sm"
            {...buttonTextProps("globalTimeline")}
            {...buttonProps("globalTimeline")}
            title="グローバル"
            onClick={() => {
              if (settingsValue.timeline !== "globalTimeline") {
                socket.send(JSON.stringify(disconnectObject));
                dispatch(clear());
                dispatch(setTimeline({ timeline: "globalTimeline" }));
                connectObject.body.channel = "globalTimeline";
                socket.send(JSON.stringify(connectObject));
                initNotesObject.body.endpoint = "notes/global-timeline";
                socket.send(JSON.stringify(initNotesObject));
              }
            }}
          />
        </HStack>
      </HStack>
      {settingsValue.TLPostForm && (
        <Box
          mt="2"
          mb="1"
          p="2"
          pb="1"
          borderRadius="md"
          bgColor={colors.panelColor}
        >
          <PostForm />
        </Box>
      )}
      <TimeLine />
    </Box>
  );
};
