import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomEmoji } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface SettingsState {
  theme: {
    lightTheme: string;
    darkTheme: string;
  };
  autoMotto: boolean;
  defaultVisibility: "public" | "home" | "followers" | "specified";
  defaultLocalOnly: boolean;
  TLPostForm: boolean;
  RUEmoji: Array<CustomEmoji | string>;
}

const initialState: SettingsState = {
  theme: {
    lightTheme: "",
    darkTheme: "",
  },
  defaultVisibility: "public",
  defaultLocalOnly: false,
  autoMotto: true,
  TLPostForm: false,
  RUEmoji: [],
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

export const { setTheme, setSettings, addRUEmoji, setDefault } =
  settingsSlice.actions;

export const settings = (state: RootState): SettingsState => state.settings;

export default settingsSlice.reducer;
