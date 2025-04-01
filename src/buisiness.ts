import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import {
  CreateNote,
  DeleteNote,
  LoadNoteText,
  RestoreNote,
  RetrieveFileList,
  SaveNote,
} from "./commands/storage";
import {
  DeleteNoteRequestedEvent,
  LoadNoteTextSuccessEvent,
  NoteAllChangesSavedEvent,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteReachedSavePointEvent,
  NoteRestoredEvent,
  NoteSelectedEvent,
  RestoreNoteRequestedEvent,
  RetrieveFileListSuccessEvent,
  UserAuthenticatedEvent,
} from "./events";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  isNoteEditable,
  Note,
  NoteEditable,
  NoteListState,
  NoteState,
} from "./model";
import {
  createNewNote,
  createNewNoteRef,
  noteCreatingToLoaded,
  noteDeletedToRestoring,
  noteDeletingToDeleted,
  noteLoadedToDeleting,
  noteLoadedToSaving,
  noteLoadingToLoaded,
  noteNewToCreating,
  noteRefToLoading,
  noteRestoringToLoaded,
  noteSavingToLoaded,
} from "./noteLifecycle";

// TODO: make sure to handle all possible note states properly
export const getEffectiveTitle = (note: Note) => {
  if (note.state == NoteState.New) {
    return "";
  }
  if (note.state == NoteState.Saving) {
    return note.newTitle;
  }
  return note.title;
};

// TODO: make sure to handle all possible note states properly
export const getEffectiveText = (note: Note) => {
  if (
    note.state == NoteState.Ref ||
    note.state == NoteState.Loading ||
    note.state == NoteState.FailedToLoad
  ) {
    return "";
  }
  if (note.state == NoteState.New) {
    return "";
  }
  if (note.state == NoteState.Saving) {
    return note.newText;
  }
  return note.text;
};

export const JustStateAuthenticated = (
  state: AppStateAuthenticated
): [AppStateAuthenticated, AppCommand] => [state, DoNothing];

export const handleUserAuthenticated = (
  state: AppStateUnauthenticated,
  event: UserAuthenticatedEvent
): [AppState, AppCommand] => {
  return [state, StartUserSession(event.idToken)];
};

export const handleUserSessionCreated = (): [
  AppStateAuthenticated,
  AppCommand
] => {
  const newState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.Retrieving,
    },
  };

  return [newState, DoMany([RetrieveFileList(), ScheduleIdTokenRefresh()])];
};

export const handleRetrieveFileListSuccess = (
  event: RetrieveFileListSuccessEvent
): [AppStateAuthenticated, AppCommand] => {
  const newState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.Retrieved,
      lastUsedNoteId: event.fileList.length - 1,
      notes: event.fileList.map((f, idx) => createNewNoteRef(idx, f)),
      selectedNoteId: "",
    },
  };
  return JustStateAuthenticated(newState);
};

export const handleNoteSelected = (
  state: AppStateAuthenticated,
  event: NoteSelectedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    // If ref -> trigger load
    if (event.note.state == NoteState.Ref) {
      const noteLoading = noteRefToLoading(event.note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoading),
          selectedNoteId: noteLoading.id,
        },
      };
      return [newState, LoadNoteText(noteLoading)];
    }

    // Not ref -> simply update selection
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        selectedNoteId: event.note.id,
      },
    };
    return JustStateAuthenticated(newState);
  }

  return JustStateAuthenticated(state);
};

export const handleLoadNoteTextSuccess = (
  state: AppStateAuthenticated,
  event: LoadNoteTextSuccessEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (event.note.state == NoteState.Loading) {
      const noteLoaded = noteLoadingToLoaded(event.note, event.text);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteReachedSavePoint = (
  state: AppStateAuthenticated,
  event: NoteReachedSavePointEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (
      note &&
      isNoteEditable(note) &&
      hasChanged(note, event.currentTitle, event.currentText)
    ) {
      if (note.state == NoteState.Loaded) {
        const noteSaving = noteLoadedToSaving(
          note,
          event.currentTitle,
          event.currentText
        );
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteSaving),
          },
        };
        return [newState, SaveNote(noteSaving)];
      }
      if (note.state == NoteState.New) {
        const noteCreating = noteNewToCreating(
          note,
          event.currentTitle,
          event.currentText
        );
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteCreating),
          },
        };
        return [newState, CreateNote(noteCreating)];
      }
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteAllChangesSaved = (
  state: AppStateAuthenticated,
  event: NoteAllChangesSavedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Saving) {
      const noteLoaded = noteSavingToLoaded(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleCreateNoteRequested = (
  state: AppStateAuthenticated
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const newNote = createNewNote(state.noteList.lastUsedNoteId + 1);
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        lastUsedNoteId: state.noteList.lastUsedNoteId + 1,
        notes: [newNote, ...state.noteList.notes],
        selectedNoteId: newNote.id,
      },
    };
    return JustStateAuthenticated(newState);
  }

  return JustStateAuthenticated(state);
};

export const handleNoteCreated = (
  state: AppStateAuthenticated,
  event: NoteCreatedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Creating) {
      const noteCreated = noteCreatingToLoaded(note, event.path);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteCreated),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleDeleteNoteRequested = (
  state: AppStateAuthenticated,
  event: DeleteNoteRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Loaded) {
      const noteDeleting = noteLoadedToDeleting(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteDeleting),
        },
      };
      return [newState, DeleteNote(noteDeleting)];
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteDeleted = (
  state: AppStateAuthenticated,
  event: NoteDeletedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Deleting) {
      const noteDeleted = noteDeletingToDeleted(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteDeleted),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleRestoreNoteRequested = (
  state: AppStateAuthenticated,
  event: RestoreNoteRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Deleted) {
      const noteRestoring = noteDeletedToRestoring(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteRestoring),
        },
      };
      return [newState, RestoreNote(noteRestoring)];
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteRestored = (
  state: AppStateAuthenticated,
  event: NoteRestoredEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Restoring) {
      const noteLoaded = noteRestoringToLoaded(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

const replace = (notes: Note[], note: Note): Note[] => {
  return notes.map((n) => {
    if (n.id == note.id) {
      return note;
    }
    return n;
  });
};

const getNote = (notes: Note[], noteId: string) => {
  return notes.find((x) => x.id === noteId);
};

const hasChanged = (
  note: NoteEditable,
  currentTitle: string,
  currentText: string
) => {
  if (note.state == NoteState.New) {
    return currentTitle !== "" || currentText !== "";
  }

  return note.title !== currentTitle || note.text != currentText;
};
