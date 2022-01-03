import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note, UserDetailed } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface userState {
  user: UserDetailed;
  notes: Array<Note>;
  initNoteLoaded: boolean;
  moreUserNote: boolean;
  isLastUserNote: boolean;
  changeUserNotesType: boolean;
  followers: Array<{
    createdAt: string;
    follower: UserDetailed;
    followeeId: string;
    followerId: string;
    id: string;
  }>;
  followings: Array<{
    createdAt: string;
    followee: UserDetailed;
    followeeId: string;
    followerId: string;
    id: string;
  }>;
  followerLoaded: boolean;
  followingsLoaded: boolean;
  isLastFollower: boolean;
  isLastFollowing: boolean;
  moreFF: boolean;
}

const initialState: userState = {
  user: {} as UserDetailed,
  notes: [],
  initNoteLoaded: false,
  moreUserNote: false,
  isLastUserNote: false,
  changeUserNotesType: false,
  followers: [],
  followings: [],
  followerLoaded: false,
  followingsLoaded: false,
  isLastFollower: false,
  isLastFollowing: false,
  moreFF: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDetailed>) => {
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
      if (action.payload.length < 15) state.isLastUserNote = true;
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
          followee: UserDetailed;
          followeeId: string;
          followerId: string;
          id: string;
        }>
      >
    ) => {
      state.followings = state.followings.concat(action.payload);
      state.followingsLoaded = true;
      if (action.payload.length < 16) state.isLastFollowing = true;
    },
    addFollowers: (
      state,
      action: PayloadAction<
        Array<{
          createdAt: string;
          follower: UserDetailed;
          followeeId: string;
          followerId: string;
          id: string;
        }>
      >
    ) => {
      state.followers = state.followers.concat(action.payload);
      state.followerLoaded = true;
      if (action.payload.length < 16) state.isLastFollower = true;
    },
    updateFollowings: (
      state,
      action: PayloadAction<{ type: "follow" | "unfollow"; id: string }>
    ) => {
      const i = state.followings.findIndex(
        (user) => user.followeeId === action.payload.id
      );
      if (i >= 0)
        state.followings[i].followee.isFollowing =
          action.payload.type === "follow" ? true : false;
    },
    updateFollowers: (
      state,
      action: PayloadAction<{ type: "follow" | "unfollow"; id: string }>
    ) => {
      const i = state.followers.findIndex(
        (user) => user.followerId === action.payload.id
      );
      if (i >= 0)
        state.followers[i].follower.isFollowing =
          action.payload.type === "follow" ? true : false;
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
      state.isLastUserNote = false;
      state.isLastFollower = false;
      state.isLastFollowing = false;
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
  updateFollowings,
  updateFollowers,
  updateMoreFF,
  changeUserNotesType,
  clearUserNotes,
  clearFF,
  clearUserData,
} = userSlice.actions;

export const user = (state: RootState): UserDetailed => state.user.user;
export const userNotes = (state: RootState): Array<Note> => state.user.notes;
export const isChangedUserNoteType = (state: RootState): boolean =>
  state.user.changeUserNotesType;
export const moreUserNote = (state: RootState): boolean =>
  state.user.moreUserNote;
export const moreFF = (state: RootState): boolean => state.user.moreFF;
export const followers = (
  state: RootState
): Array<{
  createdAt: string;
  follower: UserDetailed;
  followeeId: string;
  followerId: string;
  id: string;
}> => state.user.followers;
export const followings = (
  state: RootState
): Array<{
  createdAt: string;
  followee: UserDetailed;
  followeeId: string;
  followerId: string;
  id: string;
}> => state.user.followings;
export const initLoadeds = (
  state: RootState
): {
  userNote: boolean;
  followers: boolean;
  followings: boolean;
} => ({
  userNote: state.user.initNoteLoaded,
  followers: state.user.followerLoaded,
  followings: state.user.followingsLoaded,
});
export const oldests = (
  state: RootState
): { userNote: string; follower: string; following: string } => ({
  userNote:
    state.user.notes.length > 0
      ? state.user.notes[state.user.notes.length - 1].id
      : "",
  follower:
    state.user.followers.length > 0
      ? state.user.followers[state.user.followers.length - 1].id
      : "",
  following:
    state.user.followings.length > 0
      ? state.user.followings[state.user.followings.length - 1].id
      : "",
});
export const lasts = (
  state: RootState
): { userNote: boolean; follower: boolean; following: boolean } => ({
  userNote: state.user.isLastUserNote,
  follower: state.user.isLastFollower,
  following: state.user.isLastFollowing,
});

export default userSlice.reducer;
