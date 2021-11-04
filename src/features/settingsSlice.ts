import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../app/store";

export interface SettingsState {
  theme: {
    lightTheme: string;
    darkTheme: string;
  };
  autoMotto: boolean;
}

const initialState: SettingsState = {
  theme: {
    lightTheme: "",
    darkTheme: "",
  },
  autoMotto: true,
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
    setMotto: (state, action: PayloadAction<boolean>) => {
      state.autoMotto = action.payload;
    },
    setDefault: (state) => {
      state.theme = initialState.theme;
      state = initialState;
    },
  },
});

export const { setTheme, setMotto, setDefault } = settingsSlice.actions;

export const settings = (state: RootState): SettingsState => state.settings;

export default settingsSlice.reducer;
