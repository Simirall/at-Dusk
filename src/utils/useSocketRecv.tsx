import { Note } from "misskey-js/built/entities";
import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { setNoteDetails } from "../features/noteDetailsSlice";
import {
  addUpper,
  addLower,
  updateMoreNote,
  noteDelete,
} from "../features/notesSlice";
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
  updateMoreFF,
  updateMoreUserNote,
  updateUserData,
  userNoteDelete,
} from "../features/userSlice";

import { useSocket } from "./SocketContext";

export const useSocketRecv = (): void => {
  const socket = useSocket();
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const data = res.body;
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
