// Note States

export enum NoteState {
  Ref,
  Loading,
  Loaded,
  FailedToLoad,
  Saving,
  FailedToSave,
  Deleting,
  Deleted,
  FailedToDelete,
  Restoring,
  FailedToRestore,
  New,
  Creating,
  FailedToCreate,
  NoteLoading,
}

export interface NoteRef {
  state: NoteState.Ref;

  id: string;
  path: string;
  title: string;
}

export interface NoteLoading {
  state: NoteState.Loading;

  id: string;
  path: string;
  title: string;
}

export interface NoteLoaded {
  state: NoteState.Loaded;

  id: string;
  path: string;
  title: string;
  text: string;
}

export interface NoteFailedToLoad {
  state: NoteState.FailedToLoad;

  id: string;
  path: string;
  title: string;

  err: string;
}

export interface NoteSaving {
  state: NoteState.Saving;

  id: string;
  path: string;
  title: string;
  text: string;

  newTitle: string;
  newText: string;
}

export interface NoteFailedToSave {
  state: NoteState.FailedToSave;

  id: string;
  path: string;
  title: string;
  text: string;

  newTitle: string;
  newText: string;

  err: string;
}

export interface NoteDeleting {
  state: NoteState.Deleting;

  id: string;
  path: string;
  title: string;
  text: string;
}

export interface NoteDeleted {
  state: NoteState.Deleted;

  id: string;
  path: string;
  title: string;
  text: string;
}

export interface NoteFailedToDelete {
  state: NoteState.FailedToDelete;

  id: string;
  path: string;
  title: string;
  text: string;

  err: string;
}

export interface NoteRestoring {
  state: NoteState.Restoring;

  id: string;
  path: string;
  title: string;
  text: string;
}

export interface NoteFailedToRestore {
  state: NoteState.FailedToRestore;

  id: string;
  path: string;
  title: string;
  text: string;

  err: string;
}

export interface NoteNew {
  state: NoteState.New;

  id: string;
}

export interface NoteCreating {
  state: NoteState.Creating;

  id: string;
  title: string;
  text: string;
}

export interface NoteFailedToCreate {
  state: NoteState.FailedToCreate;

  id: string;
  title: string;
  text: string;
}

export type Note =
  | NoteRef
  | NoteLoading
  | NoteLoaded
  | NoteFailedToLoad
  | NoteSaving
  | NoteFailedToSave
  | NoteDeleting
  | NoteDeleted
  | NoteFailedToDelete
  | NoteRestoring
  | NoteFailedToRestore
  | NoteNew
  | NoteCreating
  | NoteFailedToCreate;

export type NoteEditable =
  | NoteLoaded
  | NoteSaving
  | NoteFailedToSave
  | NoteFailedToDelete
  | NoteNew
  | NoteCreating
  | NoteFailedToCreate;

export const isNoteEditable = (note: Note) => {
  return (
    note.state == NoteState.Loaded ||
    note.state == NoteState.Saving ||
    note.state == NoteState.FailedToSave ||
    note.state == NoteState.FailedToDelete ||
    note.state == NoteState.New ||
    note.state == NoteState.Creating ||
    note.state == NoteState.FailedToCreate
  );
};

// Note List

export enum NoteListState {
  Retrieving,
  Retrieved,
}

export interface NoteListRetrieving {
  state: NoteListState.Retrieving;
}

export interface NoteListRetrieved {
  state: NoteListState.Retrieved;
  lastUsedNoteId: number;
  notes: Note[];
  selectedNoteId: string;
}

export type NoteList = NoteListRetrieving | NoteListRetrieved;

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
  noteList: NoteList;
}

export type AppState = AppStateUnauthenticated | AppStateAuthenticated;

// Initial state

export const IntialState: AppState = {
  auth: AuthenticationStatus.Unauthenticated,
};
