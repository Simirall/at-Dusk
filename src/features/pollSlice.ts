import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface Poll {
  id: string;
  expiresAt: string | null;
  multiple: boolean;
  choices: {
    isVoted: boolean;
    text: string;
    votes: number;
  }[];
}

export interface PollState {
  polls: Array<Poll>;
}

const initialState: PollState = {
  polls: [],
};

export const pollSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPoll: (state, action: PayloadAction<Note>) => {
      if (action.payload.poll) {
        state.polls.push({
          id: action.payload.id,
          ...action.payload.poll,
        });
      }
      if (action.payload.renote?.poll) {
        state.polls.push({
          id: action.payload.renote.id,
          ...action.payload.renote.poll,
        });
      }
    },
    addPolls: (state, action: PayloadAction<Array<Note>>) => {
      action.payload.forEach(async (note) => {
        if (note.poll) {
          state.polls.push({
            id: note.id,
            ...note.poll,
          });
        }
        if (note.renote?.poll) {
          state.polls.push({
            id: note.renote.id,
            ...note.renote.poll,
          });
        }
      });
    },
    pollVote: (
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
      const i = state.polls.findIndex((poll) => poll.id === action.payload.id);
      if (i >= 0) {
        state.polls[i].choices[action.payload.body.choice].votes += 1;
        if (action.payload.body.userId === localStorage.getItem("userId")) {
          state.polls[i].choices[action.payload.body.choice].isVoted = true;
        }
      }
    },
  },
});

export const { addPoll, addPolls, pollVote } = pollSlice.actions;

export const allPolls = (state: RootState): Array<Poll> => state.poll.polls;

export default pollSlice.reducer;
