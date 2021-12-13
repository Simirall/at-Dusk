import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ID, Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface ReactionDetails {
  id: ID;
  myReaction?: string;
  reactions: Record<string, number>;
  emojis: Array<{
    name: string;
    url: string;
  }>;
}

export interface ReactionState {
  reactions: Array<ReactionDetails>;
}

const initialState: ReactionState = {
  reactions: [],
};

export const reactionsSlice = createSlice({
  name: "reactions",
  initialState,
  reducers: {
    addReaction: (state, action: PayloadAction<Note>) => {
      (async () => {
        let n = action.payload;
        if (n.renoteId && !n.text) {
          while (n.renoteId && !n.text && n.renote) {
            n = n.renote;
            if (n.text) break;
          }
        }
        if (!state.reactions.some((r) => r.id === n.id)) {
          state.reactions.unshift({
            id: n.id,
            myReaction: n.myReaction,
            reactions: n.reactions,
            emojis: n.emojis,
          });
        }
      })();
    },
    addReactions: (state, action: PayloadAction<Array<Note>>) => {
      action.payload.forEach(async (note) => {
        (async () => {
          let n = note;
          if (n.renoteId && !n.text) {
            while (n.renoteId && !n.text && n.renote) {
              n = n.renote;
              if (n.text) break;
            }
          }
          if (!state.reactions.some((r) => r.id === n.id)) {
            state.reactions.unshift({
              id: n.id,
              myReaction: n.myReaction,
              reactions: n.reactions,
              emojis: n.emojis,
            });
          }
        })();
      });
    },
    reacted: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          reaction: string;
          emoji?: { name: string; url: string };
          userId: string;
        };
      }>
    ) => {
      const index = state.reactions.findIndex(
        (reaction) => reaction.id === action.payload.id
      );
      if (index >= 0) {
        if (
          Object.keys(state.reactions[index].reactions).includes(
            action.payload.body.reaction
          )
        ) {
          state.reactions[index].reactions[action.payload.body.reaction]++;
        } else {
          if (action.payload.body.emoji) {
            state.reactions[index].emojis.push(action.payload.body.emoji);
          }
          state.reactions[index].reactions[action.payload.body.reaction] = 1;
        }
        if (action.payload.body.userId === localStorage.getItem("userId"))
          state.reactions[index].myReaction = action.payload.body.reaction;
      }
    },
    unreacted: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          reaction: string;
          emoji?: { name: string; url: string };
          userId: string;
        };
      }>
    ) => {
      const index = state.reactions.findIndex(
        (reaction) => reaction.id === action.payload.id
      );
      if (index >= 0) {
        if (
          state.reactions[index].reactions[action.payload.body.reaction] >= 2
        ) {
          state.reactions[index].reactions[action.payload.body.reaction]--;
        } else {
          delete state.reactions[index].reactions[action.payload.body.reaction];
        }
        if (action.payload.body.userId === localStorage.getItem("userId"))
          delete state.reactions[index].myReaction;
      }
    },
  },
});

export const { addReaction, addReactions, reacted, unreacted } =
  reactionsSlice.actions;

export const allReactions = (state: RootState): Array<ReactionDetails> =>
  state.reactions.reactions;

export default reactionsSlice.reducer;
