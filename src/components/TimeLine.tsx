import { Box } from "@chakra-ui/react";
import React, { memo } from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes, allNoteTypes } from "../features/notesSlice";

import { Note } from "./Note";

export const TimeLine = memo(function Fn() {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  return (
    <>
      {notes.map((note, i) => (
        <Box key={note.id}>
          <Note note={note} type={noteTypes[i]} />
        </Box>
      ))}
    </>
  );
});
