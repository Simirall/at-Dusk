import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import React, { memo } from "react";

import { useAppSelector } from "../app/hooks";
import { allReactions } from "../features/notesSlice";

import { ParseReaction } from "./ParseReaction";

export const Reactions: React.VFC<{ id: string }> = memo(function Fn({ id }) {
  const reactions = useAppSelector(allReactions);
  const reaction = reactions.find((reaction) => reaction.id === id);
  return (
    <>
      {reaction?.reactions && Object.keys(reaction?.reactions).length > 0 && (
        <Flex p="1" overflow="hidden" flexWrap="wrap">
          {Object.keys(reaction?.reactions).map((key, i) => (
            <Button key={i} size="sm" marginInline="0.5" paddingInline="1.5">
              <Flex alignItems="center">
                <ParseReaction reaction={key} emojis={reaction.emojis} />
                <Box marginLeft="1">{reaction.reactions[key]}</Box>
              </Flex>
            </Button>
          ))}
        </Flex>
      )}
    </>
  );
});
