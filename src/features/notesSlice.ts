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

export interface NoteType {
  id: ID;
  type: "note" | "reply" | "renote" | "quote";
}

export interface NotesState {
  notes: Array<Note>;
  noteTypes: Array<NoteType>;
  reactions: Array<ReactionDetails>;
  moreNote: boolean;
}

const initialState: NotesState = {
  notes: [],
  noteTypes: [],
  reactions: [],
  moreNote: false,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addUpper: (state, action: PayloadAction<Note>) => {
      state.noteTypes.unshift({
        id: action.payload.id,
        type:
          action.payload.renoteId && !action.payload.text
            ? "renote"
            : action.payload.replyId
            ? "reply"
            : action.payload.renoteId
            ? "quote"
            : "note",
      });
      state.notes.unshift(action.payload);
      let n: Note;
      if (state.noteTypes[0].type === "renote") {
        n = action.payload;
        while (n.renoteId && n.renote) {
          n = n.renote;
          if (n.text) break;
        }
      } else {
        n = action.payload;
      }
      if (!state.reactions.some((r) => r.id === n.id)) {
        state.reactions.unshift({
          id: n.id,
          myReaction: n.myReaction,
          reactions: n.reactions,
          emojis: n.emojis,
        });
      }
    },
    addLower: (state, action: PayloadAction<Note>) => {
      state.noteTypes.push({
        id: action.payload.id,
        type:
          action.payload.renoteId && !action.payload.text
            ? "renote"
            : action.payload.replyId
            ? "reply"
            : action.payload.renoteId
            ? "quote"
            : "note",
      });
      state.notes.push(action.payload);
      let n: Note;
      if (state.noteTypes[state.noteTypes.length - 1].type === "renote") {
        n = action.payload;
        while (n.renoteId && n.renote) {
          n = n.renote;
          if (n.text) break;
        }
      } else {
        n = action.payload;
      }
      if (!state.reactions.some((elm) => elm.id === n.id)) {
        state.reactions.push({
          id: n.id,
          myReaction: n.myReaction,
          reactions: n.reactions,
          emojis: n.emojis,
        });
      }
    },
    updateMoreNote: (state, action: PayloadAction<boolean>) => {
      state.moreNote = action.payload;
    },
    noteDelete: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: { deletedAt: string };
      }>
    ) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload.id);
      state.noteTypes = state.noteTypes.filter(
        (note) => note.id !== action.payload.id
      );
    },
    clear: (state) => {
      state.notes = [];
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
        if (action.payload.body.userId === localStorage.getItem("UserId"))
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
          state.reactions[index].reactions[action.payload.body.reaction] > 2
        ) {
          state.reactions[index].reactions[action.payload.body.reaction]--;
        } else {
          delete state.reactions[index].reactions[action.payload.body.reaction];
        }
        if (action.payload.body.userId === localStorage.getItem("UserId"))
          delete state.reactions[index].myReaction;
      }
    },
  },
});

export const {
  addUpper,
  addLower,
  updateMoreNote,
  noteDelete,
  clear,
  reacted,
  unreacted,
} = notesSlice.actions;

export const allNoteTypes = (state: RootState): Array<NoteType> =>
  state.notes.noteTypes;
export const allNotes = (state: RootState): Array<Note> => state.notes.notes;
export const allReactions = (state: RootState): Array<ReactionDetails> =>
  state.notes.reactions;
export const moreNote = (state: RootState): boolean => state.notes.moreNote;
export const oldestNoteId = (state: RootState): string =>
  state.notes.notes.length > 0
    ? state.notes.notes[state.notes.notes.length - 1].id
    : "";

export default notesSlice.reducer;
