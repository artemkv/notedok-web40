// note editor

// TODO: rethink all of it

export enum NoteEditorState {
  Inactive,
  LoadingNoteContent,
  EditingNote,
}

export interface NoteEditorInactive {
  state: NoteEditorState.Inactive;
}

export interface NoteEditorLoadingNoteContent {
  state: NoteEditorState.LoadingNoteContent;
  note: Note;
}

export interface NoteEditorEditingNote {
  state: NoteEditorState.EditingNote;
  note: Note;
  text: string;
}

export type NoteEditor =
  | NoteEditorInactive
  | NoteEditorLoadingNoteContent
  | NoteEditorEditingNote;

// file list

export interface Note {
  path: string;
  title: string;
}

export enum NoteListState {
  Retrieving,
  Retrieved,
}

export interface NoteListRetrieving {
  state: NoteListState.Retrieving;
}

export interface NoteListRetrieved {
  state: NoteListState.Retrieved;
  notes: Note[];
  selectedNote: Note | undefined;
  noteEditor: NoteEditor;
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
