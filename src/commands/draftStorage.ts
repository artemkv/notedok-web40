import {
  CommandType,
  DiscardNoteDraftCommand,
  UpdateExistingNoteDraftCommand,
  UpdateNewNoteDraftCommand,
  UpdateNoteDraftOnCreateCommand,
  UpdateNoteDraftOnRenameCommand,
} from "../commands";
import { Drafts, Maybe, MaybeType, NoteFormat } from "../model";

const draftsKey = "notedok.com/drafts";
const draftsVersion = 2;

const emptyDrafts = {
  version: draftsVersion,
  newNotes: {},
  notes: {},
};

export const loadDrafts = (): Drafts => {
  const json = localStorage.getItem(draftsKey);
  if (!json) {
    return emptyDrafts;
  }
  try {
    const drafts = JSON.parse(json);
    if (drafts.version !== draftsVersion) {
      return emptyDrafts;
    }
    return drafts;
  } catch (err) {
    console.error(`Could not restore drafts (${err})`);
    return emptyDrafts;
  }
};

const saveDrafts = (drafts: Drafts) => {
  localStorage.setItem(draftsKey, JSON.stringify(drafts));
};

export const UpdateNewNoteDraft = (
  key: string,
  timestamp: number,
  format: NoteFormat,
  draft: Maybe<string>
): UpdateNewNoteDraftCommand => ({
  type: CommandType.UpdateNewNoteDraft,
  key,
  timestamp,
  format,
  draft,
  execute: async () => {
    const drafts = loadDrafts();
    if (draft.type == MaybeType.Some) {
      drafts.newNotes[key] = {
        timestamp,
        format,
        text: draft.value,
      };
    } else {
      delete drafts.newNotes[key];
    }
    saveDrafts(drafts);
  },
});

export const UpdateExistingNoteDraft = (
  key: string,
  draft: Maybe<string>
): UpdateExistingNoteDraftCommand => ({
  type: CommandType.UpdateExistingNoteDraft,
  key,
  draft,
  execute: async () => {
    const drafts = loadDrafts();
    if (draft.type == MaybeType.Some) {
      drafts.notes[key] = draft.value;
    } else {
      delete drafts.notes[key];
    }
    saveDrafts(drafts);
  },
});

export const UpdateNoteDraftOnRename = (
  oldKey: string,
  newKey: string
): UpdateNoteDraftOnRenameCommand => ({
  type: CommandType.UpdateNoteDraftOnRename,
  oldKey,
  newKey,
  execute: async () => {
    const drafts = loadDrafts();
    const draft = drafts.notes[oldKey];
    delete drafts.notes[oldKey];
    if (draft) {
      drafts.notes[newKey] = draft;
    }
    saveDrafts(drafts);
  },
});

export const UpdateNoteDraftOnCreate = (
  oldKey: string,
  newKey: string
): UpdateNoteDraftOnCreateCommand => ({
  type: CommandType.UpdateNoteDraftOnCreate,
  oldKey,
  newKey,
  execute: async () => {
    const drafts = loadDrafts();
    const draft = drafts.newNotes[oldKey];
    delete drafts.newNotes[oldKey];
    if (draft) {
      drafts.notes[newKey] = draft.text;
    }
    saveDrafts(drafts);
  },
});

export const DiscardNoteDraft = (
  key: string,
  isNewNote: boolean
): DiscardNoteDraftCommand => ({
  type: CommandType.DiscardNoteDraft,
  key,
  isNewNote,
  execute: async () => {
    const drafts = loadDrafts();
    if (isNewNote) {
      delete drafts.newNotes[key];
    } else {
      delete drafts.notes[key];
    }
    saveDrafts(drafts);
  },
});
