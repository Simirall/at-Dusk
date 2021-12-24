import { Avatar, AvatarBadge } from "@chakra-ui/avatar";
import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import Icon from "@chakra-ui/icon";
import { ExternalLinkIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Box, Heading, HStack, Text, Divider, VStack } from "@chakra-ui/layout";
import {
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Badge,
} from "@chakra-ui/react";
import { User as mkUser } from "misskey-js/built/entities";
import { memo, useEffect } from "react";
import React, { useState } from "react";
import {
  IoBan,
  IoBookmark,
  IoBookmarkOutline,
  IoCalendar,
  IoCut,
  IoEllipsisHorizontal,
  IoEyeOff,
  IoFlame,
  IoLocation,
} from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";

import { useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { ParseMFM } from "../components/ParseMFM";
import { settings } from "../features/settingsSlice";
import { followers, followings, user, UserShow } from "../features/userSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

export const User: React.VFC = memo(function Fn() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { colors, props } = useColorContext();
  const location = useLocation();
  const me = useAppSelector(settings).userInfo.userData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [banner404, setBanner404] = useState(false);
  const [userBody, updateUserBody] = useState<
    "note" | "following" | "followers"
  >(
    location.pathname.includes("following")
      ? "following"
      : location.pathname.includes("followers")
      ? "followers"
      : "note"
  );
  const userName = document.location.pathname.split("@")[1].split("/")[0];
  const userHost = document.location.pathname.split("@")[2]
    ? document.location.pathname.split("@")[2].split("/")[0]
    : null;
  const userData = useAppSelector(user);
  const followingObject = useAPIObject({
    id: "",
    type: "api",
    endpoint: "",
  }) as APIObject;
  useGetUserData(socket, userData, userName, userHost);
  useEffect(() => {
    updateUserBody(
      location.pathname.includes("following")
        ? "following"
        : location.pathname.includes("followers")
        ? "followers"
        : "note"
    );
  }, [location.pathname]);
  useEffect(() => {
    if (userData.id) {
      document.title =
        (userData.name ? userData.name : userData.username) + " | at Dusk.";
    } else {
      document.title = "Loading... | at Dusk.";
    }
  }, [userData]);
  return (
    <>
      {userData.id ? (
        <>
          <Box maxW="95vw" w="6xl" color={colors.textColor}>
            <Box w="full" marginBlock="2" fontSize="1.1em">
              <Box
                w="full"
                borderRadius="lg"
                overflow="hidden"
                bgColor={colors.panelColor}
                shadow="md"
              >
                <Box w="full" h="2xs" position="relative">
                  {!banner404 && userData.bannerUrl ? (
                    <Image
                      src={userData.bannerUrl}
                      w="full"
                      h="full"
                      objectFit="cover"
                      loading="lazy"
                      onError={() => {
                        setBanner404(true);
                      }}
                    />
                  ) : (
                    <Box
                      w="full"
                      h="full"
                      bgGradient={`linear(to-b, ${colors.secondaryColor}, #00000000)`}
                    />
                  )}
                  {(userData.isMuted || userData.isFollowed) && (
                    <VStack
                      position="absolute"
                      zIndex="2"
                      top="0"
                      left="0"
                      spacing="0.5"
                      m="1"
                    >
                      {userData.isFollowed && (
                        <Box
                          p="0.5"
                          fontSize="0.8em"
                          borderRadius="md"
                          color={colors.headerTextColor}
                          bgColor={colors.primaryDarkerColor}
                        >
                          フォローされています
                        </Box>
                      )}
                      {userData.isMuted && (
                        <Box
                          p="0.5"
                          fontSize="0.8em"
                          borderRadius="md"
                          color={colors.headerTextColor}
                          bgColor={colors.primaryDarkerColor}
                        >
                          ミュートしています
                        </Box>
                      )}
                    </VStack>
                  )}
                  <HStack
                    position="absolute"
                    zIndex="2"
                    top="0"
                    right="0"
                    p="2"
                  >
                    <Box>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="user menu"
                          icon={<IoEllipsisHorizontal />}
                          {...props.AlphaButton}
                        />
                        <MenuList
                          bgColor={colors.panelColor}
                          borderColor={colors.alpha400}
                        >
                          {userData.url && (
                            <MenuItem
                              _focus={{ bgColor: colors.alpha200 }}
                              color="blue.500"
                              onClick={() => {
                                window.open(
                                  userData.url as string,
                                  "_blank",
                                  "noreferrer"
                                );
                              }}
                            >
                              <ExternalLinkIcon />
                              リモートで表示
                            </MenuItem>
                          )}
                          {userData.isFollowed && (
                            <MenuItem
                              _focus={{ bgColor: colors.alpha200 }}
                              color="blue.500"
                              onClick={() => {
                                followingObject.body.id = "invalidate";
                                followingObject.body.endpoint =
                                  "following/invalidate";
                                followingObject.body.data.userId = userData.id;
                                socket.send(JSON.stringify(followingObject));
                              }}
                            >
                              <IoCut />
                              フォロワーを解除
                            </MenuItem>
                          )}
                          <MenuItem
                            _focus={{ bgColor: colors.alpha200 }}
                            color="orange"
                            onClick={() => {
                              followingObject.body.id = userData.isMuted
                                ? "unmute"
                                : "mute";
                              followingObject.body.endpoint = userData.isMuted
                                ? "mute/delete"
                                : "mute/create";
                              followingObject.body.data.userId = userData.id;
                              socket.send(JSON.stringify(followingObject));
                            }}
                          >
                            <IoEyeOff />
                            ミュート{userData.isMuted && "解除"}
                          </MenuItem>
                          {!userData.isBlocking && (
                            <MenuItem
                              _focus={{ bgColor: colors.alpha200 }}
                              color="red"
                              onClick={onOpen}
                            >
                              <IoBan />
                              ブロック
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    </Box>
                    {userData.isBlocking ? (
                      <Button colorScheme="red" onClick={onOpen}>
                        ブロック中
                      </Button>
                    ) : userData.isFollowing ? (
                      <Button
                        {...props.PrimaryButton}
                        onClick={() => {
                          followingObject.body.id = "unfollow";
                          followingObject.body.endpoint = "following/delete";
                          followingObject.body.data.userId = userData.id;
                          socket.send(JSON.stringify(followingObject));
                        }}
                      >
                        フォロー中
                      </Button>
                    ) : (
                      !userData.isBlocked &&
                      userData.id !== me.id && (
                        <Button
                          {...props.AlphaButton}
                          onClick={() => {
                            followingObject.body.id = "follow";
                            followingObject.body.endpoint = "following/create";
                            followingObject.body.data.userId = userData.id;
                            socket.send(JSON.stringify(followingObject));
                          }}
                        >
                          フォロー
                        </Button>
                      )
                    )}
                  </HStack>
                </Box>
                <HStack
                  paddingInline="4"
                  transform="translateY(-1.6em)"
                  mb="-1.6em"
                  w="full"
                >
                  <Avatar
                    src={userData.avatarUrl}
                    size="2xl"
                    transform="translateY(-0.4em)"
                    shadow="md"
                  >
                    <AvatarBadge
                      bgColor={
                        userData.onlineStatus === "online"
                          ? "cyan.400"
                          : userData.onlineStatus === "active"
                          ? "orange.300"
                          : userData.onlineStatus === "offline"
                          ? "red.500"
                          : "gray.400"
                      }
                      borderColor={
                        userData.onlineStatus === "online"
                          ? "teal.100"
                          : userData.onlineStatus === "active"
                          ? "orange.100"
                          : userData.onlineStatus === "offline"
                          ? "red.100"
                          : "gray.100"
                      }
                      boxSize="0.6em"
                      borderWidth="4px"
                      transform="translateY(-0.2em)"
                      title={`status: ${userData.onlineStatus}`}
                      shadow="md"
                    />
                  </Avatar>
                  <Box w="full" overflow="hidden">
                    <Heading isTruncated>
                      {userData.name ? (
                        <ParseMFM
                          type="plain"
                          text={userData.name}
                          emojis={userData.emojis}
                        />
                      ) : (
                        userData.username
                      )}
                    </Heading>
                    <HStack spacing="0.5">
                      <Text color="gray.400" isTruncated>
                        {`@${userData.username}${
                          userData.host ? `@${userData.host}` : ""
                        }`}
                      </Text>
                      {userData.isAdmin ? (
                        <Icon
                          as={IoBookmark}
                          color={colors.primaryColor}
                          fontSize="1.2em"
                        />
                      ) : userData.isModerator ? (
                        <Icon
                          as={IoBookmarkOutline}
                          color={colors.primaryColor}
                          fontSize="1.2em"
                        />
                      ) : userData.isBot ? (
                        <Badge colorScheme="teal">Bot</Badge>
                      ) : (
                        ""
                      )}
                    </HStack>
                  </Box>
                </HStack>
                <Box whiteSpace="pre-wrap" paddingInline="10%">
                  <ParseMFM
                    type="full"
                    text={userData.description}
                    emojis={userData.emojis}
                  />
                </Box>
                <Box paddingInline="10%" mb="2">
                  <Divider marginBlock="2" />
                  {userData.location && (
                    <HStack spacing="0.5" overflow="hidden">
                      <HStack spacing="0.5" w="30%">
                        <IoLocation />
                        <Box>場所</Box>
                      </HStack>
                      <Box isTruncated>
                        <ParseMFM
                          type="full"
                          text={userData.location}
                          emojis={userData.emojis}
                        />
                      </Box>
                    </HStack>
                  )}
                  {userData.birthday && (
                    <HStack spacing="0.5">
                      <HStack spacing="0.5" w="30%">
                        <IoFlame />
                        <Box>誕生日</Box>
                      </HStack>
                      <Box>{getDate(userData.birthday)}</Box>
                    </HStack>
                  )}
                  <HStack spacing="0.5">
                    <HStack spacing="0.5" w="30%">
                      <IoCalendar />
                      <Box>登録日</Box>
                    </HStack>
                    <Box>{getDate(userData.createdAt)}</Box>
                  </HStack>
                </Box>
                {userData.fields.length > 0 && (
                  <Box paddingInline="10%" mb="2">
                    <Divider marginBlock="2" />
                    {userData.fields.map((field, i) => (
                      <HStack key={i} w="full" overflow="hidden">
                        <Box isTruncated w="30%">
                          <ParseMFM
                            type="full"
                            text={field.name}
                            emojis={userData.emojis}
                          />
                        </Box>
                        <Box isTruncated w="70%">
                          <ParseMFM
                            type="full"
                            text={field.value}
                            emojis={userData.emojis}
                          />
                        </Box>
                      </HStack>
                    ))}
                  </Box>
                )}
                <HStack justifyContent="space-around" paddingInline="5" mb="2">
                  <VStack
                    color={
                      userBody === "note" ? colors.secondaryColor : "inherit"
                    }
                    spacing="0"
                    as={Button}
                    variant="text"
                    size="lg"
                    onClick={() => {
                      navigate(
                        `/user/@${userName}${userHost ? `@${userHost}` : ""}`
                      );
                      updateUserBody("note");
                    }}
                  >
                    <Box>{userData.notesCount}</Box>
                    <Box>ノート</Box>
                  </VStack>
                  <VStack
                    color={
                      userBody === "following"
                        ? colors.secondaryColor
                        : "inherit"
                    }
                    spacing="0"
                    as={Button}
                    variant="text"
                    size="lg"
                    disabled={
                      userData.ffVisibility === "private" ||
                      (userData.ffVisibility === "followers" &&
                        !userData.isFollowing)
                    }
                    onClick={() => {
                      navigate(
                        `/user/@${userName}${
                          userHost ? `@${userHost}` : ""
                        }/following`
                      );
                      updateUserBody("following");
                    }}
                  >
                    {!(
                      userData.ffVisibility === "private" ||
                      (userData.ffVisibility === "followers" &&
                        !userData.isFollowing)
                    ) ? (
                      <>
                        <Box>{userData.followingCount}</Box>
                        <Box>フォロー</Box>
                      </>
                    ) : (
                      <>
                        <Box>フォロー</Box>
                        <Box>(非公開)</Box>
                      </>
                    )}
                  </VStack>
                  <VStack
                    color={
                      userBody === "followers"
                        ? colors.secondaryColor
                        : "inherit"
                    }
                    spacing="0"
                    as={Button}
                    variant="text"
                    size="lg"
                    disabled={
                      userData.ffVisibility === "private" ||
                      (userData.ffVisibility === "followers" &&
                        !userData.isFollowing)
                    }
                    onClick={() => {
                      navigate(
                        `/user/@${userName}${
                          userHost ? `@${userHost}` : ""
                        }/followers`
                      );
                      updateUserBody("followers");
                    }}
                  >
                    {!(
                      userData.ffVisibility === "private" ||
                      (userData.ffVisibility === "followers" &&
                        !userData.isFollowing)
                    ) ? (
                      <>
                        <Box>{userData.followersCount}</Box>
                        <Box>フォロワー</Box>
                      </>
                    ) : (
                      <>
                        <Box>フォロワー</Box>
                        <Box>(非公開)</Box>
                      </>
                    )}
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Center>
          <Loading />
        </Center>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="fit-content" bgColor={colors.panelColor} p="2">
          <ModalBody>
            <VStack spacing="0.5">
              <WarningTwoIcon fontSize="2em" color="yellow.500" />
              <Box>confirm</Box>
              <Box>ブロック{userData.isBlocking && "解除"}しますか?</Box>
              <HStack>
                <Button
                  {...props.PrimaryButton}
                  onClick={() => {
                    followingObject.body.id = userData.isBlocking
                      ? "unblock"
                      : "block";
                    followingObject.body.endpoint = userData.isBlocking
                      ? "blocking/delete"
                      : "blocking/create";
                    followingObject.body.data.userId = userData.id;
                    socket.send(JSON.stringify(followingObject));
                    onClose();
                  }}
                >
                  はい
                </Button>
                <Button {...props.AlphaButton} onClick={onClose}>
                  いいえ
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

const useGetUserData = (
  socket: WebSocket,
  userData: mkUser & UserShow,
  userName: string,
  userHost: string | null
): void => {
  const FG = useAppSelector(followings);
  const FR = useAppSelector(followers);
  const userObject = JSON.stringify(
    useAPIObject({
      id: "userData",
      type: "api",
      endpoint: "users/show",
      data: {
        username: userName,
        host: userHost,
      },
    })
  );
  const userFollowersObject = JSON.stringify(
    useAPIObject({
      id: "followers",
      type: "api",
      endpoint: "users/followers",
      data: {
        limit: 16,
        userId: userData.id,
      },
    })
  );
  const userFollowingObject = JSON.stringify(
    useAPIObject({
      id: "following",
      type: "api",
      endpoint: "users/following",
      data: {
        limit: 16,
        userId: userData.id,
      },
    })
  );
  useEffect(() => {
    if (!userData.id) socket.send(userObject);
  }, [socket, userObject, userData.id]);
  useEffect(() => {
    if (
      userData.id &&
      !(
        userData.ffVisibility === "private" ||
        (userData.ffVisibility === "followers" && !userData.isFollowing)
      )
    ) {
      if (FR.length === 0) socket.send(userFollowersObject);
      else if (FG.length === 0) socket.send(userFollowingObject);
    }
  }, [
    socket,
    userFollowersObject,
    userFollowingObject,
    userData,
    FR.length,
    FG.length,
  ]);
};

const getDate = (d: string) => {
  const date = new Date(d);
  return `${("0000" + date.getFullYear()).slice(-4)}/${
    date.getMonth() + 1
  }/${date.getDate()}`;
};
