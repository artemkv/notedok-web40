import { AppCommand, DoMany, DoNothing } from "./commands";
import { ScheduleIdTokenRefresh, StartUserSession } from "./commands/auth";
import { RetrieveFileList } from "./commands/storage";
import { RetrieveFileListSuccessEvent, UserAuthenticatedEvent } from "./events";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
  FileListState,
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
    fileList: {
      state: FileListState.Retrieving,
    },
  };

  return [newState, DoMany([RetrieveFileList(), ScheduleIdTokenRefresh()])];
};

export const handleRetrieveFileListSuccess = (
  event: RetrieveFileListSuccessEvent
): [AppStateAuthenticated, AppCommand] => {
  const newState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    fileList: {
      state: FileListState.Retrieved,
      files: event.fileList,
    },
  };
  return JustStateAuthenticated(newState);
};
