import { TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Image,
  Button,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { CustomEmoji } from "misskey-js/built/entities";
import React, { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { parse } from "twemoji-parser";
import emojis from "unicode-emoji-json/data-by-group.json";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addRUEmoji, settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useModalsContext } from "../utils/ModalsContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

type EmojiCategory =
  | "Activities"
  | "Animals & Nature"
  | "Flags"
  | "Food & Drink"
  | "Objects"
  | "People & Body"
  | "Smileys & Emotion"
  | "Symbols"
  | "Travel & Places";

export const EmojiForm: React.VFC<{
  onClose: () => void;
  addEmoji?: React.Dispatch<React.SetStateAction<string>>;
}> = memo(function Fn({ onClose, addEmoji }) {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const RUEmoji = useAppSelector(settings).RUEmoji;
  const { colors, props } = useColorContext();
  const { register, watch, handleSubmit, setValue, reset } = useForm();
  const { emojiModalType, modalNoteData } = useModalsContext();
  const [selectedEmoji, setEmoji] = useState<string | CustomEmoji>("");
  const customEmojis = useAppSelector(settings).userInfo.instanceMeta.emojis;
  const reactionObject = useAPIObject({
    id: "reaction",
    type: "api",
    endpoint: "notes/reactions/create",
  }) as APIObject;

  useEffect(() => {
    const onSubmit = (data: Record<string, string>) => {
      if (emojiModalType === "reaction") {
        Object.assign(reactionObject.body.data, {
          noteId: modalNoteData.id,
          reaction: data.emoji,
        });
        socket.send(JSON.stringify(reactionObject));
        onClose();
      } else if (emojiModalType === "picker" && addEmoji) {
        addEmoji(data.emoji);
      }
      reset();
    };

    if (selectedEmoji) {
      if (typeof selectedEmoji === "string") setValue("emoji", selectedEmoji);
      else setValue("emoji", `:${selectedEmoji.name}:`);
      handleSubmit(onSubmit)();
      dispatch(addRUEmoji(selectedEmoji));
      setEmoji("");
    }
  }, [selectedEmoji, emojiModalType, socket, setValue, dispatch, handleSubmit, reactionObject, modalNoteData, addEmoji, reset, onClose]);

  return (
    <>
      <Box h="10em" overflowY="scroll" p="1">
        <Input
          size="sm"
          mb="2"
          placeholder="検索"
          borderColor={colors.alpha200}
          _hover={{ borderColor: colors.alpha400 }}
          _focus={{ borderColor: colors.secondaryColor }}
          onSubmit={(e) => e.preventDefault()}
          {...register("searchEmoji")}
        />
        {watch("searchEmoji") && (
          <HStack spacing="0.5" wrap="wrap" justify="center">
            {customEmojis
              .filter(
                (emoji) =>
                  emoji.name.includes(watch("searchEmoji")) ||
                  emoji.aliases.find((a) => a.includes(watch("searchEmoji")))
              )
              .slice(0, 24)
              .map((data) => (
                <Box key={data.id}>
                  <Button
                    p="1"
                    mb="1"
                    {...props.AlphaButton}
                    title={data.name}
                    onClick={() => {
                      setEmoji(data);
                    }}
                  >
                    <Image
                      src={data.url}
                      alt={data.name}
                      loading="lazy"
                      maxH="1.6em"
                    />
                  </Button>
                </Box>
              ))}
            {Object.values(emojis)
              .flat()
              .filter((emoji) => emoji.name.includes(watch("searchEmoji")))
              .slice(0, 24)
              .map((data) => (
                <Box key={data.slug}>
                  <Button
                    p="1"
                    mb="1"
                    {...props.AlphaButton}
                    title={data.name}
                    onClick={() => {
                      setEmoji(data.emoji);
                    }}
                  >
                    <Twemoji emoji={data.emoji} />
                  </Button>
                </Box>
              ))}
          </HStack>
        )}
        {RUEmoji.length > 0 && (
          <Box>
            <HStack spacing="0.5">
              <TimeIcon />
              <Box>最近使用</Box>
            </HStack>
            <HStack spacing="0.5" wrap="wrap" justify="center">
              {RUEmoji.map((emoji) => (
                <Box key={typeof emoji === "string" ? emoji : emoji.name}>
                  {typeof emoji === "string" ? (
                    <Button
                      p="1"
                      mb="1"
                      {...props.AlphaButton}
                      onClick={() => {
                        setEmoji(emoji);
                      }}
                    >
                      <Twemoji emoji={emoji} />
                    </Button>
                  ) : (
                    <Button
                      p="1"
                      mb="1"
                      {...props.AlphaButton}
                      title={emoji.name}
                      onClick={() => {
                        setEmoji(emoji);
                      }}
                    >
                      <Image
                        src={emoji.url}
                        alt={emoji.name}
                        loading="lazy"
                        maxH="1.6em"
                      />
                    </Button>
                  )}
                </Box>
              ))}
            </HStack>
          </Box>
        )}
        <CustomEmojis emojis={customEmojis} setEmoji={setEmoji} />
        <Box pb="2" />
        <UnicodeEmojis setEmoji={setEmoji} />
      </Box>
    </>
  );
});

const CustomEmojis: React.VFC<{
  emojis: Array<CustomEmoji>;
  setEmoji: React.Dispatch<React.SetStateAction<string | CustomEmoji>>;
}> = memo(function Fn({ emojis, setEmoji }) {
  const { colors, props } = useColorContext();
  const emojiCategory = [...new Set(emojis.map((item) => item.category))];
  return (
    <>
      <Accordion allowMultiple reduceMotion>
        {emojiCategory.map((category, i) => (
          <AccordionItem key={i} marginInline="1" borderColor={colors.alpha400}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <AccordionIcon />
                  {category ? category : "other"}
                </AccordionButton>
                <AccordionPanel p="0">
                  <HStack spacing="0.5" wrap="wrap" justify="center">
                    {isExpanded && (
                      <>
                        {emojis
                          .filter((emoji) => emoji.category === category)
                          .map((data) => (
                            <Box key={data.id}>
                              <Button
                                p="1"
                                mb="1"
                                {...props.AlphaButton}
                                title={data.name}
                                onClick={() => {
                                  setEmoji(data);
                                }}
                              >
                                <Image
                                  src={data.url}
                                  alt={data.name}
                                  loading="lazy"
                                  maxH="1.6em"
                                />
                              </Button>
                            </Box>
                          ))}
                      </>
                    )}
                  </HStack>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
});

const UnicodeEmojis: React.VFC<{
  setEmoji: React.Dispatch<React.SetStateAction<string | CustomEmoji>>;
}> = memo(function Fn({ setEmoji }) {
  const { colors } = useColorContext();
  return (
    <>
      <Accordion allowMultiple reduceMotion>
        {Object.keys(emojis).map((category, i) => (
          <AccordionItem key={i} marginInline="1" borderColor={colors.alpha400}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  {category}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel p="0">
                  <HStack spacing="0.5" wrap="wrap" justify="center">
                    {isExpanded && (
                      <EmojiList
                        setEmoji={setEmoji}
                        category={category as EmojiCategory}
                      />
                    )}
                  </HStack>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
});

const EmojiList: React.VFC<{
  setEmoji: React.Dispatch<React.SetStateAction<string | CustomEmoji>>;
  category: EmojiCategory;
}> = memo(function Fn({ setEmoji, category }) {
  const { props } = useColorContext();
  return (
    <>
      {emojis[category as EmojiCategory].map((emoji) => (
        <Box key={emoji.slug}>
          <Button
            p="1"
            mb="1"
            {...props.AlphaButton}
            title={emoji.name}
            onClick={() => {
              setEmoji(emoji.emoji);
            }}
          >
            <Twemoji emoji={emoji.emoji} />
          </Button>
        </Box>
      ))}
    </>
  );
});

const Twemoji: React.VFC<{ emoji: string }> = memo(function Fn({ emoji }) {
  const twemoji = parse(emoji);
  return (
    <Image
      src={twemoji[0].url}
      alt={twemoji[0].text}
      loading="lazy"
      display="inline"
      h="1.6em"
      verticalAlign="middle"
    />
  );
});
