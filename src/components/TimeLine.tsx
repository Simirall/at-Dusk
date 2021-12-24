import { Button } from "@chakra-ui/button";
import { Box, Center } from "@chakra-ui/react";
import { Note as NoteType } from "misskey-js/built/entities";
import React, { useEffect, useRef } from "react";
import { memo } from "react";
import { useInView } from "react-intersection-observer";

import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  allNotes,
  allNoteTypes,
  oldestNoteId,
  moreNote,
  updateMoreNote,
} from "../features/notesSlice";
import { settings } from "../features/settingsSlice";
import { useSocket } from "../utils/SocketContext";
import { useAPIObject } from "../utils/useAPIObject";

import { Loading } from "./Loading";
import { Note } from "./Note";

export const TimeLine: React.VFC = memo(function Fn() {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  const motto = useAppSelector(moreNote);
  const autoMotto = useAppSelector(settings).autoMotto;
  const dontEffect = useRef(true);
  const moreNotesObject = useAPIObject({
    id: "moreNotes",
    type: "api",
    endpoint: "notes/timeline",
    data: {
      limit: 15,
      untilId: useAppSelector(oldestNoteId),
    },
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (autoMotto) {
      if (dontEffect.current) {
        dontEffect.current = false;
      } else if (inView && !motto) {
        dispatch(updateMoreNote(true));
        socket.send(JSON.stringify(moreNotesObject));
      }
    }
  }, [socket, dispatch, moreNotesObject, autoMotto, motto, inView]);
  return (
    <Box maxW="95vw" w="6xl">
      {notes.length ? (
        <>
          {notes.map((note: NoteType, i) => (
            <Box paddingBlock="1" key={note.id}>
              <Note note={note} type={noteTypes[i]} depth={0} />
            </Box>
          ))}
          {autoMotto ? (
            <Center>
              {!motto ? <Box ref={ref} p="9" /> : <Loading small />}
            </Center>
          ) : (
            <Center marginBottom="2">
              <Button
                aria-label="more notes"
                size="lg"
                onClick={() => {
                  dispatch(updateMoreNote(true));
                  socket.send(JSON.stringify(moreNotesObject));
                }}
              >
                {motto ? <Loading small /> : "もっと"}
              </Button>
            </Center>
          )}
        </>
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </Box>
  );
});
