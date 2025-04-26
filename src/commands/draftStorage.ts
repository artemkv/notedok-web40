import { CommandType, UpdateNoteDraftCommand } from "../commands";
import { MaybeType, NoteLoaded } from "../model";

const draftsKey = "notedok.com/drafts";

interface Drafts {
  [key: string]: string;
}

const loadDrafts = (): Drafts => {
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

export const UpdateNoteDraft = (note: NoteLoaded): UpdateNoteDraftCommand => ({
  type: CommandType.UpdateNoteDraft,
  note,
  execute: async () => {
    const drafts = loadDrafts();
    if (note.draft.type == MaybeType.Some) {
      drafts[note.path] = note.draft.value;
      saveDrafts(drafts);
    } else {
      delete drafts[note.path];
      saveDrafts(drafts);
    }
  },
});
