import { create } from "zustand";

import type { Note } from "misskey-js/entities.js";

export type TimeLine = {
  notes: Array<Note>;
};

type TimeLineActions = {
  addNoteToTop: (payload: Note) => void;
  addNotesToTop: (payload: ReadonlyArray<Note>) => void;
  addNotesToBottom: (payload: ReadonlyArray<Note>) => void;
  clear: () => void;
};

export const useTimeLineStore = create<TimeLine & TimeLineActions>((set) => ({
  notes: [],
  addNoteToTop: (payload) => {
    set((state) => ({
      notes: [payload, ...state.notes],
    }));
  },
  addNotesToTop: (payload) => {
    set((state) => ({
      notes: [...payload, ...state.notes],
    }));
  },
  addNotesToBottom: (payload) => {
    set((state) => ({
      notes: [...state.notes, ...payload],
    }));
  },
  clear: () => {
    set(() => ({
      notes: [],
    }));
  },
}));
