import { IconButton, Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { AddIcon, AtSignIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
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
import { APIObject, useAPIObject } from "../utils/useAPIObject";

import { ParseMFM } from "./ParseMFM";

export const PostModal: React.VFC<{
  isModalOpen: boolean;
  onModalClose: () => void;
}> = ({ isModalOpen, onModalClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userAddDisclosure = useDisclosure();
  const colors = useColors();
  const [visibility, setVisibility] = useState("public");
  const [users, updateUsers] = useState<Array<User>>([]);
  const [resUser, updateResUser] = useState<User>({} as User);
  const [deleteId, setDeleteId] = useState("");
  const userAddObject = useAPIObject({
    id: "userAdd",
    type: "api",
    endpoint: "users/show",
  }) as APIObject;
  const onSubmit = (data: Record<string, unknown>) => console.log(data);
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
      .then((text) => {
        updateResUser(text);
      });
    reset({ username: "", host: "" });
  };

  useEffect(() => {
    if (resUser.id && !users.some((user) => user.id === resUser.id)) {
      updateUsers([...users, resUser]);
    }
  }, [resUser, users]);

  useEffect(() => {
    if (deleteId) {
      updateUsers(users.filter((u) => u.id !== deleteId));
      setDeleteId("");
    }
  }, [deleteId, users]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent bgColor={colors.panelColor}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <Textarea {...register("text")} />
              <Flex flexWrap="wrap" alignItems="center">
                <Menu closeOnSelect={false} isOpen={isOpen} onClose={onClose}>
                  <MenuButton
                    as={Button}
                    aria-label="menu"
                    size="xs"
                    fontWeight="normal"
                    m="1"
                    color={colors.secondaryColor}
                    bgColor={colors.alpha200}
                    _hover={{ bgColor: colors.alpha600 }}
                    _active={{ bgColor: colors.alpha200 }}
                    onClick={onOpen}
                    value={visibility}
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
                          <Checkbox
                            size="lg"
                            {...register("localOnly")}
                            m="0"
                          />
                          <Icon fontSize="1.2em" as={IoFastFood} />
                          <Box>ローカルのみ</Box>
                        </HStack>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </Menu>
                {visibility === "specified" && (
                  <>
                    <IconButton
                      aria-label="add dm user"
                      icon={<AddIcon />}
                      bgColor={colors.primaryColor}
                      _hover={{ bgColor: colors.alpha200 }}
                      _active={{ bgColor: colors.alpha600 }}
                      size="xs"
                      onClick={() => {
                        userAddDisclosure.onOpen();
                      }}
                    />
                  </>
                )}
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" type="submit">
                投稿
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
        <Modal
          isOpen={userAddDisclosure.isOpen}
          onClose={userAddDisclosure.onClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent bgColor={colors.panelColor} pb="10">
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
                      w="4xs"
                      placeholder="ユーザー名"
                      borderColor={colors.alpha200}
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
                      w="4xs"
                      placeholder="ホスト(省略可能)"
                      borderColor={colors.alpha200}
                      pattern="(\S+\.)*\S+\.\S+"
                      {...register("host")}
                    />
                  </InputGroup>
                  <IconButton
                    aria-label="add dm user"
                    icon={<AddIcon />}
                    bgColor={colors.primaryColor}
                    _hover={{ bgColor: colors.alpha200 }}
                    _active={{ bgColor: colors.alpha600 }}
                    size="xs"
                    type="submit"
                  />
                </HStack>
                {users.length > 0 &&
                  users.map((user, i) => (
                    <HStack key={i}>
                      <IconButton
                        aria-label="add dm user"
                        icon={<CloseIcon />}
                        bgColor={colors.primaryColor}
                        _hover={{ bgColor: colors.alpha200 }}
                        _active={{ bgColor: colors.alpha600 }}
                        size="xs"
                        onClick={() => {
                          setDeleteId(user.id);
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
      </Modal>
    </>
  );
};
