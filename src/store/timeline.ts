import { create } from "zustand";

import type { Note } from "misskey-js/entities.js";

export type Timeline = {
  notes: Array<Note>;
};

type TimelineActions = {
  addNoteToTop: (payload: Note) => void;
  addNotesToTop: (payload: ReadonlyArray<Note>) => void;
  addNotesToBottom: (payload: ReadonlyArray<Note>) => void;
  clear: () => void;
};

export const useTimelineStore = create<Timeline & TimelineActions>((set) => ({
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
