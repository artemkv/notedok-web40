import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import { LoadNoteText, RetrieveFileList } from "./commands/storage";
import {
  LoadNoteTextSuccessEvent,
  NoteSelectedEvent,
  RetrieveFileListSuccessEvent,
  UserAuthenticatedEvent,
} from "./events";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  Note,
  NoteListState,
  NoteState,
} from "./model";
import {
  createNewNoteRef,
  noteLoadingToLoaded,
  noteRefToLoading,
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
      selectedNote: undefined,
    },
  };
  return JustStateAuthenticated(newState);
};

export const handleNoteSelected = (
  state: AppStateAuthenticated,
  event: NoteSelectedEvent
): [AppStateAuthenticated, AppCommand] => {
  if (state.noteList.state == NoteListState.Retrieved) {
    // If ref -> load
    if (event.note.state == NoteState.Ref) {
      const noteLoading = noteRefToLoading(event.note);
      const newState: AppStateAuthenticated = {
        ...state,
        noteList: {
          ...state.noteList,
          notes: replace(state.noteList.notes, noteLoading),
          selectedNote: noteLoading,
        },
      };
      return [newState, LoadNoteText(noteLoading)];
    }

    // Not ref -> simply select
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        selectedNote: event.note,
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
          selectedNote: noteLoaded,
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
