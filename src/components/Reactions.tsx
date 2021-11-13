import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import React, { memo } from "react";

import { useAppSelector } from "../app/hooks";
import { allReactions, ReactionDetails } from "../features/notesSlice";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { ParseReaction } from "./ParseReaction";

export const Reactions: React.VFC<{
  id: string;
  colors: Record<string, string>;
}> = memo(function Fn({ id, colors }) {
  const reactions = useAppSelector(allReactions);
  const reaction = reactions.find((reaction) => reaction.id === id);
  return (
    <>
      {reaction?.reactions && Object.keys(reaction?.reactions).length > 0 && (
        <Flex p="1" overflow="hidden" flexWrap="wrap">
          {Object.keys(reaction?.reactions).map((key, i) => {
            return (
              <ReactionButton
                id={id}
                reaction={reaction}
                text={key}
                colors={colors}
                key={i}
              />
            );
          })}
        </Flex>
      )}
    </>
  );
});

const ReactionButton: React.VFC<{
  id: string;
  reaction: ReactionDetails;
  text: string;
  colors: Record<string, string>;
}> = ({ id, reaction, text, colors }) => {
  const socket = useSocket();
  const props =
    text === reaction?.myReaction
      ? {
          bgColor: colors.primaryColor,
          color: colors.headerTextColor,
        }
      : {};
  const reactionCreateObject = useAPIObject({
    id: "reactionCreate",
    type: "api",
    endpoint: "notes/reactions/create",
    data: { noteId: id },
  }) as APIObject;
  const reactionDeleteObject = useAPIObject({
    id: "reactionDelete",
    type: "api",
    endpoint: "notes/reactions/delete",
    data: { noteId: id },
  });
  return (
    <Button
      size="sm"
      m="0.5"
      paddingInline="1.5"
      bgColor={colors.alpha200}
      _hover={{ bgColor: colors.alpha600 }}
      disabled={
        text.includes("@") ? (text.includes("@.") ? false : true) : false
      }
      _disabled={{
        opacity: 0.8,
        bgColor: "#00000000",
        cursor: "not-allowed",
      }}
      {...props}
      onClick={() => {
        console.log(reaction.myReaction !== text);
        if (reaction.myReaction && reaction.myReaction === text) {
          socket.send(JSON.stringify(reactionDeleteObject));
        } else {
          Object.assign(reactionCreateObject.body.data, {
            reaction: text,
          });
          socket.send(JSON.stringify(reactionCreateObject));
        }
      }}
    >
      <Flex alignItems="center">
        <ParseReaction reaction={text} emojis={reaction.emojis} />
        <Box marginLeft="1">{reaction.reactions[text]}</Box>
      </Flex>
    </Button>
  );
};
