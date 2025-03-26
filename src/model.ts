export enum FileListState {
  Retrieving,
  Retrieved,
}

export interface FileListRetrieving {
  state: FileListState.Retrieving;
}

export interface FileListRetrieved {
  state: FileListState.Retrieved;
  files: string[];
}

export type FileList = FileListRetrieving | FileListRetrieved;

// App state

export enum AuthenticationStatus {
  Unauthenticated,
  Authenticated,
}

export interface AppStateUnauthenticated {
  auth: AuthenticationStatus.Unauthenticated;
}

export interface AppStateAuthenticated {
  auth: AuthenticationStatus.Authenticated;
  fileList: FileList;
}

export type AppState = AppStateUnauthenticated | AppStateAuthenticated;

// Initial state

export const IntialState: AppState = {
  auth: AuthenticationStatus.Unauthenticated,
};
