import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Icon } from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { Box, Flex, HStack, Link, Text } from "@chakra-ui/layout";
import { Note as mkNote } from "misskey-js/built/entities";
import React from "react";
import {
  IoArrowUndo,
  IoFastFood,
  IoHome,
  IoLockClosed,
  IoMail,
} from "react-icons/io5";
import { Link as RouterLink } from "react-router-dom";

import { NoteType } from "../features/notesSlice";
import { getRelativeTime } from "../utils/getRelativeTime";

import { Files } from "./Files";
import { ParseMFM } from "./ParseMFM";

export const Note: React.VFC<{
  note: mkNote;
  type: NoteType;
  depth: number;
}> = ({ note, type, depth }) => {
  const name = note.user.name ? note.user.name : note.user.username;
  const [cw, updateCw] = React.useState(note.cw ? true : false);
  return (
    <>
      <Box
        p="2"
        borderRadius="lg"
        overflow="hidden"
        bgColor={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
      >
        {type.type === "note" && (
          <GeneralNote
            note={note}
            name={name}
            depth={depth}
            cw={cw}
            updateCw={updateCw}
          />
        )}
        {type.type === "reply" && (
          <Reply note={note} name={name} cw={cw} updateCw={updateCw} />
        )}
        {type.type === "renote" && (
          <Renote note={note} name={name} cw={cw} updateCw={updateCw} />
        )}
        {type.type === "quote" && (
          <Quote
            note={note}
            name={name}
            depth={depth}
            cw={cw}
            updateCw={updateCw}
          />
        )}
      </Box>
    </>
  );
};

const GeneralNote: React.VFC<{
  note: mkNote;
  name: string;
  depth: number;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ note, name, depth, cw, updateCw }) => {
  const AccordionButtonColor = useColorModeValue("gray.300", "gray.700");
  return (
    <>
      <Flex>
        <Link
          as={RouterLink}
          to={`/user/@${note.user.username}${
            note.user.host ? `@${note.user.host}` : ""
          }`}
        >
          <Avatar
            name={note.user.username}
            src={note.user.avatarUrl}
            marginRight="2"
            bg="none"
          />
        </Link>
        <Box overflow="hidden" flex="1">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" overflow="hidden">
              <Link
                as={RouterLink}
                to={`/user/@${note.user.username}${
                  note.user.host ? `@${note.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM text={name} emojis={note.user.emojis} type="plain" />
              </Link>
              <Text color="gray.400" isTruncated>{`@${note.user.username}${
                note.user.host ? `@${note.user.host}` : ""
              }`}</Text>
            </Flex>
            <HStack flexShrink={0} spacing="1">
              <Link as={RouterLink} to={`/notes/${note.id}`} color="gray.400">
                {getRelativeTime(note.createdAt)}
              </Link>
              <Visibility
                visibility={note.visibility}
                local={note.localOnly}
                renote={false}
              />
            </HStack>
          </Flex>
          {note.user.host && depth === 0 && (
            <Flex
              bgGradient={`linear(to-r, ${note.user.instance?.themeColor}, #00000000)`}
              paddingLeft="1"
              borderRadius="md"
              alignItems="center"
            >
              <Image
                src={note.user.instance?.faviconUrl as string}
                h="5"
                marginRight="1"
              />
              <Text color="white">{note.user.instance?.name}</Text>
            </Flex>
          )}
          <Box>
            {note.cw || note.cw === "" ? (
              <>
                <HStack>
                  {note.replyId && <Icon as={IoArrowUndo} />}
                  <Box>
                    <Text
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      display="inline"
                    >
                      <ParseMFM
                        text={note.cw}
                        emojis={note.emojis}
                        type="full"
                      />
                    </Text>
                    <Button
                      marginLeft="1"
                      size="xs"
                      onClick={() => {
                        updateCw(!cw);
                      }}
                    >
                      {!cw ? "隠す" : `もっと見る (${note.text?.length}文字)`}
                    </Button>
                  </Box>
                </HStack>
                {!cw && (
                  <Box paddingInline="1" w="full">
                    <Box whiteSpace="pre-wrap" wordBreak="break-word" w="full">
                      <ParseMFM
                        text={note.text}
                        emojis={note.emojis}
                        type="full"
                      />
                    </Box>
                    {note.renoteId && note.renote?.text && (
                      <Text marginLeft="1" color="green.400" display="inline">
                        <i>RN:</i>
                      </Text>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <HStack>
                {note.replyId && <Icon as={IoArrowUndo} />}
                <Box paddingInline="1" w="full">
                  <Box whiteSpace="pre-wrap" wordBreak="break-word" w="full">
                    <ParseMFM
                      text={note.text}
                      emojis={note.emojis}
                      type="full"
                    />
                  </Box>
                  {note.renoteId && note.renote?.text && (
                    <Text marginLeft="1" color="green.400" display="inline">
                      <i>RN:</i>
                    </Text>
                  )}
                </Box>
              </HStack>
            )}
          </Box>
        </Box>
      </Flex>
      {!cw && note.files.length > 0 && (
        <>
          {depth === 0 ? (
            <Files files={note.files} />
          ) : (
            <Accordion allowToggle m="1">
              <AccordionItem border="none">
                <AccordionButton w="fit-content" bgColor={AccordionButtonColor}>
                  <AccordionIcon />
                  {`${note.files.length}個のファイル`}
                </AccordionButton>
                <AccordionPanel>
                  <Files files={note.files} />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </>
      )}
    </>
  );
};

const Reply: React.VFC<{
  note: mkNote;
  name: string;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ note, name, cw, updateCw }) => {
  const col = useColorModeValue("whiteAlpha.600", "blackAlpha.300");
  return (
    <Box>
      <Box
        backgroundColor={col}
        borderRadius="lg"
        marginBottom="2"
        opacity="0.6"
      >
        <Note
          note={note.reply as mkNote}
          type={{
            id: note.id,
            type: note.renoteId ? "quote" : "note",
          }}
          depth={1}
        />
      </Box>
      {note.renoteId ? (
        <Box overflow="hidden">
          <Quote
            note={note}
            name={name}
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      ) : (
        <Box overflow="hidden">
          <GeneralNote
            note={note}
            name={name}
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      )}
    </Box>
  );
};

const Renote: React.VFC<{
  note: mkNote;
  name: string;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ note, name, cw, updateCw }) => {
  return (
    <Box>
      {note.renote?.replyId && (
        <Box marginBottom="1" opacity="0.7">
          {note.renote?.renoteId ? (
            <Box overflow="hidden">
              <Quote
                note={note.renote.reply as mkNote}
                name={
                  note.renote?.reply?.user.name
                    ? note.renote.reply.user.name
                    : (note.renote?.reply?.user.username as string)
                }
                depth={1}
                cw={cw}
                updateCw={updateCw}
              />
            </Box>
          ) : (
            <Box overflow="hidden">
              <GeneralNote
                note={note.renote.reply as mkNote}
                name={
                  note.renote?.reply?.user.name
                    ? note.renote.reply.user.name
                    : (note.renote?.reply?.user.username as string)
                }
                depth={1}
                cw={cw}
                updateCw={updateCw}
              />
            </Box>
          )}
        </Box>
      )}
      <Flex alignItems="center" justifyContent="space-between" marginBottom="2">
        <Flex overflow="hidden">
          <Avatar
            name={note.user.username}
            src={note.user.avatarUrl}
            size="xs"
            marginRight="1"
            bg="none"
          />
          <Box color="green.400" isTruncated>
            <Link
              as={RouterLink}
              to={`/user/@${note.user.username}${
                note.user.host ? `@${note.user.host}` : ""
              }`}
            >
              <ParseMFM text={name} emojis={note.user.emojis} type="plain" />
            </Link>
            がRenote
          </Box>
        </Flex>
        <HStack spacing="1" flexShrink={0}>
          <Link as={RouterLink} to={`/notes/${note.id}`} color="green.400">
            {getRelativeTime(note.createdAt)}
          </Link>
          <Box color="green.400">
            <Visibility
              visibility={note.visibility}
              local={note.localOnly}
              renote={true}
            />
          </Box>
        </HStack>
      </Flex>
      {note.renote?.renoteId ? (
        <Box overflow="hidden">
          <Quote
            note={note.renote as mkNote}
            name={
              note.renote?.user.name
                ? note.renote.user.name
                : (note.renote?.user.username as string)
            }
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      ) : (
        <Box overflow="hidden">
          <GeneralNote
            note={note.renote as mkNote}
            name={
              note.renote?.user.name
                ? note.renote.user.name
                : (note.renote?.user.username as string)
            }
            depth={0}
            cw={cw}
            updateCw={updateCw}
          />
        </Box>
      )}
    </Box>
  );
};

const Quote: React.VFC<{
  note: mkNote;
  name: string;
  depth: number;
  cw: boolean;
  updateCw: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ note, name, depth, cw, updateCw }) => {
  const col = useColorModeValue("whiteAlpha.600", "blackAlpha.300");
  return (
    <Box>
      <GeneralNote
        note={note}
        name={name}
        depth={0}
        cw={cw}
        updateCw={updateCw}
      />
      {!((note.cw || note.cw === "") && cw) && depth === 0 && (
        <Box
          marginTop="1"
          backgroundColor={col}
          borderRadius="lg"
          border="1.5px dashed"
          borderColor="teal.600"
        >
          <Note
            note={note.renote as mkNote}
            type={{
              id: note.renoteId,
              type: !note.renote?.renoteId ? "note" : "quote",
            }}
            depth={1}
          />
        </Box>
      )}
    </Box>
  );
};

const Visibility: React.VFC<{
  visibility: "public" | "home" | "followers" | "specified";
  local: boolean | undefined;
  renote: boolean;
}> = ({ visibility, local, renote }) => {
  let v = null;
  switch (visibility) {
    case "home":
      v = <Icon as={IoHome} color={renote ? "green.400" : "gray.400"} />;
      break;
    case "followers":
      v = <Icon as={IoLockClosed} color={renote ? "green.400" : "gray.400"} />;
      break;
    case "specified":
      v = <Icon as={IoMail} color={renote ? "green.400" : "gray.400"} />;
      break;
    default:
      break;
  }
  return (
    <HStack spacing="1">
      {local && (
        <Icon as={IoFastFood} color={renote ? "green.400" : "gray.400"} />
      )}
      {v}
    </HStack>
  );
};
