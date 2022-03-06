import { Box, Center, VStack } from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  allNotes,
  allNoteTypes,
  updateMoreNote,
} from "../features/rtk/notesSlice";
import { settings } from "../features/rtk/settingsSlice";
import { useGetMoreNotes } from "../features/swr/useGetMoreNotes";

import { Note } from "./Note";
import { Button } from "./ui/Button";
import { Loading } from "./ui/Loading";

export const TimeLine = memo(function Fn() {
  const notes = useAppSelector(allNotes);
  const noteTypes = useAppSelector(allNoteTypes);
  const { autoMotto } = useAppSelector(settings);
  const [mottoClicked, updateMotto] = useState(false);
  const dispatch = useAppDispatch();
  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  const { isLoading } = useGetMoreNotes(autoMotto && inView, mottoClicked);
  useEffect(() => {
    dispatch(updateMoreNote(inView));
  }, [dispatch, inView]);
  return notes.length ? (
    <VStack alignItems="start" pb="4">
      {notes.map((note, i) => (
        <Box key={note.id} w="full">
          <Note note={note} type={noteTypes[i]} />
        </Box>
      ))}
      <Button
        mode="alpha"
        alignSelf="center"
        ref={ref}
        disabled={isLoading}
        onClick={() => {
          updateMotto(true);
          updateMotto(false);
        }}
      >
        {!isLoading ? "MOTTO" : <Loading small />}
      </Button>
    </VStack>
  ) : (
    <Center>
      <Loading />
    </Center>
  );
});
