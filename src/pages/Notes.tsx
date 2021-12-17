import { Box, Center } from "@chakra-ui/layout";
import React, { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { Note } from "../components/Note";
import {
  noteDetailConversations,
  noteDetails,
  noteDetailsConversationType,
  noteDetailsType,
  noteDetalisChildren,
  noteDetalisChildrenType,
} from "../features/noteDetailsSlice";
import { useColors } from "../utils/Colors";
import { useSocket } from "../utils/SocketContext";
import { useAPIObject } from "../utils/useAPIObject";

export const Notes: React.VFC = () => {
  const noteId = document.location.pathname.split("/")[2];
  const socket = useSocket();
  const details = useAppSelector(noteDetails);
  const detailsType = useAppSelector(noteDetailsType);
  const conversations = useAppSelector(noteDetailConversations);
  const conversationTypes = useAppSelector(noteDetailsConversationType);
  const children = useAppSelector(noteDetalisChildren);
  const childrenTypes = useAppSelector(noteDetalisChildrenType);
  const colors = useColors();
  const noteDetailsObject = JSON.stringify(
    useAPIObject({
      id: "noteDetails",
      type: "api",
      endpoint: "notes/show",
      data: {
        noteId: noteId,
      },
    })
  );
  const noteConversationObject = JSON.stringify(
    useAPIObject({
      id: "noteConversation",
      type: "api",
      endpoint: "notes/conversation",
      data: {
        noteId: noteId,
      },
    })
  );
  const noteChildrenObject = JSON.stringify(
    useAPIObject({
      id: "noteChildren",
      type: "api",
      endpoint: "notes/children",
      data: {
        noteId: noteId,
        limit: 5,
      },
    })
  );
  useEffect(() => {
    socket.send(noteDetailsObject);
    socket.send(noteConversationObject);
    socket.send(noteChildrenObject);
  }, [socket, noteDetailsObject, noteConversationObject, noteChildrenObject]);
  return (
    <Box maxW="95vw" w="6xl">
      {details.id ? (
        <>
          {conversations.length > 0 &&
            conversations.map((note, i) => (
              <Box
                key={note.id}
                marginBlock="2"
                ml="3"
                pl="3"
                borderLeft="1px solid"
                borderColor={colors.secondaryColor}
              >
                <Note
                  note={note}
                  depth={1}
                  type={conversationTypes[i]}
                  colors={colors}
                  onlyBody
                />
              </Box>
            ))}
          <Box marginBlock="2">
            <Note note={details} depth={0} type={detailsType} colors={colors} />
          </Box>
          {children.length > 0 &&
            children.map((note, i) => (
              <Box
                key={note.id}
                marginBlock="2"
                ml="3"
                pl="3"
                borderLeft="1px solid"
                borderColor={colors.secondaryColor}
              >
                <Note
                  note={note}
                  depth={1}
                  type={childrenTypes[i]}
                  colors={colors}
                  onlyBody
                />
              </Box>
            ))}
        </>
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </Box>
  );
};
