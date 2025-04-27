import {
  CommandType,
  DiscardNoteDraftCommand,
  UpdateNoteDraftCommand,
} from "../commands";
import { Drafts, Maybe, MaybeType } from "../model";

const draftsKey = "notedok.com/drafts";
const draftsVersion = 1;

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

export const UpdateNoteDraft = (
  key: string,
  isNewNote: boolean,
  draft: Maybe<string>
): UpdateNoteDraftCommand => ({
  type: CommandType.UpdateNoteDraft,
  key,
  isNewNote,
  draft,
  execute: async () => {
    const drafts = loadDrafts();
    if (draft.type == MaybeType.Some) {
      if (isNewNote) {
        drafts.newNotes[key] = draft.value;
      } else {
        drafts.notes[key] = draft.value;
      }
      saveDrafts(drafts);
    } else {
      if (isNewNote) {
        delete drafts.newNotes[key];
      } else {
        delete drafts.notes[key];
      }
      saveDrafts(drafts);
    }
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
