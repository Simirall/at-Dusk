import { IconButton } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Note as mkNote } from "misskey-js/built/entities";
import React, { memo } from "react";
import {
  IoAddCircle,
  IoArrowUndo,
  IoBan,
  IoEllipsisHorizontal,
  IoRepeat,
} from "react-icons/io5";

import { NoteType } from "../features/notesSlice";

export const NoteFooter: React.VFC<{
  note: mkNote;
  type: NoteType;
  colors: Record<string, string>;
}> = memo(function Fn({ note, type, colors }) {
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
          bgColor={colors.alpha200}
          _hover={{ bgColor: colors.alpha600 }}
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
              bgColor={colors.alpha200}
              _hover={{ bgColor: colors.alpha600 }}
              disabled
            />
          ) : (
            <MenuButton
              as={IconButton}
              aria-label="renote"
              size="sm"
              icon={<IoRepeat size="1.4em" />}
              marginRight="0.5"
              bgColor={colors.alpha200}
              _hover={{ bgColor: colors.alpha600 }}
            />
          )}
          <MenuList bgColor={colors.panelColor}>
            <MenuItem _focus={{ bgColor: colors.alpha200 }}>Renote</MenuItem>
            <MenuItem _focus={{ bgColor: colors.alpha200 }}>引用</MenuItem>
          </MenuList>
        </Menu>
        {type.type !== "renote" ? note.renoteCount : note.renote?.renoteCount}
      </Flex>
      <IconButton
        aria-label="reaction"
        size="sm"
        icon={<IoAddCircle size="1.4em" />}
        bgColor={colors.alpha200}
        _hover={{ bgColor: colors.alpha600 }}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="menu"
          size="sm"
          icon={<IoEllipsisHorizontal size="1.4em" />}
          bgColor={colors.alpha200}
          _hover={{ bgColor: colors.alpha600 }}
        />
        <MenuList bgColor={colors.panelColor}>
          <MenuItem _focus={{ bgColor: colors.alpha200 }}>
            リンクをコピー
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
});
