import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import noteDetailsReducer from "../features/noteDetailsSlice";
import notesReducer from "../features/notesSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    noteDetails: noteDetailsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
