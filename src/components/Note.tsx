import { Box, HStack } from "@chakra-ui/react";
import { Note as mkNote } from "misskey-js/built/entities";
import React, { memo } from "react";

import { NoteType } from "../features/notesSlice";

import { Avatar } from "./Avatar";

export const Note: React.VFC<{ note: mkNote; type: NoteType }> = memo(
  function Fn({ note, type }) {
    return (
      <>
        <HStack>
          <Avatar user={note.user} />
          <Box color="red.300">
            {note.user.name ? note.user.name : note.user.username}
          </Box>
        </HStack>
      </>
    );
  }
);
