import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { NotesState } from "../features/notesSlice";

import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = (): ThunkDispatch<
  { notes: NotesState },
  null | undefined,
  AnyAction
> => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
