import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import {
  CreateNewNoteWithText,
  CreateNewNoteWithTitle,
  DeleteNote,
  LoadNoteText,
  RenameNote,
  RestoreNote,
  RetrieveFileList,
  SaveNoteText,
} from "./commands/storage";
import { isMarkdownFile } from "./conversion";
import {
  DeleteNoteRequestedEvent,
  EditNoteRequestedEvent,
  LoadNoteTextSuccessEvent,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteRenamedEvent,
  NoteRestoredEvent,
  NoteRestoredOnNewPathEvent,
  NoteSaveTextRequestedEvent,
  NoteSelectedEvent,
  NoteTextSavedEvent,
  NoteTitleUpdatedEvent,
  RestoreNoteRequestedEvent,
  RetrieveFileListSuccessEvent,
  SearchTextUpdatedEvent,
  UserAuthenticatedEvent,
} from "./events";
import { sanitizeMilkdownWeirdStuff } from "./mdformatting";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  EditorState,
  Note,
  NoteListState,
  NoteState,
} from "./model";
import {
  createNewNote,
  createNewNoteRef,
  noteCreatingFromTextToLoaded,
  noteCreatingFromTitleToLoaded,
  noteDeletedToRestoring,
  noteDeletingToDeleted,
  noteLoadedToDeleting,
  noteLoadedToRenaming,
  noteLoadedToSavingText,
  noteLoadingToLoaded,
  noteNewToCreatingFromText,
  noteNewToCreatingFromTitle,
  noteRefToLoading,
  noteRenamingToLoaded,
  noteRestoringToLoaded,
  noteRestoringToLoadedWithNewPath,
  noteSavingTextToLoaded,
} from "./noteLifecycle";

// TODO: make sure to handle all possible note states properly
export const getEffectiveTitle = (note: Note): string => {
  if (
    note.state == NoteState.New ||
    note.state == NoteState.CreatingFromText ||
    note.state == NoteState.FailedToCreateFromText
  ) {
    return "";
  }
  if (
    note.state == NoteState.Renaming ||
    note.state == NoteState.FailedToRename
  ) {
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
  if (
    note.state == NoteState.New ||
    note.state == NoteState.CreatingFromTitle ||
    note.state == NoteState.FailedToCreateFromTitle
  ) {
    return "";
  }
  if (
    note.state == NoteState.SavingText ||
    note.state == NoteState.FailedToSaveText
  ) {
    return note.newText;
  }
  return note.text;
};

export const isMarkdownNote = (note: Note) => {
  if (
    note.state == NoteState.New ||
    note.state == NoteState.CreatingFromTitle ||
    note.state == NoteState.CreatingFromText ||
    note.state == NoteState.FailedToCreateFromTitle ||
    note.state == NoteState.FailedToCreateFromText
  ) {
    return true;
  }
  return isMarkdownFile(note.path);
};

export const filter = (notes: Note[], searchText: string) => {
  return notes.filter((x) =>
    getEffectiveTitle(x).toLowerCase().includes(searchText.toLowerCase())
  );
};

export const canEdit = (note: Note) => {
  if (note.state == NoteState.Loaded || note.state == NoteState.New) {
    return true;
  }
  return false;
};

export const canDelete = (note: Note) => {
  if (note.state == NoteState.Loaded || note.state == NoteState.New) {
    return true;
  }
  return false;
};

export const canRestore = (note: Note) => {
  if (note.state == NoteState.Deleted) {
    return true;
  }
  return false;
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
      searchText: "",
      editorState: EditorState.Inactive,
    },
  };
  return JustStateAuthenticated(newState);
};

export const handleSearchTextUpdated = (
  state: AppStateAuthenticated,
  event: SearchTextUpdatedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        searchText: event.searchText,
      },
    };
    return JustStateAuthenticated(newState);
  }

  return JustStateAuthenticated(state);
};

export const handleNoteSelected = (
  state: AppStateAuthenticated,
  event: NoteSelectedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.selectedNoteId !== event.note.id) {
      // If ref -> trigger load
      if (event.note.state == NoteState.Ref) {
        const noteLoading = noteRefToLoading(event.note);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteLoading),
            selectedNoteId: noteLoading.id,
            editorState: EditorState.Inactive, // TODO: review at which moment this should happen
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
          editorState: EditorState.Inactive, // TODO: review at which moment this should happen
        },
      };
      return JustStateAuthenticated(newState);
    }
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

export const handleNoteTitleUpdated = (
  state: AppStateAuthenticated,
  event: NoteTitleUpdatedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Loaded) {
      if (note.title !== event.newTitle) {
        const noteRenaming = noteLoadedToRenaming(note, event.newTitle);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteRenaming),
          },
        };
        return [newState, RenameNote(noteRenaming)];
      }
    }

    if (note && note.state == NoteState.New) {
      if (event.newTitle != "") {
        const noteCreatingFromTitle = noteNewToCreatingFromTitle(
          note,
          event.newTitle
        );
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteCreatingFromTitle),
          },
        };
        return [newState, CreateNewNoteWithTitle(noteCreatingFromTitle)];
      }
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteRenamed = (
  state: AppStateAuthenticated,
  event: NoteRenamedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Renaming) {
      const noteLoaded = noteRenamingToLoaded(note, event.newPath);
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

export const handleEditNoteRequested = (
  state: AppStateAuthenticated,
  event: EditNoteRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.editorState == EditorState.Inactive) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editorState: isMarkdownNote(event.note)
            ? EditorState.EditingAsMarkdown
            : EditorState.EditingAsPlainText,
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleFailedToInitializeMarkdownEditor = (
  state: AppStateAuthenticated
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.editorState == EditorState.EditingAsMarkdown) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editorState: EditorState.EditingAsPlainText,
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleCancelNoteEditRequested = (
  state: AppStateAuthenticated
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (
      state.noteList.editorState == EditorState.EditingAsMarkdown ||
      state.noteList.editorState == EditorState.EditingAsPlainText
    ) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editorState: EditorState.Inactive,
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteSaveTextRequested = (
  state: AppStateAuthenticated,
  event: NoteSaveTextRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);
    const newText = sanitizeMilkdownWeirdStuff(event.newText);

    // TODO: make sure to handle all possible note states properly
    if (note && note.state == NoteState.Loaded) {
      if (note.text !== newText) {
        const noteSavingText = noteLoadedToSavingText(note, newText);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteSavingText),
            editorState: EditorState.Inactive,
          },
        };
        return [newState, SaveNoteText(noteSavingText)];
      } else {
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            editorState: EditorState.Inactive,
          },
        };
        return JustStateAuthenticated(newState);
      }
    }

    if (note && note.state == NoteState.New) {
      if (newText != "") {
        const noteCreatingFromText = noteNewToCreatingFromText(note, newText);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteCreatingFromText),
            editorState: EditorState.Inactive,
          },
        };
        return [newState, CreateNewNoteWithText(noteCreatingFromText)];
      } else {
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            editorState: EditorState.Inactive,
          },
        };
        return JustStateAuthenticated(newState);
      }
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteTextSaved = (
  state: AppStateAuthenticated,
  event: NoteTextSavedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.SavingText) {
      const noteLoaded = noteSavingTextToLoaded(note);
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
        editorState: EditorState.Inactive,
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

    if (note && note.state == NoteState.CreatingFromTitle) {
      const noteCreated = noteCreatingFromTitleToLoaded(note, event.path);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteCreated),
        },
      };
      return JustStateAuthenticated(newState);
    }

    if (note && note.state == NoteState.CreatingFromText) {
      const noteCreated = noteCreatingFromTextToLoaded(note, event.path);
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

export const handleNoteRestoredOnNewPath = (
  state: AppStateAuthenticated,
  event: NoteRestoredOnNewPathEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Restoring) {
      const noteLoaded = noteRestoringToLoadedWithNewPath(note, event.path);
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
