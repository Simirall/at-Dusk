import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ID, Note } from "misskey-js/built/entities";

import { RootState } from "../app/store";

export interface ReactionDetails {
  id: ID;
  myReaction?: string;
  reactions: Record<string, number>;
  emojis: Array<{
    name: string;
    url: string;
  }>;
}

export interface NoteType {
  id: ID;
  type: "note" | "reply" | "renote" | "quote";
}

export interface Poll {
  id: string;
  expiresAt: string | null;
  multiple: boolean;
  choices: {
    isVoted: boolean;
    text: string;
    votes: number;
  }[];
}

export interface NotesState {
  notes: Array<Note>;
  noteTypes: Array<NoteType>;
  reactions: Array<ReactionDetails>;
  polls: Array<Poll>;
  moreNote: boolean;
}

const initialState: NotesState = {
  notes: [],
  noteTypes: [],
  reactions: [],
  polls: [],
  moreNote: false,
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addUpper: (state, action: PayloadAction<Note>) => {
      state.noteTypes.unshift({
        id: action.payload.id,
        type:
          action.payload.renoteId && !action.payload.text
            ? "renote"
            : action.payload.replyId
            ? "reply"
            : action.payload.renoteId
            ? "quote"
            : "note",
      });
      state.notes.unshift(action.payload);
      (async () => {
        let n: Note;
        if (state.noteTypes[0].type === "renote") {
          n = action.payload;
          while (n.renoteId && n.renote) {
            n = n.renote;
            if (n.text) break;
          }
        } else {
          n = action.payload;
        }
        if (!state.reactions.some((r) => r.id === n.id)) {
          state.reactions.unshift({
            id: n.id,
            myReaction: n.myReaction,
            reactions: n.reactions,
            emojis: n.emojis,
          });
        }
      })();
      (async () => {
        if (action.payload.poll) {
          state.polls.unshift({
            id: action.payload.id,
            ...action.payload.poll,
          });
        }
        if (action.payload.renote?.poll) {
          state.polls.unshift({
            id: action.payload.renote.id,
            ...action.payload.renote.poll,
          });
        }
      })();
    },
    addLower: (state, action: PayloadAction<Note>) => {
      state.noteTypes.push({
        id: action.payload.id,
        type:
          action.payload.renoteId && !action.payload.text
            ? "renote"
            : action.payload.replyId
            ? "reply"
            : action.payload.renoteId
            ? "quote"
            : "note",
      });
      state.notes.push(action.payload);
      (async () => {
        let n: Note;
        if (state.noteTypes[state.noteTypes.length - 1].type === "renote") {
          n = action.payload;
          while (n.renoteId && n.renote) {
            n = n.renote;
            if (n.text) break;
          }
        } else {
          n = action.payload;
        }
        if (!state.reactions.some((elm) => elm.id === n.id)) {
          state.reactions.push({
            id: n.id,
            myReaction: n.myReaction,
            reactions: n.reactions,
            emojis: n.emojis,
          });
        }
      })();
      (async () => {
        if (action.payload.poll) {
          state.polls.push({
            id: action.payload.id,
            ...action.payload.poll,
          });
        }
        if (action.payload.renote?.poll) {
          state.polls.push({
            id: action.payload.renote.id,
            ...action.payload.renote.poll,
          });
        }
      })();
    },
    updateMoreNote: (state, action: PayloadAction<boolean>) => {
      state.moreNote = action.payload;
    },
    noteDelete: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: { deletedAt: string };
      }>
    ) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload.id);
      state.noteTypes = state.noteTypes.filter(
        (note) => note.id !== action.payload.id
      );
    },
    clear: (state) => {
      state.notes = [];
    },
    reacted: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          reaction: string;
          emoji?: { name: string; url: string };
          userId: string;
        };
      }>
    ) => {
      const index = state.reactions.findIndex(
        (reaction) => reaction.id === action.payload.id
      );
      if (index >= 0) {
        if (
          Object.keys(state.reactions[index].reactions).includes(
            action.payload.body.reaction
          )
        ) {
          state.reactions[index].reactions[action.payload.body.reaction]++;
        } else {
          if (action.payload.body.emoji) {
            state.reactions[index].emojis.push(action.payload.body.emoji);
          }
          state.reactions[index].reactions[action.payload.body.reaction] = 1;
        }
        if (action.payload.body.userId === localStorage.getItem("userId"))
          state.reactions[index].myReaction = action.payload.body.reaction;
      }
    },
    unreacted: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          reaction: string;
          emoji?: { name: string; url: string };
          userId: string;
        };
      }>
    ) => {
      const index = state.reactions.findIndex(
        (reaction) => reaction.id === action.payload.id
      );
      if (index >= 0) {
        if (
          state.reactions[index].reactions[action.payload.body.reaction] >= 2
        ) {
          state.reactions[index].reactions[action.payload.body.reaction]--;
        } else {
          delete state.reactions[index].reactions[action.payload.body.reaction];
        }
        if (action.payload.body.userId === localStorage.getItem("userId"))
          delete state.reactions[index].myReaction;
      }
    },
    pollVote: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        body: {
          choice: number;
          userId: string;
        };
      }>
    ) => {
      const i = state.polls.findIndex((poll) => poll.id === action.payload.id);
      if (i >= 0) {
        state.polls[i].choices[action.payload.body.choice].votes += 1;
        if (action.payload.body.userId === localStorage.getItem("userId")) {
          state.polls[i].choices[action.payload.body.choice].isVoted = true;
        }
      }
    },
  },
});

export const {
  addUpper,
  addLower,
  updateMoreNote,
  noteDelete,
  clear,
  reacted,
  unreacted,
  pollVote,
} = notesSlice.actions;

export const allNoteTypes = (state: RootState): Array<NoteType> =>
  state.notes.noteTypes;
export const allNotes = (state: RootState): Array<Note> => state.notes.notes;
export const allReactions = (state: RootState): Array<ReactionDetails> =>
  state.notes.reactions;
export const allPolls = (state: RootState): Array<Poll> => state.notes.polls;
export const moreNote = (state: RootState): boolean => state.notes.moreNote;
export const oldestNoteId = (state: RootState): string =>
  state.notes.notes.length > 0
    ? state.notes.notes[state.notes.notes.length - 1].id
    : "";

export default notesSlice.reducer;
