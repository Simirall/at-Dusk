import { Box, VStack } from "@chakra-ui/react";
import React, { memo } from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes, allNoteTypes } from "../features/notesSlice";

import { Note } from "./Note";

export const TimeLine = memo(function Fn() {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  return (
    <>
      <VStack alignItems="start">
        {notes.map((note, i) => (
          <Box key={note.id} w="full">
            <Note note={note} type={noteTypes[i]} />
          </Box>
        ))}
      </VStack>
    </>
  );
});
