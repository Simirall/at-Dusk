import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  HStack,
  Link,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import {
  Notification as mkNotification,
  UserLite,
} from "misskey-js/built/entities";
import React, { memo, useEffect, useRef } from "react";
import {
  IoCheckmark,
  IoPeopleCircle,
  IoPersonAdd,
  IoRepeat,
  IoStatsChart,
  IoTime,
} from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import { Link as routerLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  allNotifications,
  moreNotification,
  oldestNotificationId,
  removeNotification,
  updateMoreNotification,
} from "../features/notificationsSlice";
import { settings } from "../features/settingsSlice";
import { useColorContext } from "../utils/ColorContext";
import { useSocket } from "../utils/SocketContext";
import { getRelativeTime } from "../utils/getRelativeTime";
import { useAPIObject, APIObject } from "../utils/useAPIObject";

import { Loading } from "./Loading";
import { Note } from "./Note";
import { ParseMFM } from "./ParseMFM";
import { ParseReaction } from "./ParseReaction";

export const Notification: React.VFC = memo(function Fn() {
  const { colors } = useColorContext();
  const socket = useSocket();
  const notifications = useAppSelector(allNotifications);
  const autoMotto = useAppSelector(settings).autoMotto;
  const motto = useAppSelector(moreNotification);
  const dispatch = useAppDispatch();
  const dontEffect = useRef(true);
  const moreNotificationObject = useAPIObject({
    id: "moreNotification",
    type: "api",
    endpoint: "i/notifications",
    data: {
      limit: 15,
      untilId: useAppSelector(oldestNotificationId),
    },
  });
  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (autoMotto) {
      if (dontEffect.current) {
        dontEffect.current = false;
      } else if (inView && !motto) {
        dispatch(updateMoreNotification(true));
        socket.send(JSON.stringify(moreNotificationObject));
      }
    }
  }, [socket, dispatch, moreNotificationObject, autoMotto, motto, inView]);
  return (
    <>
      {notifications.map((n) => (
        <Box
          key={n.id}
          bgColor={colors.panelColor}
          p="1"
          marginBlock="1"
          borderRadius="md"
        >
          {n.type === "reaction" ? (
            <Reaction n={n} colors={colors} />
          ) : n.type === "renote" ? (
            <Renote n={n} />
          ) : n.type === "quote" ? (
            <Note note={n.note} type={{ id: n.id, type: "quote" }} depth={0} />
          ) : n.type === "reply" ? (
            <Note note={n.note} type={{ id: n.id, type: "reply" }} depth={0} />
          ) : n.type === "mention" ? (
            <Note
              note={n.note}
              type={{
                id: n.id,
                type:
                  n.note.renoteId && !n.note.text
                    ? "renote"
                    : n.note.replyId
                    ? "reply"
                    : n.note.renoteId
                    ? "quote"
                    : "note",
              }}
              depth={0}
            />
          ) : n.type === "follow" ? (
            <Followed n={n} colors={colors} />
          ) : n.type === "receiveFollowRequest" ? (
            <FollowRequest socket={socket} n={n} colors={colors} />
          ) : n.type === "followRequestAccepted" ? (
            <FollowAccepted n={n} colors={colors} />
          ) : n.type === "pollVote" ? (
            <Voted n={n} colors={colors} />
          ) : n.type === "groupInvited" ? (
            <GroupInvited n={n} colors={colors} />
          ) : n.type === "app" ? (
            <AppNotification n={n} />
          ) : (
            <></>
          )}
        </Box>
      ))}
      {autoMotto ? (
        <Center>{!motto ? <Box ref={ref} p="9" /> : <Loading small />}</Center>
      ) : (
        <Center marginBottom="2">
          <Button
            aria-label="more notes"
            size="lg"
            onClick={() => {
              dispatch(updateMoreNotification(true));
              socket.send(JSON.stringify(moreNotificationObject));
            }}
          >
            {motto ? <Loading small /> : "もっと"}
          </Button>
        </Center>
      )}
    </>
  );
});

const NotificationAvatar: React.VFC<{
  user: UserLite;
  icon: React.ReactNode;
  bgColor: string;
}> = memo(function Fn({ user, icon, bgColor }) {
  return (
    <Avatar
      src={user.avatarUrl}
      as={routerLink}
      to={`/user/@${user.username}${user.host ? `@${user.host}` : ""}`}
    >
      <AvatarBadge
        border="none"
        transform="translate(25%, 10%)"
        backgroundColor={bgColor}
        p="1"
        fontSize="0.8em"
      >
        {icon}
      </AvatarBadge>
    </Avatar>
  );
});

const Reaction: React.VFC<{
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ n, colors }) {
  return (
    <>
      {n.type === "reaction" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <ParseReaction
                reaction={
                  !n.reaction.includes(":") || n.reaction.includes("@")
                    ? n.reaction
                    : n.reaction.substring(0, n.reaction.length - 1) + "@.:"
                }
                emojis={n.note.emojis}
                limW
              />
            }
            bgColor={colors.secondaryColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Link as={routerLink} to={`/notes/${n.note.id}`}>
              {n.note.text ? (
                <ParseMFM
                  type="plainX"
                  text={n.note.cw || n.note.cw === "" ? n.note.cw : n.note.text}
                  emojis={n.note.emojis}
                />
              ) : n.note.fileIds.length > 0 ? (
                <>({n.note.fileIds.length}つのファイル)</>
              ) : n.note.poll ? (
                <>(アンケート)</>
              ) : (
                <></>
              )}
            </Link>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const Renote: React.VFC<{
  n: mkNotification;
}> = memo(function Fn({ n }) {
  return (
    <>
      {n.type === "renote" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box>
                <IoRepeat color="white" size="1.2em" />
              </Box>
            }
            bgColor="green.500"
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            {n.note.renote && (
              <Link as={routerLink} to={`/notes/${n.note.id}`}>
                {n.note.renote.text ? (
                  <ParseMFM
                    type="plainX"
                    text={
                      n.note.renote.cw || n.note.renote.cw === ""
                        ? n.note.renote.cw
                        : n.note.renote.text
                    }
                    emojis={n.note.renote.emojis}
                  />
                ) : n.note.renote.fileIds.length > 0 ? (
                  <>({n.note.renote.fileIds.length}つのファイル)</>
                ) : n.note.renote.poll ? (
                  <>(アンケート)</>
                ) : (
                  <></>
                )}
              </Link>
            )}
          </VStack>
        </HStack>
      )}
    </>
  );
});

const FollowRequest: React.VFC<{
  socket: WebSocket;
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ socket, n, colors }) {
  const dispatch = useAppDispatch();
  const FollowRequestObject = useAPIObject({
    id: "",
    type: "api",
    endpoint: "",
  }) as APIObject;
  return (
    <>
      {n.type === "receiveFollowRequest" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box>
                <IoTime color="white" size="1.2em" />
              </Box>
            }
            bgColor={colors.primaryDarkerColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <HStack fontSize="0.8em" color="gray.400">
              <Box>フォローリクエストされました</Box>
              <IconButton
                aria-label="accept request"
                icon={<CheckIcon />}
                colorScheme="teal"
                size="sm"
                onClick={() => {
                  FollowRequestObject.body.id = "acceptFollowRequests";
                  FollowRequestObject.body.endpoint =
                    "following/requests/accept";
                  FollowRequestObject.body.data.userId = n.user.id;
                  socket.send(JSON.stringify(FollowRequestObject));
                  dispatch(removeNotification(n.id));
                }}
              />
              <IconButton
                aria-label="reject request"
                icon={<CloseIcon />}
                colorScheme="red"
                size="sm"
                onClick={() => {
                  FollowRequestObject.body.id = "rejectFollowRequests";
                  FollowRequestObject.body.endpoint =
                    "following/requests/reject";
                  FollowRequestObject.body.data.userId = n.user.id;
                  socket.send(JSON.stringify(FollowRequestObject));
                  dispatch(removeNotification(n.id));
                }}
              />
            </HStack>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const Followed: React.VFC<{
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ n, colors }) {
  return (
    <>
      {n.type === "follow" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box>
                <IoPersonAdd color="white" size="1.2em" />
              </Box>
            }
            bgColor={colors.primaryDarkerColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Box fontSize="0.8em" color="gray.400">
              フォローされました
            </Box>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const Voted: React.VFC<{
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ n, colors }) {
  return (
    <>
      {n.type === "pollVote" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box transform="rotate(90deg)">
                <IoStatsChart color="white" size="1.2em" />
              </Box>
            }
            bgColor={colors.primaryDarkerColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Link
              as={routerLink}
              to={`/notes/${n.note.id}`}
              fontSize="0.8em"
              color="gray.400"
            >
              (アンケート)
            </Link>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const FollowAccepted: React.VFC<{
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ n, colors }) {
  return (
    <>
      {n.type === "followRequestAccepted" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box>
                <IoCheckmark color="white" size="1.2em" />
              </Box>
            }
            bgColor={colors.primaryDarkerColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Box fontSize="0.8em" color="gray.400">
              フォローが承認されました
            </Box>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const GroupInvited: React.VFC<{
  n: mkNotification;
  colors: Record<string, string>;
}> = memo(function Fn({ n, colors }) {
  return (
    <>
      {n.type === "groupInvited" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          <NotificationAvatar
            user={n.user}
            icon={
              <Box>
                <IoPeopleCircle color="white" size="1.2em" />
              </Box>
            }
            bgColor={colors.primaryDarkerColor}
          />
          <VStack
            overflow="hidden"
            pl="2"
            alignItems="start"
            spacing="0"
            w="full"
          >
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Link
                as={routerLink}
                to={`/user/@${n.user.username}${
                  n.user.host ? `@${n.user.host}` : ""
                }`}
                isTruncated
              >
                <ParseMFM
                  type="plain"
                  text={n.user.name ? n.user.name : n.user.username}
                  emojis={n.user.emojis}
                />
              </Link>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Box fontSize="0.8em" color="gray.400">
              グループに招待されました: {n.invitation.group.name}
            </Box>
          </VStack>
        </HStack>
      )}
    </>
  );
});

const AppNotification: React.VFC<{
  n: mkNotification;
}> = memo(function Fn({ n }) {
  return (
    <>
      {n.type === "app" && (
        <HStack spacing="0.5" p="1" overflow="hidden">
          {n.icon && <Avatar src={n.icon} pr="2" />}
          <VStack overflow="hidden" alignItems="start" spacing="0" w="full">
            <HStack overflow="hidden" justifyContent="space-between" w="full">
              <Box>{n.header ? n.header : "APP NOTIFICATION"}</Box>
              <Box color="gray.400">{getRelativeTime(n.createdAt)}</Box>
            </HStack>
            <Box fontSize="0.8em" color="gray.400">
              {n.body}
            </Box>
          </VStack>
        </HStack>
      )}
    </>
  );
});
