export enum ChangeType {
  Save,
}

export interface SaveChange {
  type: ChangeType.Save;
  noteId: string;
  newTitle: string;
  newText: string;

  onSuccess: () => void;
  onFailure: (err: string) => void;
}

export type Change = SaveChange;

export type Handler = (c: Change) => void;

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
      const c = q.find((c) => c.noteId == noteId);
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
  const dupIdx = q.findIndex(
    // TODO: dedup all
    (x) => x.noteId == c.noteId && x.type == ChangeType.Save
  );

  if (dupIdx >= 0) {
    const qNew = [...q.slice(0, dupIdx), c];
    if (dupIdx < q.length - 1) {
      qNew.push(...q.slice(dupIdx + 1));
    }
    return qNew;
  }

  return [...q, c];
};
