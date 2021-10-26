import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../app/store";

export interface SettingsState {
  theme: {
    lightTheme: string;
    darkTheme: string;
  };
}

const initialState: SettingsState = {
  theme: {
    lightTheme: localStorage.getItem("light-theme") as string,
    darkTheme: localStorage.getItem("dark-theme") as string,
  },
};

export const settingsSlice = createSlice({
  name: "settingsSlice",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState>) => {
      state.theme = action.payload.theme;
    },
    setDefault: (state) => {
      state.theme = {
        lightTheme: "",
        darkTheme: "",
      };
    },
  },
});

export const { setTheme, setDefault } = settingsSlice.actions;

export const settings = (state: RootState): SettingsState => state.settings;

export default settingsSlice.reducer;
