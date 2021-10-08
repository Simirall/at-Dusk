import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ID, Note } from "misskey-js/built/entities";
import { RootState } from "../app/store";

interface ReactionDetails {
  id: ID;
  myReaction?: string;
  reactions: Record<string, number>;
  emojis: Array<{
    name: string;
    url: string;
  }>;
}

interface NoteType {
  id: ID;
  type: "note" | "renote" | "quote";
}

export interface NotesState {
  notes: Array<Note>;
  noteType: Array<NoteType>;
  reactions: Array<ReactionDetails>;
}

const initialState: NotesState = {
  notes: [],
  noteType: [],
  reactions: [],
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addUpper: (state, action: PayloadAction<Note>) => {
      state.noteType.unshift({
        id: action.payload.id,
        type: action.payload.renoteId
          ? !action.payload.text
            ? "renote"
            : "quote"
          : "note",
      });
      state.notes.unshift(action.payload);
      let n: Note;
      if (state.noteType[0].type === "renote") {
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
      state.noteType.push({
        id: action.payload.id,
        type: action.payload.renoteId
          ? !action.payload.text
            ? "renote"
            : "quote"
          : "note",
      });
      console.log(
        action.payload,
        action.payload.renoteId
          ? !action.payload.text
            ? "renote"
            : "quote"
          : "note"
      );
      state.notes.push(action.payload);
      let n: Note;
      if (state.noteType[state.noteType.length - 1].type === "renote") {
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
    clear: (state) => {
      state.notes = [];
    },
  },
});

export const { addUpper, addLower, clear } = notesSlice.actions;

export const allNotes = (state: RootState): Array<Note> => state.notes.notes;
export const allReactions = (state: RootState): Array<ReactionDetails> =>
  state.notes.reactions;

export default notesSlice.reducer;
