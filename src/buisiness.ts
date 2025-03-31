import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import {
  LoadNoteText,
  RetrieveFileList,
  SaveChanges,
} from "./commands/storage";
import {
  LoadNoteTextSuccessEvent,
  NoteAllChangesSavedEvent,
  NoteReachedSavePointEvent,
  NoteSelectedEvent,
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
  createNewNoteRef,
  noteLoadedToSaving,
  noteLoadingToLoaded,
  noteRefToLoading,
  noteSavingToLoaded,
} from "./noteLifecycle";

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
        return [
          newState,
          SaveChanges(noteSaving.id, noteSaving.newTitle, noteSaving.newText),
        ];
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
