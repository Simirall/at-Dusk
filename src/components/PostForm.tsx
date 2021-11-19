import { IconButton, Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon, AtSignIcon, CloseIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Box,
  HStack,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { User } from "misskey-js/built/entities";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoFastFood,
  IoGlobe,
  IoHome,
  IoLockClosed,
  IoMail,
} from "react-icons/io5";

import { useColors } from "../utils/Colors";
import { useModalsContext } from "../utils/ModalsContext";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { Note } from "./Note";
import { ParseMFM } from "./ParseMFM";

export const PostForm: React.VFC = () => {
  const socket = useSocket();
  const userAddDisclosure = useDisclosure();
  const colors = useColors();
  const styleProps = useStyleProps();
  const { register, handleSubmit, watch, reset } = useForm();
  const { onPostModalClose, type, modalNoteData, modalNoteType } =
    useModalsContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visibility, setVisibility] = useState("public");
  const [users, updateUsers] = useState<Array<User>>([]);
  const [cw, updateCw] = useState(false);

  useEffect(() => {
    if (modalNoteData.visibility) setVisibility(modalNoteData.visibility);
    else setVisibility("public");
  }, [modalNoteData.visibility]);

  const postObject = useAPIObject({
    id: "post",
    type: "api",
    endpoint: "notes/create",
  }) as APIObject;
  const userAddObject = useAPIObject({
    id: "userAdd",
    type: "api",
    endpoint: "users/show",
  }) as APIObject;
  const onSubmit = (data: Record<string, unknown>) => {
    Object.assign(postObject.body.data, {
      visibility: data.visibility,
      text: data.text ? data.text : null,
      cw: cw ? data.cw : null,
      localOnly: data.localOnly,
      replyId: type === "reply" ? modalNoteData.id : null,
      renoteId: type === "quote" ? modalNoteData.id : null,
    });
    if (data.visibility === "specified") {
      Object.assign(postObject.body.data, {
        visibleUserIds: users.map((user) => user.id),
      });
    }
    onPostModalClose();
    reset();
    socket.send(JSON.stringify(postObject));
  };
  const onSubmitUserAdd = (data: Record<string, unknown>) => {
    Object.assign(userAddObject.body.data, {
      i: localStorage.getItem("UserToken"),
      username: data.username,
      host: data.host ? data.host : null,
    });
    fetch(
      `https://${localStorage.getItem("instanceURL")}/api/${
        userAddObject.body.endpoint
      }`,
      {
        method: "POST",
        body: JSON.stringify(userAddObject.body.data),
      }
    )
      .then((res) => {
        if (!res.ok) {
          // throw new Error(`${res.status} ${res.statusText}`);
          return {} as User;
        }
        return res.json();
      })
      .then((text: User) => {
        if (text.id && !users.some((user) => user.id === text.id)) {
          updateUsers([...users, text]);
        }
      });
    reset({ username: "", host: "" });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {modalNoteData.id && type && (
          <Box
            p="1"
            mb="2"
            borderWidth="2px"
            borderColor={colors.primaryColor}
            borderStyle="dashed"
          >
            <Note
              note={modalNoteData}
              type={modalNoteType}
              depth={1}
              colors={colors}
              onlyBody
            />
          </Box>
        )}
        {cw && (
          <Input
            {...register("cw")}
            placeholder="注釈"
            mb="1"
            borderColor={colors.alpha200}
            _hover={{ borderColor: colors.alpha400 }}
            _focus={{ borderColor: colors.secondaryColor }}
          />
        )}
        <Textarea
          {...register("text")}
          placeholder={
            type === "reply"
              ? "このノートに返信"
              : type === "quote"
              ? "このノートを引用"
              : "何を考えていますか？"
          }
          borderColor={colors.alpha400}
          _hover={{ borderColor: colors.alpha600 }}
          _focus={{ borderColor: colors.secondaryColor }}
          required
          autoFocus
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") handleSubmit(onSubmit)();
          }}
        />
        <Flex flexWrap="wrap" alignItems="center">
          <Menu closeOnSelect={false} isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              aria-label="menu"
              size="xs"
              fontWeight="normal"
              m="1"
              color={colors.secondaryColor}
              onClick={onOpen}
              value={visibility}
              {...styleProps.AlphaButton}
              {...register("visibility")}
            >
              <HStack spacing="0.5">
                {visibility === "public" ? (
                  <>
                    <Icon as={IoGlobe} />
                    <Box>公開</Box>
                  </>
                ) : visibility === "home" ? (
                  <>
                    <Icon as={IoHome} />
                    <Box>ホーム</Box>
                  </>
                ) : visibility === "followers" ? (
                  <>
                    <Icon as={IoLockClosed} />
                    <Box>フォロワー</Box>
                  </>
                ) : (
                  <>
                    <Icon as={IoMail} />
                    <Box>ダイレクト</Box>
                  </>
                )}
              </HStack>
            </MenuButton>
            <MenuList
              bgColor={colors.panelColor}
              color={colors.secondaryColor}
              borderColor={colors.alpha400}
            >
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("public");
                  onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoGlobe} />
                    <Box>公開</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("home");
                  onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoHome} />
                    <Box>ホーム</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("followers");
                  onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoLockClosed} />
                    <Box>フォロワー</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha200 }}
                onClick={() => {
                  setVisibility("specified");
                  onClose();
                }}
              >
                <Box>
                  <HStack spacing="0.5">
                    <Icon fontSize="1.2em" as={IoMail} />
                    <Box>ダイレクト</Box>
                  </HStack>
                </Box>
              </MenuItem>
              <MenuItem
                _focus={{ bgColor: colors.alpha50 }}
                _active={{ bgColor: colors.alpha50 }}
              >
                <Box>
                  <HStack spacing="1">
                    <Checkbox size="lg" {...register("localOnly")} />
                    <Icon fontSize="1.2em" as={IoFastFood} />
                    <Box>ローカルのみ</Box>
                  </HStack>
                </Box>
              </MenuItem>
            </MenuList>
          </Menu>
          {watch("localOnly") && (
            <Icon as={IoFastFood} color={colors.secondaryColor} mr="1" />
          )}
          {visibility === "specified" && (
            <>
              <HStack wrap="wrap" spacing="0.5">
                {users.length > 0 &&
                  users.map((user) => (
                    <Avatar
                      key={user.id}
                      name={user.username}
                      src={user.avatarUrl}
                      size="xs"
                      marginRight="1"
                      bg="none"
                      cursor="pointer"
                      onClick={() => {
                        updateUsers(users.filter((u) => u.id !== user.id));
                      }}
                    />
                  ))}
                <IconButton
                  aria-label="add dm user"
                  icon={<AddIcon />}
                  size="xs"
                  {...styleProps.PrimaryButton}
                  onClick={() => {
                    userAddDisclosure.onOpen();
                  }}
                />
              </HStack>
            </>
          )}
        </Flex>
      </form>
      <HStack justifyContent="end" marginBlock="2">
        <IconButton
          aria-label="content warning"
          icon={<ViewOffIcon />}
          size="sm"
          color={colors.secondaryColor}
          {...styleProps.AlphaButton}
          onClick={() => {
            updateCw(!cw);
          }}
        />
        <Button
          {...styleProps.PrimaryButton}
          fontWeight="md"
          onClick={() => handleSubmit(onSubmit)()}
        >
          ノート
        </Button>
      </HStack>
      <Modal
        isOpen={userAddDisclosure.isOpen}
        onClose={userAddDisclosure.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bgColor={colors.panelColor} pb="5">
          <form onSubmit={handleSubmit(onSubmitUserAdd)}>
            <ModalBody>
              <ModalHeader>
                <Text color={colors.secondaryColor}>ユーザーの追加</Text>
                <ModalCloseButton />
              </ModalHeader>
              <HStack spacing="0.5" mb="1">
                <InputGroup>
                  <InputLeftElement
                    fontSize="xs"
                    h="full"
                    color={colors.textColor}
                  >
                    <AtSignIcon />
                  </InputLeftElement>
                  <Input
                    size="xs"
                    placeholder="ユーザー名"
                    borderColor={colors.alpha200}
                    _hover={{ borderColor: colors.alpha400 }}
                    _focus={{ borderColor: colors.secondaryColor }}
                    required
                    {...register("username")}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLeftElement
                    fontSize="xs"
                    h="full"
                    color={colors.textColor}
                  >
                    <AtSignIcon />
                  </InputLeftElement>
                  <Input
                    size="xs"
                    placeholder="ホスト(省略可能)"
                    borderColor={colors.alpha200}
                    _hover={{ borderColor: colors.alpha400 }}
                    _focus={{ borderColor: colors.secondaryColor }}
                    pattern="(\S+\.)*\S+\.\S+"
                    {...register("host")}
                  />
                </InputGroup>
                <IconButton
                  aria-label="add dm user"
                  type="submit"
                  icon={<AddIcon />}
                  size="xs"
                  {...styleProps.PrimaryButton}
                />
              </HStack>
              {users.length > 0 &&
                users.map((user) => (
                  <HStack key={user.id}>
                    <IconButton
                      aria-label="add dm user"
                      icon={<CloseIcon />}
                      size="xs"
                      {...styleProps.PrimaryButton}
                      onClick={() => {
                        updateUsers(users.filter((u) => u.id !== user.id));
                      }}
                    />
                    <Avatar
                      name={user.username}
                      src={user.avatarUrl}
                      size="xs"
                      marginRight="1"
                      bg="none"
                    />
                    <Box color={colors.secondaryColor} isTruncated>
                      <ParseMFM
                        text={user.name ? user.name : user.username}
                        emojis={user.emojis}
                        type="plain"
                      />
                    </Box>
                  </HStack>
                ))}
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
