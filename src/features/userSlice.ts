import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateString, ID, Note, User } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface UserShow {
  bannerId: ID;
  bannerUrl: string;
  birthday: DateString;
  createdAt: DateString;
  description: string;
  ffVisibility: "public" | "followers" | "private";
  fields: Array<{ name: string; value: string }>;
  followersCount: number;
  followingCount: number;
  isAdmin: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  isBot: boolean;
  isCat: boolean;
  isFollowed: boolean;
  isFollowing: boolean;
  isLocked: boolean;
  isModerator: boolean;
  isMuted: boolean;
  isSilenced: boolean;
  isSuspended: boolean;
  location: string;
  notesCount: number;
  pinnedNoteIds: Array<ID>;
  pinnedNotes: Array<Note>;
  publicReactions: boolean;
}

export interface userState {
  user: User & UserShow;
  notes: Array<Note>;
  initNoteLoaded: boolean;
  moreUserNote: boolean;
  changeUserNotesType: boolean;
}

const initialState: userState = {
  user: {} as User & UserShow,
  notes: [],
  initNoteLoaded: false,
  moreUserNote: false,
  changeUserNotesType: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User & UserShow>) => {
      state.user = action.payload;
    },
    addUserNotes: (state, action: PayloadAction<Array<Note>>) => {
      state.notes = state.notes.concat(action.payload);
      state.initNoteLoaded = true;
      state.changeUserNotesType = false;
    },
    updateMoreUserNote: (state, action: PayloadAction<boolean>) => {
      state.moreUserNote = action.payload;
    },
    userNoteDelete: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: { deletedAt: string };
      }>
    ) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload.id);
    },
    clearUserNotes: (state) => {
      state.notes = [];
      state.changeUserNotesType = true;
    },
    clearUserData: (state) => {
      state.user = initialState.user;
      state.notes = [];
      state.initNoteLoaded = false;
    },
  },
});

export const {
  setUserData,
  addUserNotes,
  updateMoreUserNote,
  userNoteDelete,
  clearUserNotes,
  clearUserData,
} = userSlice.actions;

export const user = (state: RootState): User & UserShow => state.user.user;
export const userNotes = (state: RootState): Array<Note> => state.user.notes;
export const oldestUserNoteId = (state: RootState): string =>
  state.user.notes.length > 0
    ? state.user.notes[state.user.notes.length - 1]?.id
    : "";
export const initNoteLoaded = (state: RootState): boolean =>
  state.user.initNoteLoaded;
export const changeUserNotesType = (state: RootState): boolean =>
  state.user.changeUserNotesType;
export const moreUserNote = (state: RootState): boolean =>
  state.user.moreUserNote;

export default userSlice.reducer;
