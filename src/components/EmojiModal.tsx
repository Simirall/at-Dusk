import {
  Box,
  HStack,
  Image,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
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

import { useColors } from "../utils/Colors";
import { useModalsContext } from "../utils/ModalsContext";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
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

export const EmojiModal: React.VFC = () => {
  const socket = useSocket();
  const colors = useColors();
  const styleProps = useStyleProps();
  const { register, watch, handleSubmit, setValue, reset } = useForm();
  const { isEmojiModalOpen, onEmojiModalClose, emojiModalType, modalNoteData } =
    useModalsContext();
  const [selectedEmoji, setEmoji] = useState("");
  const customEmojis: Array<CustomEmoji> = JSON.parse(
    localStorage.getItem("meta") as string
  ).emojis;
  const reactionObject = useAPIObject({
    id: "reaction",
    type: "api",
    endpoint: "notes/reactions/create",
  }) as APIObject;

  useEffect(() => {
    const onSubmit = (data: Record<string, unknown>) => {
      if (emojiModalType === "reaction") {
        Object.assign(reactionObject.body.data, {
          noteId: modalNoteData.id,
          reaction: data.emoji,
        });
        socket.send(JSON.stringify(reactionObject));
      }
      onEmojiModalClose();
      reset();
    };

    if (selectedEmoji) {
      setValue("emoji", selectedEmoji);
      handleSubmit(onSubmit)();
      setEmoji("");
    }
  }, [
    selectedEmoji,
    emojiModalType,
    socket,
    setValue,
    handleSubmit,
    reactionObject,
    modalNoteData,
    onEmojiModalClose,
    reset,
  ]);

  return (
    <>
      <Modal
        isOpen={isEmojiModalOpen}
        onClose={onEmojiModalClose}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={colors.panelColor} color={colors.textColor}>
          <ModalBody p="1">
            <Box h="15em" overflowY="scroll" p="1">
              {watch("searchEmoji") && (
                <HStack spacing="0.5" wrap="wrap" justify="center">
                  {customEmojis
                    .filter(
                      (emoji) =>
                        emoji.name.includes(watch("searchEmoji")) ||
                        emoji.aliases.find((a) =>
                          a.includes(watch("searchEmoji"))
                        )
                    )
                    .slice(0, 24)
                    .map((data) => (
                      <Box key={data.id}>
                        <Button
                          size="sm"
                          p="1"
                          mb="1"
                          {...styleProps.AlphaButton}
                          title={data.name}
                          onClick={() => {
                            setEmoji(`:${data.name}:`);
                            // onEmojiModalClose();
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
                    .filter((emoji) =>
                      emoji.name.includes(watch("searchEmoji"))
                    )
                    .slice(0, 24)
                    .map((data) => (
                      <Box key={data.slug}>
                        <Button
                          size="sm"
                          p="1"
                          mb="1"
                          {...styleProps.AlphaButton}
                          title={data.name}
                          onClick={() => {
                            setEmoji(data.emoji);
                            // onEmojiModalClose();
                          }}
                        >
                          <Twemoji emoji={data.emoji} />
                        </Button>
                      </Box>
                    ))}
                </HStack>
              )}
              <CustomEmojis
                emojis={customEmojis}
                setEmoji={setEmoji}
                colors={colors}
                styleProps={styleProps}
              />
              <Box pb="2" />
              <UnicodeEmojis
                setEmoji={setEmoji}
                colors={colors}
                styleProps={styleProps}
              />
            </Box>
            <Input
              size="sm"
              mt="2"
              placeholder="検索"
              borderColor={colors.alpha200}
              _hover={{ borderColor: colors.alpha400 }}
              _focus={{ borderColor: colors.secondaryColor }}
              onSubmit={(e) => e.preventDefault()}
              {...register("searchEmoji")}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const CustomEmojis: React.VFC<{
  emojis: Array<CustomEmoji>;
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
  colors: Record<string, string>;
  styleProps: Record<string, Record<string, string | Record<string, string>>>;
}> = memo(function Fn({ emojis, setEmoji, colors, styleProps }) {
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
                                size="sm"
                                p="1"
                                mb="1"
                                {...styleProps.AlphaButton}
                                title={data.name}
                                onClick={() => {
                                  setEmoji(`:${data.name}:`);
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
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
  colors: Record<string, string>;
  styleProps: Record<string, Record<string, string | Record<string, string>>>;
}> = memo(function Fn({ setEmoji, colors, styleProps }) {
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
                        styleProps={styleProps}
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
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
  category: EmojiCategory;
  styleProps: Record<string, Record<string, string | Record<string, string>>>;
}> = memo(function Fn({ setEmoji, category, styleProps }) {
  return (
    <>
      {emojis[category as EmojiCategory].map((emoji) => (
        <Box key={emoji.slug}>
          <Button
            size="sm"
            p="1"
            mb="1"
            {...styleProps.AlphaButton}
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
