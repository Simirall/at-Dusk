import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateString, ID, Note, Page, User } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface UserShow {
  bannerBlurhash: string | null;
  bannerColor: string | null;
  bannerUrl: string | null;
  birthday: string | null;
  createdAt: DateString;
  description: string | null;
  ffVisibility: "public" | "followers" | "private";
  fields: { name: string; value: string }[];
  followersCount: number;
  followingCount: number;
  hasPendingFollowRequestFromYou: boolean;
  hasPendingFollowRequestToYou: boolean;
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
  lang: string | null;
  location: string | null;
  notesCount: number;
  pinnedNoteIds: ID[];
  pinnedNotes: Note[];
  pinnedPage: Page | null;
  pinnedPageId: string | null;
  publicReactions: boolean;
  securityKeys: boolean;
  twoFactorEnabled: boolean;
  updatedAt: DateString | null;
  uri: string | null;
  url: string | null;
}

export interface userState {
  user: User & UserShow;
  notes: Array<Note>;
  initNoteLoaded: boolean;
  moreUserNote: boolean;
  changeUserNotesType: boolean;
  followers: Array<{
    createdAt: string;
    follower: User & UserShow;
    followeeId: string;
    followerId: string;
    id: string;
  }>;
  followings: Array<{
    createdAt: string;
    followee: User & UserShow;
    followeeId: string;
    followerId: string;
    id: string;
  }>;
  followerLoaded: boolean;
  followingsLoaded: boolean;
  moreFF: boolean;
}

const initialState: userState = {
  user: {} as User & UserShow,
  notes: [],
  initNoteLoaded: false,
  moreUserNote: false,
  changeUserNotesType: false,
  followers: [],
  followings: [],
  followerLoaded: false,
  followingsLoaded: false,
  moreFF: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User & UserShow>) => {
      state.user = action.payload;
    },
    updateUserData: (state, action: PayloadAction<string>) => {
      if (action.payload === "follow") state.user.isFollowing = true;
      else if (action.payload === "unfollow") state.user.isFollowing = false;
      else if (action.payload === "invalidate") state.user.isFollowed = false;
      else if (action.payload === "mute") state.user.isMuted = true;
      else if (action.payload === "unmute") state.user.isMuted = false;
      else if (action.payload === "block") state.user.isBlocking = true;
      else if (action.payload === "unblock") state.user.isBlocking = false;
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
    addFollowings: (
      state,
      action: PayloadAction<
        Array<{
          createdAt: string;
          followee: User & UserShow;
          followeeId: string;
          followerId: string;
          id: string;
        }>
      >
    ) => {
      state.followings = state.followings.concat(action.payload);
      state.followingsLoaded = true;
    },
    addFollowers: (
      state,
      action: PayloadAction<
        Array<{
          createdAt: string;
          follower: User & UserShow;
          followeeId: string;
          followerId: string;
          id: string;
        }>
      >
    ) => {
      state.followers = state.followers.concat(action.payload);
      state.followerLoaded = true;
    },
    updateMoreFF: (state, action: PayloadAction<boolean>) => {
      state.moreFF = action.payload;
    },
    changeUserNotesType: (state, action: PayloadAction<boolean>) => {
      state.changeUserNotesType = action.payload;
    },
    clearUserNotes: (state) => {
      state.notes = [];
    },
    clearFF: (state) => {
      state.followings = [];
      state.followers = [];
    },
    clearUserData: (state) => {
      state.user = initialState.user;
      state.notes = [];
      state.followings = [];
      state.followers = [];
      state.initNoteLoaded = false;
      state.followerLoaded = false;
      state.followingsLoaded = false;
    },
  },
});

export const {
  setUserData,
  updateUserData,
  addUserNotes,
  updateMoreUserNote,
  userNoteDelete,
  addFollowings,
  addFollowers,
  updateMoreFF,
  changeUserNotesType,
  clearUserNotes,
  clearFF,
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
export const isChangedUserNoteType = (state: RootState): boolean =>
  state.user.changeUserNotesType;
export const moreUserNote = (state: RootState): boolean =>
  state.user.moreUserNote;
export const followers = (
  state: RootState
): Array<{
  createdAt: string;
  follower: User & UserShow;
  followeeId: string;
  followerId: string;
  id: string;
}> => state.user.followers;
export const followings = (
  state: RootState
): Array<{
  createdAt: string;
  followee: User & UserShow;
  followeeId: string;
  followerId: string;
  id: string;
}> => state.user.followings;
export const followingsLoaded = (state: RootState): boolean =>
  state.user.followingsLoaded;
export const followerLoaded = (state: RootState): boolean =>
  state.user.followerLoaded;
export const moreFF = (state: RootState): boolean => state.user.moreFF;
export const oldestFollowingId = (state: RootState): string =>
  state.user.followings.length > 0
    ? state.user.followings[state.user.followings.length - 1]?.id
    : "";
export const oldestFollowerId = (state: RootState): string =>
  state.user.followers.length > 0
    ? state.user.followers[state.user.followers.length - 1]?.id
    : "";

export default userSlice.reducer;
