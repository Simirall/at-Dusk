import { Note } from "misskey-js/built/entities";
import { useEffect } from "react";

import { useAppDispatch } from "../app/hooks";
import { detailPollVote, set } from "../features/noteDetailsSlice";
import {
  addUpper,
  addLower,
  updateMoreNote,
  noteDelete,
  reacted,
  unreacted,
  pollVote,
} from "../features/notesSlice";

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
              dispatch(detailPollVote(data));
              break;
          }
          break;
        case "api:initNotes":
          dispatch(addLower(data.res));
          (async () => {
            data.res.forEach((note: Note) => {
              socket.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: note.id,
                  },
                })
              );
              if (data.body.renoteId && !data.body.text) {
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
          break;
        case "api:moreNotes":
          dispatch(addLower(data.res));
          (async () => {
            data.res.forEach((note: Note) => {
              socket.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: note.renoteId && !note.text ? note.renoteId : note.id,
                  },
                })
              );
            });
          })();
          dispatch(updateMoreNote(false));
          break;
        case "api:noteDetails":
          dispatch(set(data.res));
          break;
      }
    };
  });
};
