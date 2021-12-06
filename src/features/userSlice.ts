import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateString, ID, Note, User } from "misskey-js/built/entities";

import { RootState } from "../app/store";

type UserShow = {
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
};

export interface userState {
  user: User & UserShow;
  moreNote: boolean;
}

const initialState: userState = {
  user: {} as User & UserShow,
  moreNote: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User & UserShow>) => {
      state.user = action.payload;
    },
    clearUserData: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const user = (state: RootState): User & UserShow => state.user.user;

export default userSlice.reducer;
