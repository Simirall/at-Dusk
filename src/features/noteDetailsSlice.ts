import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

import { NoteType } from "./notesSlice";

export interface NoteDetailsState {
  noteDetails: Note;
}

const initialState: NoteDetailsState = {
  noteDetails: {} as Note,
};

export const noteDetailsSlice = createSlice({
  name: "noteDetails",
  initialState,
  reducers: {
    setNoteDetails: (state, action: PayloadAction<Note>) => {
      state.noteDetails = action.payload;
    },
    clearNoteDetails: (state) => {
      state.noteDetails = {} as Note;
      state = initialState;
    },
  },
});

export const { setNoteDetails, clearNoteDetails } = noteDetailsSlice.actions;

export const noteDetails = (state: RootState): Note =>
  state.noteDetails.noteDetails;
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
