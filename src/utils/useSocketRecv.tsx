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
import { addPoll, pollVote } from "../features/pollSlice";
import {
  addReaction,
  addReactions,
  reacted,
  unreacted,
} from "../features/reactionsSlice";
import { setUserData } from "../features/userSlice";

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
              dispatch(addUpper(data.body));
              dispatch(addReaction(data.body));
              dispatch(addPoll(data.body));
              socket.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: data.body.id,
                  },
                })
              );
              if (data.body.renoteId && !data.body.text) {
                socket.send(
                  JSON.stringify({
                    type: "subNote",
                    body: {
                      id: data.body.renoteId,
                    },
                  })
                );
              }
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
              break;
            case "pollVoted":
              dispatch(pollVote(data));
              break;
          }
          break;
        case "api:initNotes":
          dispatch(addLower(data.res));
          (async () => {
            data.res.forEach(async (note: Note) => {
              socket.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: note.id,
                  },
                })
              );
              if (note.renoteId && !note.text) {
                socket.send(
                  JSON.stringify({
                    type: "subNote",
                    body: {
                      id: note.renoteId,
                    },
                  })
                );
              }
            });
          })();
          (async () => {
            dispatch(addReactions(data.res));
            dispatch(addReactions(data.res));
          })();
          break;
        case "api:moreNotes":
          dispatch(addLower(data.res));
          (async () => {
            data.res.forEach(async (note: Note) => {
              socket.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: note.renoteId && !note.text ? note.renoteId : note.id,
                  },
                })
              );
              if (note.renoteId && !note.text) {
                socket.send(
                  JSON.stringify({
                    type: "subNote",
                    body: {
                      id: note.renoteId,
                    },
                  })
                );
              }
            });
          })();
          (async () => {
            dispatch(addReactions(data.res));
            dispatch(addReactions(data.res));
          })();
          dispatch(updateMoreNote(false));
          break;
        case "api:noteDetails":
          dispatch(setNoteDetails(data.res));
          dispatch(addReaction(data.res));
          dispatch(addPoll(data.res));
          break;
        case "api:userData":
          dispatch(setUserData(data.res));
          dispatch(addReactions(data.res.pinnedNotes));
          dispatch(addReactions(data.res.pinnedNotes));
          break;
      }
    };
  });
};
