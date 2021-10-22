import { Box, Center } from "@chakra-ui/layout";
import React, { useEffect } from "react";

import { useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { Note } from "../components/Note";
import { noteDetails, noteDetailsType } from "../features/noteDetailsSlice";
import { useSocket } from "../utils/SocketContext";
import { useAPIObject } from "../utils/useAPIObject";

export const Notes: React.VFC = () => {
  const noteId = document.location.pathname.split("/")[2];
  const socket = useSocket();
  const details = useAppSelector(noteDetails);
  const detailsType = useAppSelector(noteDetailsType);
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
  useEffect(() => {
    socket.send(noteDetailsObject);
  }, [socket, noteDetailsObject]);
  return (
    <Box maxW="95vw" w="6xl">
      {details.id ? (
        <Box marginBlock="2">
          <Note note={details} depth={0} type={detailsType} />
        </Box>
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </Box>
  );
};
