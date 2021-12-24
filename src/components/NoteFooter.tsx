import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, LinkIcon, CopyIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { Note as mkNote, Note } from "misskey-js/built/entities";
import React, { memo } from "react";
import {
  IoAddCircle,
  IoArrowUndo,
  IoBan,
  IoEllipsisHorizontal,
  IoRemoveCircle,
  IoRepeat,
} from "react-icons/io5";

import { useAppSelector } from "../app/hooks";
import { NoteType } from "../features/notesSlice";
import { allReactions } from "../features/reactionsSlice";
import { settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useModalsContext } from "../utils/ModalsContext";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { EmojiForm } from "./EmojiForm";

export const NoteFooter: React.VFC<{
  note: mkNote;
  type: NoteType;
}> = memo(function Fn({ note, type }) {
  const { colors } = useColorContext();
  const socket = useSocket();
  const {
    onPostModalOpen,
    setPostModalType,
    updateModalNoteData,
    updateModalNoteType,
    setEmojiModalType,
  } = useModalsContext();
  const styleProps = useStyleProps();
  const reactions = useAppSelector(allReactions).find(
    (reaction) =>
      reaction.id === (type.type === "renote" ? note.renote?.id : note.id)
  );
  const userInfo = useAppSelector(settings).userInfo;

  const renoteObject = useAPIObject({
    id: "renote",
    type: "api",
    endpoint: "notes/create",
  }) as APIObject;
  const reactionDeleteObject = useAPIObject({
    id: "reactionDelete",
    type: "api",
    endpoint: "notes/reactions/delete",
    data: { noteId: note.id },
  });
  const noteDeleteObject = useAPIObject({
    id: "noteDelete",
    type: "api",
    endpoint: "notes/delete",
    data: { noteId: note.id },
  }) as APIObject;
  return (
    <Flex
      overflow="hidden"
      w="full"
      justifyContent="space-around"
      marginTop="1"
      color={colors.fontColor}
    >
      <Flex alignItems="center">
        <IconButton
          aria-label="reply"
          size="sm"
          icon={<IoArrowUndo />}
          marginRight="0.5"
          {...styleProps.AlphaButton}
          onClick={() => {
            setPostModalType("reply");
            updateModalNoteData(note);
            updateModalNoteType(type);
            onPostModalOpen();
          }}
        />
        {type.type !== "renote" ? note.repliesCount : note.renote?.repliesCount}
      </Flex>
      <Flex alignItems="center">
        <Menu>
          {note.visibility === "followers" ||
          note.visibility === "specified" ? (
            <MenuButton
              as={IconButton}
              aria-label="renote"
              size="sm"
              icon={<IoBan size="1.4em" />}
              marginRight="0.5"
              {...styleProps.DisabledBgColor}
              disabled
            />
          ) : (
            <MenuButton
              as={IconButton}
              aria-label="renote"
              size="sm"
              icon={<IoRepeat size="1.4em" />}
              marginRight="0.5"
              {...styleProps.AlphaButton}
            />
          )}
          <MenuList bgColor={colors.panelColor} borderColor={colors.alpha400}>
            <MenuItem
              _focus={{ bgColor: colors.alpha200 }}
              onClick={() => {
                Object.assign(renoteObject.body.data, {
                  visibility: note.visibility,
                  text: null,
                  renoteId: note.id,
                });
                socket.send(JSON.stringify(renoteObject));
              }}
            >
              Renote
            </MenuItem>
            <MenuItem
              _focus={{ bgColor: colors.alpha200 }}
              onClick={() => {
                setPostModalType("quote");
                updateModalNoteData(note);
                updateModalNoteType(type);
                onPostModalOpen();
              }}
            >
              引用
            </MenuItem>
          </MenuList>
        </Menu>
        {type.type !== "renote" ? note.renoteCount : note.renote?.renoteCount}
      </Flex>
      {reactions?.myReaction ? (
        <IconButton
          aria-label="reaction"
          size="sm"
          icon={<IoRemoveCircle size="1.4em" />}
          color={colors.secondaryColor}
          {...styleProps.AlphaButton}
          onClick={() => {
            socket.send(JSON.stringify(reactionDeleteObject));
          }}
        />
      ) : (
        <Popover isLazy>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  aria-label="reaction"
                  size="sm"
                  icon={<IoAddCircle size="1.4em" />}
                  {...styleProps.AlphaButton}
                  onClick={() => {
                    updateModalNoteData(
                      type.type === "renote" ? (note.renote as Note) : note
                    );
                    setEmojiModalType("reaction");
                  }}
                />
              </PopoverTrigger>
              <PopoverContent
                bgColor={colors.panelColor}
                color={colors.textColor}
                borderColor={colors.alpha400}
                w="md"
                maxW="90vw"
              >
                <PopoverBody>
                  <EmojiForm onClose={onClose} />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      )}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="menu"
          size="sm"
          icon={<IoEllipsisHorizontal size="1.4em" />}
          {...styleProps.AlphaButton}
        />
        <MenuList bgColor={colors.panelColor} borderColor={colors.alpha400}>
          <MenuItem
            _focus={{ bgColor: colors.alpha200 }}
            _active={{ bgColor: colors.alpha400 }}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://${userInfo.instance}/notes/${note.id}`
              );
            }}
          >
            <LinkIcon mr="1" />
            <Box>リンクをコピー</Box>
          </MenuItem>
          <MenuItem
            _focus={{ bgColor: colors.alpha200 }}
            _active={{ bgColor: colors.alpha400 }}
            onClick={() => {
              navigator.clipboard.writeText(note.text ? note.text : "");
            }}
          >
            <CopyIcon mr="1" />
            <Box>内容をコピー</Box>
          </MenuItem>
          {note.user.id === userInfo.userData.id && (
            <MenuItem
              color={colors.secondaryColor}
              _focus={{ bgColor: colors.alpha200 }}
              _active={{ bgColor: colors.alpha400 }}
              onClick={() => {
                socket.send(JSON.stringify(noteDeleteObject));
              }}
            >
              <DeleteIcon mr="1" />
              <Box>ノートを削除</Box>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
});
