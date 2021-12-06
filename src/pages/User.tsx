import { Avatar, AvatarBadge } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { Box, Heading, HStack, Text, Divider, VStack } from "@chakra-ui/layout";
import { useEffect } from "react";
import React, { useState } from "react";
import {
  IoBookmark,
  IoBookmarkOutline,
  IoCalendar,
  IoFlame,
  IoLocation,
} from "react-icons/io5";
import { useNavigate } from "react-router";

import { useAppSelector } from "../app/hooks";
import { ParseMFM } from "../components/ParseMFM";
import { user } from "../features/userSlice";
import { useColors } from "../utils/Colors";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
import { useAPIObject } from "../utils/useAPIObject";

export const User: React.VFC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const colors = useColors();
  const props = useStyleProps();
  const [banner404, setBanner404] = useState(false);
  const [userBody, updateUserBody] = useState<
    "note" | "following" | "followers"
  >("note");
  const userName = document.location.pathname.split("@")[1].split("/")[0];
  const userHost = document.location.pathname.split("@")[2]
    ? document.location.pathname.split("@")[2].split("/")[0]
    : null;
  const userData = useAppSelector(user);
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
  useEffect(() => {
    socket.send(userObject);
  }, [socket, userObject]);
  return (
    <>
      {userData.id && (
        <>
          <Box maxW="95vw" w="6xl" color={colors.textColor}>
            <Box w="full" p="2" fontSize="1.1em">
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
                  <HStack
                    position="absolute"
                    zIndex="2"
                    top="0"
                    right="0"
                    p="2"
                  >
                    {userData.isBlocking ? (
                      <Button colorScheme="red">ブロック中</Button>
                    ) : userData.isFollowing ? (
                      <Button {...props.PrimaryButton}>フォロー中</Button>
                    ) : (
                      <Button {...props.AlphaButton}>フォロー</Button>
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
                    onClick={() => {
                      navigate(
                        `/user/@${userName}${
                          userHost ? `@${userHost}` : ""
                        }/following`
                      );
                      updateUserBody("following");
                    }}
                  >
                    <Box>{userData.followingCount}</Box>
                    <Box>フォロー</Box>
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
                    onClick={() => {
                      navigate(
                        `/user/@${userName}${
                          userHost ? `@${userHost}` : ""
                        }/followers`
                      );
                      updateUserBody("followers");
                    }}
                  >
                    <Box>{userData.followersCount}</Box>
                    <Box>フォロワー</Box>
                  </VStack>
                </HStack>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

const getDate = (d: string) => {
  const date = new Date(d);
  return `${("0000" + date.getFullYear()).slice(-4)}/${
    date.getMonth() + 1
  }/${date.getDate()}`;
};
