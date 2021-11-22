import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { NoteDetailsState } from "../features/noteDetailsSlice";
import { NotesState } from "../features/notesSlice";
import { SettingsState } from "../features/settingsSlice";

import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): ThunkDispatch<
  { notes: NotesState; noteDetails: NoteDetailsState; settings: SettingsState },
  null | undefined,
  AnyAction
> => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
