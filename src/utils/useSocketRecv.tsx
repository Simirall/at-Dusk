import { Note, Notification } from "misskey-js/built/entities";
import { useEffect } from "react";
import { useMatch } from "react-router-dom";

import { useAppDispatch } from "../app/hooks";
import {
  addNoteChildren,
  addNoteConversation,
  setNoteDetails,
} from "../features/noteDetailsSlice";
import {
  addUpper,
  addLower,
  updateMoreNote,
  noteDelete,
} from "../features/notesSlice";
import {
  addNotification,
  addNotifications,
  updateMoreNotification,
  updateReadNotification,
} from "../features/notificationsSlice";
import { addPoll, addPolls, pollVote } from "../features/pollSlice";
import {
  addReaction,
  addReactions,
  reacted,
  unreacted,
} from "../features/reactionsSlice";
import {
  addFollowers,
  addFollowings,
  addUserNotes,
  changeUserNotesType,
  setUserData,
  updateFollowers,
  updateFollowings,
  updateMoreFF,
  updateMoreUserNote,
  updateUserData,
  userNoteDelete,
} from "../features/userSlice";

import { useSocket } from "./SocketContext";

export const useSocketRecv = (): void => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const isNotificationPage = useMatch("/notifications");
  useEffect(() => {
    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const data = res.body;
      if (!data.error) {
        switch (res.type) {
          case "channel":
            switch (data.id) {
              case "timeline":
                Promise.all([
                  dispatch(addUpper(data.body)),
                  dispatch(addReaction(data.body)),
                  dispatch(addPoll(data.body)),
                  sendSubNote(socket, data.body),
                ]);
                break;
              case "notification":
                switch (data.type) {
                  case "notification":
                    dispatch(addNotification(data.body));
                    if (
                      data.body.type === "mention" ||
                      data.body.type === "quote" ||
                      data.body.type === "reply"
                    ) {
                      dispatch(addReaction(data.body.note));
                      dispatch(addPoll(data.body.note));
                      sendSubNote(socket, data.body.note);
                    }
                    break;
                  case "unreadNotification":
                    if (!isNotificationPage) {
                      dispatch(updateReadNotification(false));
                    }
                    break;
                  case "readAllNotifications":
                    dispatch(updateReadNotification(true));
                    break;
                }
            }
            break;
          case "noteUpdated":
            switch (data.type) {
              case "reacted":
                dispatch(reacted(data));
                break;
              case "unreacted":
                dispatch(unreacted(data));
                break;
              case "deleted":
                dispatch(noteDelete(data));
                dispatch(userNoteDelete(data));
                break;
              case "pollVoted":
                dispatch(pollVote(data));
                break;
            }
            break;
          case "api:initNotes":
            Promise.all([
              dispatch(addLower(data.res)),
              dispatch(addReactions(data.res)),
              dispatch(addPolls(data.res)),
              sendSubNotes(socket, data.res),
            ]);
            break;
          case "api:initNotifications":
            (async () => {
              await dispatch(addNotifications(data.res));
              await Promise.all(
                data.res.map(async (notification: Notification) => {
                  if (
                    notification.type === "mention" ||
                    notification.type === "quote" ||
                    notification.type === "reply"
                  ) {
                    dispatch(addReaction(notification.note));
                    dispatch(addPoll(notification.note));
                    sendSubNote(socket, notification.note);
                  }
                })
              );
              dispatch(updateMoreNotification(false));
            })();
            break;
          case "api:moreNotification":
            (async () => {
              await dispatch(addNotifications(data.res));
              await Promise.all(
                data.res.map(async (notification: Notification) => {
                  if (
                    notification.type === "mention" ||
                    notification.type === "quote" ||
                    notification.type === "reply"
                  ) {
                    dispatch(addReaction(notification.note));
                    dispatch(addPoll(notification.note));
                    sendSubNote(socket, notification.note);
                  }
                })
              );
              dispatch(updateMoreNotification(false));
            })();
            break;
          case "api:moreNotes":
            Promise.all([
              dispatch(addLower(data.res)),
              dispatch(addReactions(data.res)),
              dispatch(addPolls(data.res)),
              dispatch(updateMoreNote(false)),
              sendSubNotes(socket, data.res),
            ]);
            break;
          case "api:noteDetails":
            Promise.all([
              dispatch(setNoteDetails(data.res)),
              dispatch(addReaction(data.res)),
              dispatch(addPoll(data.res)),
              sendSubNote(socket, data.res),
            ]);
            break;
          case "api:noteConversation":
            dispatch(addNoteConversation(data.res.reverse()));
            break;
          case "api:noteChildren":
            dispatch(addNoteChildren(data.res));
            break;
          case "api:userData":
            Promise.all([
              dispatch(setUserData(data.res)),
              dispatch(addReactions(data.res.pinnedNotes)),
              dispatch(addReactions(data.res.pinnedNotes)),
              dispatch(addPolls(data.res.pinnedNotes)),
              sendSubNotes(socket, data.res.pinnedNotes),
            ]);
            break;
          case "api:userNotes":
            Promise.all([
              dispatch(addUserNotes(data.res)),
              dispatch(addReactions(data.res)),
              dispatch(addPolls(data.res)),
              dispatch(changeUserNotesType(false)),
              sendSubNotes(socket, data.res),
            ]);
            break;
          case "api:moreUserNotes":
            Promise.all([
              dispatch(addUserNotes(data.res)),
              dispatch(addReactions(data.res)),
              dispatch(addPolls(data.res)),
              dispatch(updateMoreUserNote(false)),
              sendSubNotes(socket, data.res),
            ]);
            break;
          case "api:follow":
            dispatch(updateUserData("follow"));
            break;
          case "api:unfollow":
            dispatch(updateUserData("unfollow"));
            break;
          case "api:invalidate":
            dispatch(updateUserData("invalidate"));
            break;
          case "api:mute":
            dispatch(updateUserData("mute"));
            break;
          case "api:unmute":
            dispatch(updateUserData("unmute"));
            break;
          case "api:block":
            dispatch(updateUserData("block"));
            break;
          case "api:unblock":
            dispatch(updateUserData("unblock"));
            break;
          case "api:following":
            dispatch(addFollowings(data.res));
            dispatch(updateMoreFF(false));
            break;
          case "api:followers":
            dispatch(addFollowers(data.res));
            dispatch(updateMoreFF(false));
            break;
          case "api:FRfollow":
            dispatch(updateFollowers({ type: "follow", id: data.res.id }));
            break;
          case "api:FRunfollow":
            dispatch(updateFollowers({ type: "unfollow", id: data.res.id }));
            break;
          case "api:FGfollow":
            dispatch(updateFollowings({ type: "follow", id: data.res.id }));
            break;
          case "api:FGunfollow":
            dispatch(updateFollowings({ type: "unfollow", id: data.res.id }));
            break;
        }
      } else {
        console.log(data.error);
      }
    };
  });
};

const sendSubNote = async (socket: WebSocket, note: Note) => {
  socket.send(
    JSON.stringify({
      type: "subNote",
      body: {
        id: note.renoteId && !note.text ? note.renoteId : note.id,
      },
    })
  );
};

const sendSubNotes = async (socket: WebSocket, notes: Array<Note>) => {
  notes.forEach(async (note: Note) => {
    socket.send(
      JSON.stringify({
        type: "subNote",
        body: {
          id: note.renoteId && !note.text ? note.renoteId : note.id,
        },
      })
    );
  });
};
