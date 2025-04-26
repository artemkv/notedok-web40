import {
  CommandType,
  DiscardNoteDraftCommand,
  UpdateNoteDraftCommand,
} from "../commands";
import { Drafts, Maybe, MaybeType } from "../model";

const draftsKey = "notedok.com/drafts";

export const loadDrafts = (): Drafts => {
  const json = localStorage.getItem(draftsKey);
  if (!json) {
    return {};
  }
  try {
    return JSON.parse(json);
  } catch (err) {
    console.error(`Could not restore drafts (${err})`);
    return {};
  }
};

const saveDrafts = (drafts: Drafts) => {
  localStorage.setItem(draftsKey, JSON.stringify(drafts));
};

export const UpdateNoteDraft = (
  key: string,
  draft: Maybe<string>
): UpdateNoteDraftCommand => ({
  type: CommandType.UpdateNoteDraft,
  key,
  draft,
  execute: async () => {
    const drafts = loadDrafts();
    if (draft.type == MaybeType.Some) {
      drafts[key] = draft.value;
      saveDrafts(drafts);
    } else {
      delete drafts[key];
      saveDrafts(drafts);
    }
  },
});

export const DiscardNoteDraft = (key: string): DiscardNoteDraftCommand => ({
  type: CommandType.DiscardNoteDraft,
  key,
  execute: async () => {
    const drafts = loadDrafts();
    delete drafts[key];
    saveDrafts(drafts);
  },
});
