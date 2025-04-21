import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import {
  ConvertToMarkdown,
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
  ConvertToMarkdownRequestedEvent,
  DeleteNoteRequestedEvent,
  DiscardNoteErrorRequestedEvent,
  EditNoteRequestedEvent,
  FailedToCreateNoteFromTextEvent,
  FailedToCreateNoteFromTitleEvent,
  FailedToDeleteNoteEvent,
  FailedToInitializeMarkdownEditorEvent,
  FailedToLoadNoteEvent,
  FailedToRenameNoteEvent,
  FailedToRestoreNoteEvent,
  FailedToRetrieveFileListEvent,
  FailedToSaveNoteTextEvent,
  LoadNoteTextSuccessEvent,
  NoteConvertedToMarkdownEvent,
  NoteCreatedEvent,
  NoteDeletedEvent,
  NoteFailedToConvertToMarkdownEvent,
  NoteRenamedEvent,
  NoteRestoredEvent,
  NoteRestoredOnNewPathEvent,
  NoteSaveTextRequestedEvent,
  NoteSelectedEvent,
  NoteTextSavedEvent,
  NoteTitleUpdatedEvent,
  RestoreNoteRequestedEvent,
  RetrieveFileListSuccessEvent,
  RetryLoadingNoteRequestedEvent,
  RetryNoteErrorRequestedEvent,
  SearchTextUpdatedEvent,
  SortingOrderUpdatedEvent,
  SwitchEditorToMarkdownRequestedEvent,
  SwitchEditorToTextRequestedEvent,
  UserAuthenticatedEvent,
} from "./events";
import { sanitizeMilkdownWeirdStuff } from "./mdformatting";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  EditorState,
  Maybe,
  MaybeOfNone,
  MaybeOfSome,
  Note,
  NoteListState,
  NoteState,
  SortingOrder,
} from "./model";
import {
  createNewNote,
  createNewNoteRef,
  noteConvertingToMarkdownToFailedToConvertToMarkdown,
  noteConvertingToMarkdownToLoaded,
  noteCreatingFromTextToFailedToCreateFromText,
  noteCreatingFromTextToLoaded,
  noteCreatingFromTitleToFailedToCreateFromTitle,
  noteCreatingFromTitleToLoaded,
  noteDeletedToRestoring,
  noteDeletingToDeleted,
  noteDeletingToFailedToDelete,
  noteFailedToConvertToMarkdownToConvertingToMarkdown,
  noteFailedToConvertToMarkdownToLoaded,
  noteFailedToCreateFromTextToCreatingFromText,
  noteFailedToCreateFromTextToNew,
  noteFailedToCreateFromTitleToCreatingFromTitle,
  noteFailedToCreateFromTitleToNew,
  noteFailedToDeleteToDeleting,
  noteFailedToDeleteToLoaded,
  noteFailedToLoadToLoading,
  noteFailedToRenameToLoaded,
  noteFailedToRenameToRenaming,
  noteFailedToRestoreToDeleted,
  noteFailedToRestoreToRestoring,
  noteFailedToSaveTextToLoaded,
  noteFailedToSaveTextToSavingText,
  noteLoadedToConvertingToMarkdown,
  noteLoadedToDeleting,
  noteLoadedToRenaming,
  noteLoadedToSavingText,
  noteLoadingToFailedToLoad,
  noteLoadingToLoaded,
  noteNewToCreatingFromText,
  noteNewToCreatingFromTitle,
  noteRefToLoading,
  noteRenamingToFailedToRename,
  noteRenamingToLoaded,
  noteRestoringToFailedToRestore,
  noteRestoringToLoaded,
  noteRestoringToLoadedWithNewPath,
  noteSavingTextToFailedToSaveText,
  noteSavingTextToLoaded,
} from "./noteLifecycle";

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

// Here I ignore the draft, if any. Draft is handled using editor state
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

export const sort = (notes: Note[], sortingOrder: SortingOrder) => {
  if (sortingOrder == SortingOrder.Alphabetic) {
    notes.sort((a, b) =>
      getEffectiveTitle(a).localeCompare(getEffectiveTitle(b), undefined, {
        sensitivity: "base",
      })
    );
  } else {
    notes.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  return notes;
};

export const filter = (notes: Note[], searchText: string) => {
  if (notes.length == 0) {
    return notes;
  }

  const tokens = searchText.split(" ");

  const containsAll = (text: string, tokens: string[]) => {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!text.includes(token)) {
        return false;
      }
    }
    return true;
  };

  return notes.filter((x) =>
    containsAll(getEffectiveTitle(x).toLowerCase(), tokens)
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

export const canConvertToMarkdown = (note: Note) => {
  if (note.state == NoteState.Loaded && !isMarkdownNote(note)) {
    return true;
  }
  return false;
};

export const getDraft = (note: Note): Maybe<string> => {
  // TODO: all states
  if (
    note.state == NoteState.Ref ||
    note.state == NoteState.Loading ||
    note.state == NoteState.FailedToLoad
  ) {
    return note.draft;
  }

  return MaybeOfNone;
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
      notes: sort(
        event.fileList.map((f, idx) =>
          // TODO: restore draft
          createNewNoteRef(idx, f.fileName, f.lastModified, MaybeOfNone)
        ),
        SortingOrder.Alphabetic
      ),
      sortingOrder: SortingOrder.Alphabetic,
      selectedNoteId: "",
      searchText: "",
      editor: { state: EditorState.Inactive, draft: MaybeOfNone },
    },
  };
  return JustStateAuthenticated(newState);
};

export const handleFailedToRetrieveFileList = (
  event: FailedToRetrieveFileListEvent
): [AppStateAuthenticated, AppCommand] => {
  const newState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    noteList: {
      state: NoteListState.FailedToRetrieve,
      err: event.err,
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

export const handleSortingOrderUpdated = (
  state: AppStateAuthenticated,
  event: SortingOrderUpdatedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        notes: sort(state.noteList.notes, event.sortingOrder),
        sortingOrder: event.sortingOrder,
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
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
          },
        };
        return [newState, LoadNoteText(noteLoading)];
      }
      // If failed to load -> trigger load
      if (event.note.state == NoteState.FailedToLoad) {
        const noteLoading = noteFailedToLoadToLoading(event.note);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteLoading),
            selectedNoteId: noteLoading.id,
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
          },
        };
        return [newState, LoadNoteText(noteLoading)];
      }

      // Otherwise -> simply update selection
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          selectedNoteId: event.note.id,
          editor: { state: EditorState.Inactive, draft: getDraft(event.note) },
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleRetryLoadingNoteRequested = (
  state: AppStateAuthenticated,
  event: RetryLoadingNoteRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.FailedToLoad) {
      const noteLoading = noteFailedToLoadToLoading(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoading),
        },
      };
      return [newState, LoadNoteText(noteLoading)];
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

export const handleFailedToLoadNote = (
  state: AppStateAuthenticated,
  event: FailedToLoadNoteEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (event.note.state == NoteState.Loading) {
      const noteFailedToLoad = noteLoadingToFailedToLoad(event.note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToLoad),
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

export const handleFailedToRenameNote = (
  state: AppStateAuthenticated,
  event: FailedToRenameNoteEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Renaming) {
      const noteFailedToRename = noteRenamingToFailedToRename(note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToRename),
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
    if (state.noteList.editor.state == EditorState.Inactive) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editor: isMarkdownNote(event.note)
            ? {
                state: EditorState.EditingAsMarkdown,
                draft: getDraft(event.note),
              }
            : {
                state: EditorState.EditingAsPlainText,
                draft: getDraft(event.note),
              },
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleFailedToInitializeMarkdownEditor = (
  state: AppStateAuthenticated,
  event: FailedToInitializeMarkdownEditorEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.editor.state == EditorState.EditingAsMarkdown) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editor: {
            state: EditorState.EditingAsPlainText,
            draft: getDraft(event.note),
          },
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
      state.noteList.editor.state == EditorState.EditingAsMarkdown ||
      state.noteList.editor.state == EditorState.EditingAsPlainText
    ) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          // TODO: also remove from local storage
          editor: { state: EditorState.Inactive, draft: MaybeOfNone },
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

    if (note && note.state == NoteState.Loaded) {
      if (note.text !== newText) {
        const noteSavingText = noteLoadedToSavingText(note, newText);
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            notes: replace(state.noteList.notes, noteSavingText),
            // TODO: clear draft in local storage
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
          },
        };
        return [newState, SaveNoteText(noteSavingText)];
      } else {
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            // TODO: clear draft in local storage
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
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
            // TODO: clear draft in local storage
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
          },
        };
        return [newState, CreateNewNoteWithText(noteCreatingFromText)];
      } else {
        const newState: AppStateAuthenticated = {
          ...state,
          noteList: {
            ...state.noteList,
            // TODO: clear draft in local storage
            editor: { state: EditorState.Inactive, draft: MaybeOfNone },
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

export const handleFailedToSaveNoteText = (
  state: AppStateAuthenticated,
  event: FailedToSaveNoteTextEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.SavingText) {
      const noteFailedToSaveText = noteSavingTextToFailedToSaveText(
        note,
        event.err
      );
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToSaveText),
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
    const newNote = createNewNote(
      state.noteList.lastUsedNoteId + 1,
      // TODO: this is a side effect, proper way to do it would be by creating this note in a command
      new Date(),
      // TODO: restore draft
      MaybeOfNone
    );
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        lastUsedNoteId: state.noteList.lastUsedNoteId + 1,
        notes: [newNote, ...state.noteList.notes],
        selectedNoteId: newNote.id,
        editor: { state: EditorState.Inactive, draft: MaybeOfNone },
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

export const handleFailedToCreateNoteFromTitle = (
  state: AppStateAuthenticated,
  event: FailedToCreateNoteFromTitleEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.CreatingFromTitle) {
      const noteFailedToCreateFromTitle =
        noteCreatingFromTitleToFailedToCreateFromTitle(note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToCreateFromTitle),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleFailedToCreateNoteFromText = (
  state: AppStateAuthenticated,
  event: FailedToCreateNoteFromTextEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.CreatingFromText) {
      const noteFailedToCreateFromText =
        noteCreatingFromTextToFailedToCreateFromText(note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToCreateFromText),
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

    if (note && note.state == NoteState.New) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: state.noteList.notes.filter((x) => x.id != note.id),
        },
      };
      return JustStateAuthenticated(newState);
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

export const handleFailedToDeleteNote = (
  state: AppStateAuthenticated,
  event: FailedToDeleteNoteEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Deleting) {
      const noteFailedToDelete = noteDeletingToFailedToDelete(note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToDelete),
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

export const handleFailedToRestoreNote = (
  state: AppStateAuthenticated,
  event: FailedToRestoreNoteEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Restoring) {
      const noteFailedToRestore = noteRestoringToFailedToRestore(
        note,
        event.err
      );
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToRestore),
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

export const handleConvertToMarkdownRequested = (
  state: AppStateAuthenticated,
  event: ConvertToMarkdownRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.Loaded && !isMarkdownNote(note)) {
      const noteConvertingToMarkdown = noteLoadedToConvertingToMarkdown(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteConvertingToMarkdown),
        },
      };
      return [newState, ConvertToMarkdown(noteConvertingToMarkdown)];
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteConvertedToMarkdown = (
  state: AppStateAuthenticated,
  event: NoteConvertedToMarkdownEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.ConvertingToMarkdown) {
      const noteLoaded = noteConvertingToMarkdownToLoaded(
        note,
        event.newPath,
        event.newText
      );
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

export const handleNoteFailedToConvertToMarkdown = (
  state: AppStateAuthenticated,
  event: NoteFailedToConvertToMarkdownEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.ConvertingToMarkdown) {
      const noteFailedToConvertToMarkdown =
        noteConvertingToMarkdownToFailedToConvertToMarkdown(note, event.err);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteFailedToConvertToMarkdown),
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleSwitchEditorToMarkdownRequested = (
  state: AppStateAuthenticated,
  event: SwitchEditorToMarkdownRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.editor.state == EditorState.EditingAsPlainText) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editor: {
            state: EditorState.EditingAsMarkdown,
            draft: MaybeOfSome(event.text),
          },
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleSwitchEditorToTextRequested = (
  state: AppStateAuthenticated,
  event: SwitchEditorToTextRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    if (state.noteList.editor.state == EditorState.EditingAsMarkdown) {
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          editor: {
            state: EditorState.EditingAsPlainText,
            draft: MaybeOfSome(event.text),
          },
        },
      };
      return JustStateAuthenticated(newState);
    }
  }

  return JustStateAuthenticated(state);
};

export const handleRetryNoteErrorRequested = (
  state: AppStateAuthenticated,
  event: RetryNoteErrorRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.FailedToRename) {
      const noteRenaming = noteFailedToRenameToRenaming(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteRenaming),
        },
      };
      return [newState, RenameNote(noteRenaming)];
    }
    if (note && note.state == NoteState.FailedToSaveText) {
      const noteSavingText = noteFailedToSaveTextToSavingText(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteSavingText),
        },
      };
      return [newState, SaveNoteText(noteSavingText)];
    }
    if (note && note.state == NoteState.FailedToDelete) {
      const noteDeleting = noteFailedToDeleteToDeleting(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteDeleting),
        },
      };
      return [newState, DeleteNote(noteDeleting)];
    }
    if (note && note.state == NoteState.FailedToRestore) {
      const noteRestoring = noteFailedToRestoreToRestoring(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteRestoring),
        },
      };
      return [newState, RestoreNote(noteRestoring)];
    }
    if (note && note.state == NoteState.FailedToCreateFromTitle) {
      const noteCreatingFromTitle =
        noteFailedToCreateFromTitleToCreatingFromTitle(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteCreatingFromTitle),
        },
      };
      return [newState, CreateNewNoteWithTitle(noteCreatingFromTitle)];
    }
    if (note && note.state == NoteState.FailedToCreateFromText) {
      const noteCreatingFromText =
        noteFailedToCreateFromTextToCreatingFromText(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteCreatingFromText),
        },
      };
      return [newState, CreateNewNoteWithText(noteCreatingFromText)];
    }
    if (note && note.state == NoteState.FailedToConvertToMarkdown) {
      const noteConvertingToMarkdown =
        noteFailedToConvertToMarkdownToConvertingToMarkdown(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteConvertingToMarkdown),
        },
      };
      return [newState, ConvertToMarkdown(noteConvertingToMarkdown)];
    }
  }

  return JustStateAuthenticated(state);
};

export const handleNoteDiscardNoteErrorRequested = (
  state: AppStateAuthenticated,
  event: DiscardNoteErrorRequestedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    const note = getNote(state.noteList.notes, event.noteId);

    if (note && note.state == NoteState.FailedToRename) {
      const noteLoaded = noteFailedToRenameToLoaded(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToSaveText) {
      const noteLoaded = noteFailedToSaveTextToLoaded(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToDelete) {
      const noteLoaded = noteFailedToDeleteToLoaded(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoaded),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToRestore) {
      const noteDeleted = noteFailedToRestoreToDeleted(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteDeleted),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToCreateFromTitle) {
      const noteNew = noteFailedToCreateFromTitleToNew(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteNew),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToCreateFromText) {
      const noteNew = noteFailedToCreateFromTextToNew(note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteNew),
        },
      };
      return JustStateAuthenticated(newState);
    }
    if (note && note.state == NoteState.FailedToConvertToMarkdown) {
      const noteLoaded = noteFailedToConvertToMarkdownToLoaded(note);
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
