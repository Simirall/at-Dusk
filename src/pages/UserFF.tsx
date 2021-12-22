import { Avatar, AvatarBadge } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Box, HStack, Center, Text, Link } from "@chakra-ui/layout";
import { User } from "misskey-js/built/entities";
import React, { useState, useEffect, memo } from "react";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { Link as routerLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Loading } from "../components/Loading";
import { ParseMFM } from "../components/ParseMFM";
import { settings } from "../features/settingsSlice";
import {
  followers,
  followings,
  initLoadeds,
  lasts,
  moreFF,
  oldests,
  updateMoreFF,
  user,
  UserShow,
} from "../features/userSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { useStyleProps } from "../utils/StyleProps";
import { APIObject, useAPIObject } from "../utils/useAPIObject";

export const UserFF: React.VFC<{ type: "following" | "followers" }> = memo(
  function Fn({ type }) {
    const socket = useSocket();
    const userData = useAppSelector(user);
    const followersData = useAppSelector(followers);
    const followingsData = useAppSelector(followings);
    const loaded = useAppSelector(initLoadeds);
    const FGloaded = loaded.followings;
    const FRloaded = loaded.followers;
    const last = useAppSelector(lasts);
    const lastFG = last.following;
    const lastFR = last.follower;
    const { colors } = useColorContext();
    return (
      <>
        <Box maxW="95vw" w="6xl" color={colors.textColor} pb="2">
          {!(
            userData.ffVisibility === "private" ||
            (userData.ffVisibility === "followers" && !userData.isFollowing)
          ) ? (
            <>
              {type === "following" ? (
                <>
                  {followingsData.length > 0 && (
                    <>
                      <HStack wrap="wrap" justify="center" spacing="0">
                        {followingsData.map((user, i) => (
                          <Box
                            key={i}
                            w="max(50%, 20rem)"
                            maxW="full"
                            h="15em"
                            p="1"
                          >
                            <UserContainer
                              socket={socket}
                              user={user.followee}
                              type={type}
                              colors={colors}
                            />
                          </Box>
                        ))}
                      </HStack>
                      {FGloaded && !lastFG && (
                        <Motto socket={socket} type={type} id={userData.id} />
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {followersData.length > 0 && (
                    <>
                      <HStack wrap="wrap" justify="center" spacing="0">
                        {followersData.map((user, i) => (
                          <Box
                            key={i}
                            w="max(50%, 20rem)"
                            maxW="full"
                            h="15em"
                            p="1"
                          >
                            <UserContainer
                              socket={socket}
                              user={user.follower}
                              type={type}
                              colors={colors}
                            />
                          </Box>
                        ))}
                      </HStack>
                      {FRloaded && !lastFR && (
                        <Motto socket={socket} type={type} id={userData.id} />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <Center fontSize="1.2em">非公開です</Center>
          )}
        </Box>
      </>
    );
  }
);

const Motto: React.VFC<{
  socket: WebSocket;
  type: "followers" | "following";
  id: string;
}> = memo(function Fn({ socket, type, id }) {
  const motto = useAppSelector(moreFF);
  const autoMotto = useAppSelector(settings).autoMotto;
  const dispatch = useAppDispatch();
  const oldest = useAppSelector(oldests);
  const OFGID = oldest.following;
  const OFRID = oldest.follower;
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const moreFFObject = JSON.stringify(
    useAPIObject({
      id: type === "following" ? "following" : "followers",
      type: "api",
      endpoint: type === "following" ? "users/following" : "users/followers",
      data: {
        limit: 16,
        userId: id,
        untilId: type === "following" ? OFGID : OFRID,
      },
    })
  );
  useEffect(() => {
    if (inView && autoMotto && !motto) {
      updateMoreFF(true);
      socket.send(moreFFObject);
    }
  }, [socket, inView, autoMotto, motto, moreFFObject]);
  return (
    <>
      {autoMotto ? (
        <Center>{!motto ? <Box p="9" ref={ref} /> : <Loading small />}</Center>
      ) : (
        <Center marginBottom="2">
          <Button
            aria-label="more notes"
            size="lg"
            onClick={() => {
              dispatch(updateMoreFF(true));
              socket.send(moreFFObject);
            }}
          >
            {motto ? <Loading small /> : "もっと"}
          </Button>
        </Center>
      )}
    </>
  );
});

const UserContainer: React.VFC<{
  socket: WebSocket;
  user: User & UserShow;
  type: "followers" | "following";
  colors: Record<string, string>;
}> = memo(function Fn({ socket, user, type, colors }) {
  const [banner404, setBanner404] = useState(false);
  const props = useStyleProps();
  const followingObject = useAPIObject({
    id: "",
    type: "api",
    endpoint: "",
  }) as APIObject;
  return (
    <>
      <Box
        w="full"
        h="full"
        borderRadius="md"
        bgColor={colors.panelColor}
        overflow="hidden"
        color={colors.textColor}
      >
        <Box w="full" position="relative">
          <Button
            position="absolute"
            size="sm"
            m="1"
            {...(user.isFollowing
              ? { ...props.PrimaryButton }
              : { ...props.AlphaButton })}
            onClick={() => {
              if (!user.isFollowing) {
                followingObject.body.id =
                  type === "followers" ? "FRfollow" : "FGfollow";
                followingObject.body.endpoint = "following/create";
              } else {
                followingObject.body.id =
                  type === "followers" ? "FRunfollow" : "FGunfollow";
                followingObject.body.endpoint = "following/delete";
              }
              followingObject.body.data.userId = user.id;
              socket.send(JSON.stringify(followingObject));
            }}
          >
            {user.isFollowing ? <MinusIcon /> : <AddIcon />}
          </Button>
          {!banner404 && user.bannerUrl ? (
            <Image
              src={user.bannerUrl}
              w="full"
              h="8em"
              objectFit="cover"
              loading="lazy"
              onError={() => {
                setBanner404(true);
              }}
            />
          ) : (
            <Box
              w="full"
              h="8em"
              bgGradient={`linear(to-b, ${colors.secondaryColor}, #00000000)`}
            />
          )}
        </Box>
        <HStack pl="4">
          <Link
            as={routerLink}
            to={`/user/@${user.username}${user.host ? `@${user.host}` : ""}`}
          >
            <Avatar
              src={user.avatarUrl}
              loading="lazy"
              size="lg"
              transform="translateY(-0.8em)"
            >
              <AvatarBadge
                bgColor={
                  user.onlineStatus === "online"
                    ? "cyan.400"
                    : user.onlineStatus === "active"
                    ? "orange.300"
                    : user.onlineStatus === "offline"
                    ? "red.500"
                    : "gray.400"
                }
                boxSize="0.6em"
                borderWidth="0"
                transform="translateY(-0.2em)"
                title={`status: ${user.onlineStatus}`}
                shadow="md"
              />
            </Avatar>
          </Link>
          <Box w="full" overflow="hidden">
            <Box fontSize="1.2em" isTruncated>
              <Link
                as={routerLink}
                to={`/user/@${user.username}${
                  user.host ? `@${user.host}` : ""
                }`}
              >
                {user.name ? (
                  <ParseMFM
                    type="plain"
                    text={user.name}
                    emojis={user.emojis}
                  />
                ) : (
                  user.username
                )}
              </Link>
            </Box>
            <HStack spacing="0.5" overflow="hidden">
              <Text color="gray.400" isTruncated>
                {`@${user.username}${user.host ? `@${user.host}` : ""}`}
              </Text>
              {user.isAdmin ? (
                <Icon
                  as={IoBookmark}
                  color={colors.primaryColor}
                  fontSize="1.2em"
                />
              ) : user.isModerator ? (
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
        <Box p="2" w="full" isTruncated>
          <ParseMFM type="full" text={user.description} emojis={user.emojis} />
        </Box>
      </Box>
    </>
  );
});
