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
      if (!state.reactions.some((elm) => elm.id === n.id)) {
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
    clear: (state) => {
      state.notes = [];
    },
  },
});

export const { addUpper, addLower, updateMoreNote, clear } = notesSlice.actions;

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
