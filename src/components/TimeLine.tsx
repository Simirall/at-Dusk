import { Box, Center, VStack } from "@chakra-ui/react";
import React, { memo } from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes, allNoteTypes } from "../features/rtk/notesSlice";

import { Note } from "./Note";
import { Button } from "./ui/Button";
import { Loading } from "./ui/Loading";

export const TimeLine = memo(function Fn() {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  return notes.length ? (
    <VStack alignItems="start" pb="4">
      {notes.map((note, i) => (
        <Box key={note.id} w="full">
          <Note note={note} type={noteTypes[i]} />
        </Box>
      ))}
      <Button mode="alpha" alignSelf="center">
        MOTTO
      </Button>
    </VStack>
  ) : (
    <Center>
      <Loading />
    </Center>
  );
});
