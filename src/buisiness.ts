import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import { LoadNoteText, RetrieveFileList } from "./commands/storage";
import { getTitleFromPath } from "./conversion";
import {
  NoteSelectedEvent,
  RetrieveFileListSuccessEvent,
  UserAuthenticatedEvent,
} from "./events";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  NoteListState,
  NoteState,
} from "./model";

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
      notes: event.fileList.map((f) => ({
        state: NoteState.Ref,
        id: "TODO",
        path: f,
        title: getTitleFromPath(f),
      })),
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
    const newState: AppStateAuthenticated = {
      ...state,
      noteList: {
        ...state.noteList,
        selectedNote: event.note,
      },
    };
    return [newState, LoadNoteText(event.note)];
  }

  return JustStateAuthenticated(state);
};
