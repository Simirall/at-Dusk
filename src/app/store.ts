import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import noteDetailsReducer from "../features/noteDetailsSlice";
import notesReducer from "../features/notesSlice";
import notificationsReducer from "../features/notificationsSlice";
import pollReducer from "../features/pollSlice";
import reactionsReducer from "../features/reactionsSlice";
import settingsReducer from "../features/settingsSlice";
import userReducer from "../features/userSlice";

const reducers = combineReducers({
  notes: notesReducer,
  noteDetails: noteDetailsReducer,
  reactions: reactionsReducer,
  poll: pollReducer,
  settings: settingsReducer,
  user: userReducer,
  notifications: notificationsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
