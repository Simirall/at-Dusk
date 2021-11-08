import { Image } from "@chakra-ui/image";
import { Flex } from "@chakra-ui/layout";
import React, { memo } from "react";

import { ParseMFM } from "./ParseMFM";

export const ParseReaction: React.VFC<{
  reaction: string | null;
  emojis: {
    name: string;
    url: string;
  }[];
}> = memo(function fun({ reaction, emojis }) {
  return (
    <>
      {reaction && (
        <>
          {reaction.includes("@") ? (
            emojis.some((emoji) => `:${emoji.name}:` === reaction) ? (
              <Image
                src={emojis.find(({ name }) => `:${name}:` === reaction)?.url}
                alt={reaction}
                loading="lazy"
                display="inline"
                h="1.4em"
              />
            ) : (
              <>{reaction}</>
            )
          ) : (
            <Flex fontSize="140%" alignItems="center">
              <ParseMFM text={reaction} type="plain" emojis={emojis} />
            </Flex>
          )}
        </>
      )}
    </>
  );
});
