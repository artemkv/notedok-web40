import { NoteCreating, NoteDeleting, NoteRestoring, NoteSaving } from "./model";

export enum ChangeType {
  Create,
  Save,
  Delete,
  Restore,
}

export interface CreateChange {
  type: ChangeType.Create;
  note: NoteCreating;

  onSuccess: () => void;
  onFailure: (err: string) => void;
}

export interface SaveChange {
  type: ChangeType.Save;
  note: NoteSaving;

  onSuccess: () => void;
  onFailure: (err: string) => void;
}

export interface DeleteChange {
  type: ChangeType.Delete;
  note: NoteDeleting;

  onSuccess: () => void;
  onFailure: (err: string) => void;
}

export interface RestoreChange {
  type: ChangeType.Restore;
  note: NoteRestoring;

  onSuccess: () => void;
  onFailure: (err: string) => void;
}

export type Change = CreateChange | SaveChange | DeleteChange | RestoreChange;

export type Handler = (c: Change) => Promise<void>;

export const makeChannel = () => {
  let handler: Handler | undefined = void 0;
  let isExecuting = false;
  let q: Change[] = [];

  const exec = async (c: Change) => {
    isExecuting = true;
    try {
      await handler!(c);
    } catch (err) {
      console.error(err);
    }

    if (q.length > 0) {
      const cNext = q.shift()!;
      setImmediate(() => exec(cNext));
    } else {
      isExecuting = false;
    }
  };

  return {
    write: (c: Change) => {
      if (handler && !isExecuting) {
        exec(c);
      } else {
        q = pushWithDedup(q, c);
      }
    },
    hasPendingChanges: (noteId: string): boolean => {
      const c = q.find((c) => c.note.id == noteId);
      if (c !== undefined) {
        return true;
      }
      return false;
    },
    attachHandler: (h: Handler) => {
      if (handler) {
        throw Error("Handler already attached");
      }
      if (!h) {
        throw Error("Handler cannot be undefined");
      }
      handler = h;
      if (q.length > 0 && !isExecuting) {
        const c: Change = q.shift()!;
        exec(c);
      }
    },
  };
};

export const pushWithDedup = (q: Change[], c: Change): Change[] => {
  // TODO: dedup all
  // TODO: dedup should actually be from the back
  const dupIdx = q.findIndex((x) => {
    if (x.note.id == c.note.id) {
      // TODO: make sure it's actually like this
      if (c.type == ChangeType.Create && x.type == ChangeType.Create) {
        return true;
      }
      if (c.type == ChangeType.Save && x.type == ChangeType.Save) {
        return true;
      }
    }
  });

  if (dupIdx >= 0) {
    const qNew = [...q.slice(0, dupIdx), c];
    if (dupIdx < q.length - 1) {
      qNew.push(...q.slice(dupIdx + 1));
    }
    return qNew;
  }

  return [...q, c];
};
