import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CustomEmoji,
  InstanceMetadata,
  MeDetailed,
} from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface SettingsState {
  theme: {
    lightTheme: string;
    darkTheme: string;
  };
  timeline:
    | "homeTimeline"
    | "localTimeline"
    | "hybridTimeline"
    | "globalTimeline";
  autoMotto: boolean;
  defaultVisibility: "public" | "home" | "followers" | "specified";
  defaultLocalOnly: boolean;
  TLPostForm: boolean;
  RUEmoji: Array<CustomEmoji | string>;
  userInfo: {
    login: boolean;
    userToken: string;
    instance: string;
    appname: string;
    userData: MeDetailed;
    instanceMeta: InstanceMetadata;
  };
}

const initialState: SettingsState = {
  theme: {
    lightTheme: "",
    darkTheme: "",
  },
  timeline: "homeTimeline",
  defaultVisibility: "public",
  defaultLocalOnly: false,
  autoMotto: true,
  TLPostForm: false,
  RUEmoji: [],
  userInfo: {
    login: false,
    userToken: "",
    instance: "",
    appname: "",
    userData: {} as MeDetailed,
    instanceMeta: {} as InstanceMetadata,
  },
};

export const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    setTheme: (
      state,
      action: PayloadAction<{
        theme: { lightTheme: string; darkTheme: string };
      }>
    ) => {
      state.theme = action.payload.theme;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{
        login: boolean;
        userToken: string;
        instance: string;
        appname: string;
        userData: MeDetailed;
        instanceMeta: InstanceMetadata;
      }>
    ) => {
      state.userInfo.login = action.payload.login;
      state.userInfo.userToken = action.payload.userToken;
      state.userInfo.instance = action.payload.instance;
      state.userInfo.appname = action.payload.appname;
      state.userInfo.userData = action.payload.userData;
      state.userInfo.instanceMeta = action.payload.instanceMeta;
    },
    setTimeline: (
      state,
      action: PayloadAction<{
        timeline:
          | "homeTimeline"
          | "localTimeline"
          | "hybridTimeline"
          | "globalTimeline";
      }>
    ) => {
      state.timeline = action.payload.timeline;
    },
    setSettings: (
      state,
      action: PayloadAction<{
        autoMotto: boolean;
        TLPostForm: boolean;
        defaultVisibility: "public" | "home" | "followers" | "specified";
        defaultLocalOnly: boolean;
      }>
    ) => {
      state.autoMotto = action.payload.autoMotto;
      state.TLPostForm = action.payload.TLPostForm;
      state.defaultVisibility = action.payload.defaultVisibility;
      state.defaultLocalOnly = action.payload.defaultLocalOnly;
    },
    addRUEmoji: (state, action: PayloadAction<CustomEmoji | string>) => {
      if (typeof action.payload === "string") {
        state.RUEmoji = state.RUEmoji.filter(
          (emoji) =>
            (typeof emoji === "string" && emoji !== action.payload) ||
            typeof emoji !== "string"
        );
      } else {
        const e = action.payload as CustomEmoji;
        state.RUEmoji = state.RUEmoji.filter(
          (emoji) =>
            (typeof emoji !== "string" && emoji.name !== e.name) ||
            typeof emoji === "string"
        );
      }
      state.RUEmoji.unshift(action.payload);
      if (state.RUEmoji.length > 16) state.RUEmoji.pop();
    },
    setDefault: (state) => {
      state.theme = initialState.theme;
      state = initialState;
    },
  },
});

export const {
  setTheme,
  setUserInfo,
  setTimeline,
  setSettings,
  addRUEmoji,
  setDefault,
} = settingsSlice.actions;

export const settings = (state: RootState): SettingsState => state.settings;

export default settingsSlice.reducer;
