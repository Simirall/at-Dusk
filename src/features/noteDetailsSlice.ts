import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

import { NoteType } from "./notesSlice";

export interface NoteDetailsState {
  noteDetails: Note;
  noteConversation: Array<Note>;
  noteConversationType: Array<NoteType>;
  noteChildren: Array<Note>;
  noteChildrenType: Array<NoteType>;
}

const initialState: NoteDetailsState = {
  noteDetails: {} as Note,
  noteConversation: [],
  noteConversationType: [],
  noteChildren: [],
  noteChildrenType: [],
};

export const noteDetailsSlice = createSlice({
  name: "noteDetails",
  initialState,
  reducers: {
    setNoteDetails: (state, action: PayloadAction<Note>) => {
      state.noteDetails = action.payload;
    },
    addNoteConversation: (state, action: PayloadAction<Array<Note>>) => {
      state.noteConversation = action.payload;
      (async () => {
        action.payload.forEach((note) => {
          state.noteConversationType.push({
            id: note.id,
            type:
              note.renoteId && !note.text
                ? "renote"
                : note.renoteId
                ? "quote"
                : "note",
          });
        });
      })();
    },
    addNoteChildren: (state, action: PayloadAction<Array<Note>>) => {
      state.noteChildren = action.payload;
      (async () => {
        action.payload.forEach((note) => {
          state.noteChildrenType.push({
            id: note.id,
            type:
              note.renoteId && !note.text
                ? "renote"
                : note.renoteId
                ? "quote"
                : "note",
          });
        });
      })();
    },
    clearNoteDetails: (state) => {
      state.noteDetails = {} as Note;
      state = initialState;
    },
  },
});

export const {
  setNoteDetails,
  addNoteConversation,
  addNoteChildren,
  clearNoteDetails,
} = noteDetailsSlice.actions;

export const noteDetails = (state: RootState): Note =>
  state.noteDetails.noteDetails;
export const noteDetailsType = (state: RootState): NoteType => ({
  id: state.noteDetails.noteDetails.id,
  type:
    state.noteDetails.noteDetails.renoteId &&
    !state.noteDetails.noteDetails.text
      ? "renote"
      : state.noteDetails.noteDetails.renoteId
      ? "quote"
      : "note",
});
export const noteDetailConversations = (state: RootState): Array<Note> =>
  state.noteDetails.noteConversation;
export const noteDetailsConversationType = (
  state: RootState
): Array<NoteType> => state.noteDetails.noteConversationType;
export const noteDetalisChildren = (state: RootState): Array<Note> =>
  state.noteDetails.noteChildren;
export const noteDetalisChildrenType = (state: RootState): Array<NoteType> =>
  state.noteDetails.noteChildrenType;

export default noteDetailsSlice.reducer;
