import { Box, HStack } from "@chakra-ui/react";
import { Note as mkNote } from "misskey-js/built/entities";
import React, { memo } from "react";

import { NoteType } from "../features/rtk/notesSlice";

import { Avatar } from "./Avatar";

export const Note: React.VFC<{ note: mkNote; type: NoteType }> = memo(
  function Fn({ note, type }) {
    return (
      <>
        <HStack w="full" overflow="hidden">
          <Avatar user={note.user} />
          <Box flex="1" color="red.300" isTruncated>
            {note.user.name ? note.user.name : note.user.username}
          </Box>
        </HStack>
      </>
    );
  }
);
