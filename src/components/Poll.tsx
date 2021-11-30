import { Button } from "@chakra-ui/button";
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Flex, VStack, Text, HStack } from "@chakra-ui/layout";
import { DateString } from "misskey-js/built/entities";
import React, { memo, useState } from "react";

import { useColors } from "../utils/Colors";
import { useStyleProps } from "../utils/StyleProps";

import { ParseMFM } from "./ParseMFM";

export const Poll: React.VFC<{
  poll: {
    expiresAt: DateString | null;
    multiple: boolean;
    choices: {
      isVoted: boolean;
      text: string;
      votes: number;
    }[];
  };
  id: string;
  emojis: Array<{
    name: string;
    url: string;
  }>;
}> = memo(function Fn({ poll, id, emojis }) {
  console.log(id);
  const colors = useColors();
  const props = useStyleProps();
  const sum = poll.choices.reduce((p, c) => p + c.votes, 0);
  const [voted, updateVoted] = useState(
    poll.choices.some((choice) => choice.isVoted)
  );
  const [showVote, updateShowVote] = useState(voted);
  const expired =
    poll.expiresAt && Date.now() - Date.parse(poll.expiresAt) > 0
      ? true
      : false;
  return (
    <>
      {expired || (voted && !poll.multiple) || showVote ? (
        <>
          <Flex justify="center">
            <VStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
              {poll.choices.map((choice) => (
                <Box key={choice.text} h="1.4em" w="full" pos="relative">
                  <Flex
                    h="full"
                    w="full"
                    borderRadius="md"
                    pos="absolute"
                    overflow="hidden"
                  >
                    <Box
                      bgColor={colors.primaryDarkerColor}
                      flexGrow={choice.votes}
                    ></Box>
                    <Box
                      bgColor={colors.alpha200}
                      flexGrow={sum - choice.votes}
                    ></Box>
                  </Flex>
                  <Flex
                    h="full"
                    pos="absolute"
                    pl="2"
                    overflow="hidden"
                    alignItems="center"
                    color={colors.headerTextColor}
                  >
                    {choice.isVoted && <CheckIcon mr="1" />}
                    <ParseMFM text={choice.text} type="plain" emojis={emojis} />
                    {` (${choice.votes}票)`}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Flex>
          <Flex justify="center" mt="1">
            <HStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
              <Text>{`計${sum}票`}</Text>
              {!expired &&
                (!voted ||
                  (poll.multiple &&
                    poll.choices.some((choice) => !choice.isVoted))) && (
                  <Button
                    {...props.AlphaButton}
                    fontWeight="normal"
                    size="sm"
                    onClick={() => {
                      updateShowVote(!showVote);
                    }}
                  >
                    投票する
                  </Button>
                )}
              {poll.expiresAt && <Text>{getLeftTime(poll.expiresAt)}</Text>}
            </HStack>
          </Flex>
        </>
      ) : (
        <>
          <Flex justify="center">
            <VStack spacing="1" w="min(var(--chakra-sizes-2xl), 100%)">
              {poll.choices.map((choice) => (
                <Button
                  key={choice.text}
                  {...props.AlphaButton}
                  pl="2"
                  h="1.4em"
                  w="full"
                  justifyContent="start"
                  disabled={choice.isVoted}
                  onClick={() => {
                    updateVoted(true);
                  }}
                >
                  {choice.isVoted && <CheckIcon mr="1" />}
                  <ParseMFM text={choice.text} type="plain" emojis={emojis} />
                </Button>
              ))}
            </VStack>
          </Flex>
          <Flex justify="center" mt="1">
            <HStack
              spacing="1"
              w="min(var(--chakra-sizes-2xl), 100%)"
              alignItems="center"
            >
              <Text>{`計${sum}票`}</Text>
              <Button
                {...props.AlphaButton}
                fontWeight="normal"
                size="sm"
                onClick={() => {
                  updateShowVote(!showVote);
                }}
              >
                結果を表示
              </Button>
              {poll.expiresAt && <Text>{getLeftTime(poll.expiresAt)}</Text>}
            </HStack>
          </Flex>
        </>
      )}
    </>
  );
});

function getLeftTime(time: string) {
  const d = Date.parse(time);
  const n = Date.now();
  const t = d - n;
  if (t < 0) {
    return "終了済み";
  } else if (t / (365 * 24 * 60 * 60 * 1000) > 1) {
    return "終了まであと" + (t / (365 * 24 * 60 * 60 * 1000)).toFixed() + "年";
  } else if (t / (24 * 60 * 60 * 1000) > 1) {
    return "終了まであと" + (t / (24 * 60 * 60 * 1000)).toFixed() + "日";
  } else if (t / (60 * 60 * 1000) > 1) {
    return "終了まであと" + (t / (60 * 60 * 1000)).toFixed() + "時間";
  } else if (t / (60 * 1000) > 1) {
    return "終了まであと" + (t / (60 * 1000)).toFixed() + "分";
  } else {
    return "終了まであと" + (t / 1000).toFixed() + "秒";
  }
}
