import { Box, Center } from "@chakra-ui/react";
import { Note as NoteType } from "misskey-js/built/entities";
import React from "react";

import { useAppSelector } from "../app/hooks";
import { allNotes, allNoteTypes } from "../features/notesSlice";
import { useColors } from "../utils/Colors";

import { Loading } from "./Loading";
import { Note } from "./Note";

export const TimeLine: React.VFC = () => {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  const colors = useColors();
  return (
    <Box maxW="95vw" w="6xl">
      <Box></Box>
      {notes.length ? (
        notes.map((note: NoteType, i) => (
          <Box paddingBlock="1" key={note.id}>
            <Note note={note} type={noteTypes[i]} depth={0} colors={colors} />
          </Box>
        ))
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
    </Box>
  );
};
