import { Box, Text } from "@chakra-ui/react";
import { Note as NoteType } from "misskey-js/built/entities";
import React from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes, allNoteTypes } from "../features/notesSlice";

import { Note } from "./Note";

export const TimeLine: React.VFC = () => {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  return (
    <Box maxW="95vw" w="6xl">
      <Box>
        <Text textAlign="center" fontSize="2xl" color="teal">
          Home
        </Text>
      </Box>
      {notes &&
        notes.map((note: NoteType, i) => (
          <Box paddingBlock="1" key={note.id}>
            <Note note={note} type={noteTypes[i]} depth={0} />
          </Box>
        ))}
    </Box>
  );
};
