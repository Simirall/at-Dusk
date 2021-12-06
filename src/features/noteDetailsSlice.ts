import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

import { NoteType, Poll, ReactionDetails } from "./notesSlice";

export interface NoteDetailsState {
  noteDetails: Note;
  reaction: ReactionDetails;
  poll: Array<Poll>;
}

const initialState: NoteDetailsState = {
  noteDetails: {} as Note,
  reaction: {} as ReactionDetails,
  poll: [],
};

export const noteDetailsSlice = createSlice({
  name: "noteDetails",
  initialState,
  reducers: {
    setNoteDetails: (state, action: PayloadAction<Note>) => {
      state.noteDetails = action.payload;
      const rn = action.payload.renote && !action.payload.text;
      state.reaction = {
        id: !rn ? action.payload.id : (action.payload.renote?.id as string),
        myReaction: !rn
          ? action.payload.myReaction
          : action.payload.renote?.myReaction,
        reactions: !rn
          ? action.payload.reactions
          : (action.payload.renote?.reactions as Record<string, number>),
        emojis: !rn
          ? action.payload.emojis
          : (action.payload.renote?.emojis as Array<{
              name: string;
              url: string;
            }>),
      };
      if (action.payload.poll) {
        state.poll.push({ id: action.payload.id, ...action.payload.poll });
      }
      if (action.payload.renote?.poll) {
        state.poll.push({
          id: action.payload.renoteId,
          ...action.payload.renote.poll,
        });
      }
    },
    detailPollVote: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          choice: number;
          userId: string;
        };
      }>
    ) => {
      const i = state.poll.findIndex((poll) => poll.id === action.payload.id);
      if (i >= 0) {
        state.poll[i].choices[action.payload.body.choice].votes += 1;
        if (action.payload.body.userId === localStorage.getItem("userId")) {
          state.poll[i].choices[action.payload.body.choice].isVoted = true;
        }
      }
    },
    clearNoteDetails: (state) => {
      state.noteDetails = {} as Note;
      state = initialState;
    },
  },
});

export const { setNoteDetails, detailPollVote, clearNoteDetails } =
  noteDetailsSlice.actions;

export const noteDetails = (state: RootState): Note =>
  state.noteDetails.noteDetails;
export const noteDetailsReaction = (state: RootState): ReactionDetails =>
  state.noteDetails.reaction;
export const noteDetailsPoll = (state: RootState): Array<Poll> =>
  state.noteDetails.poll;
export const noteDetailsType = (state: RootState): NoteType => ({
  id: state.noteDetails.noteDetails.id,
  type:
    state.noteDetails.noteDetails.renoteId &&
    !state.noteDetails.noteDetails.text
      ? "renote"
      : state.noteDetails.noteDetails.replyId
      ? "reply"
      : state.noteDetails.noteDetails.renoteId
      ? "quote"
      : "note",
});

export default noteDetailsSlice.reducer;
