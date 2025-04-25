// Maybe

export enum MaybeType {
  None,
  Some,
}

export interface MaybeNone {
  type: MaybeType.None;
}

export interface MaybeSome<T> {
  type: MaybeType.Some;
  value: T;
}

export type Maybe<T> = MaybeNone | MaybeSome<T>;

export const None: MaybeNone = {
  type: MaybeType.None,
};

export const Some = <T>(value: T): MaybeSome<T> => ({
  type: MaybeType.Some,
  value,
});

// Note States

export enum NoteState {
  Ref,
  Loading,
  Loaded,
  FailedToLoad,
  SavingText,
  FailedToSaveText,
  Renaming,
  FailedToRename,
  Deleting,
  Deleted,
  FailedToDelete,
  Restoring,
  FailedToRestore,
  New,
  CreatingFromTitle,
  FailedToCreateFromTitle,
  CreatingFromText,
  FailedToCreateFromText,
  ConvertingToMarkdown,
  FailedToConvertToMarkdown,
}

// TODO: make draft optional

export interface NoteRef {
  state: NoteState.Ref;

  id: string;
  path: string;
  title: string;
  lastModified: Date;
  draft: Maybe<string>;
}

export interface NoteLoading {
  state: NoteState.Loading;

  id: string;
  path: string;
  title: string;
  lastModified: Date;
  draft: Maybe<string>;
}

export interface NoteLoaded {
  state: NoteState.Loaded;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
  draft: Maybe<string>;
}

export interface NoteFailedToLoad {
  state: NoteState.FailedToLoad;

  id: string;
  path: string;
  title: string;
  lastModified: Date;
  draft: Maybe<string>;

  err: string;
}

export interface NoteSavingText {
  state: NoteState.SavingText;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;

  newText: string;
}

export interface NoteFailedToSaveText {
  state: NoteState.FailedToSaveText;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;

  newText: string;

  err: string;
}

export interface NoteRenaming {
  state: NoteState.Renaming;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
  draft: Maybe<string>;

  newTitle: string;
}

export interface NoteFailedToRename {
  state: NoteState.FailedToRename;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
  draft: Maybe<string>;

  newTitle: string;

  err: string;
}

export interface NoteDeleting {
  state: NoteState.Deleting;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
}

export interface NoteDeleted {
  state: NoteState.Deleted;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
}

export interface NoteFailedToDelete {
  state: NoteState.FailedToDelete;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;

  err: string;
}

export interface NoteRestoring {
  state: NoteState.Restoring;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
}

export interface NoteFailedToRestore {
  state: NoteState.FailedToRestore;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;

  err: string;
}

export interface NoteNew {
  state: NoteState.New;

  id: string;
  lastModified: Date;
  draft: Maybe<string>;
}

export interface NoteCreatingFromTitle {
  state: NoteState.CreatingFromTitle;

  id: string;
  title: string;
  lastModified: Date;
  draft: Maybe<string>;
}

export interface NoteFailedToCreateFromTitle {
  state: NoteState.FailedToCreateFromTitle;

  id: string;
  title: string;
  lastModified: Date;
  draft: Maybe<string>;

  err: string;
}

export interface NoteCreatingFromText {
  state: NoteState.CreatingFromText;

  id: string;
  text: string;
  lastModified: Date;
}

export interface NoteFailedToCreateFromText {
  state: NoteState.FailedToCreateFromText;

  id: string;
  text: string;
  lastModified: Date;

  err: string;
}

// TODO: what to do with the draft when converting? just use it? prohibit converting?

export interface NoteConvertingToMarkdown {
  state: NoteState.ConvertingToMarkdown;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;
}

export interface NoteFailedToConvertToMarkdown {
  state: NoteState.FailedToConvertToMarkdown;

  id: string;
  path: string;
  title: string;
  text: string;
  lastModified: Date;

  err: string;
}

export type Note =
  | NoteRef
  | NoteLoading
  | NoteLoaded
  | NoteFailedToLoad
  | NoteSavingText
  | NoteFailedToSaveText
  | NoteRenaming
  | NoteFailedToRename
  | NoteDeleting
  | NoteDeleted
  | NoteFailedToDelete
  | NoteRestoring
  | NoteFailedToRestore
  | NoteNew
  | NoteCreatingFromTitle
  | NoteFailedToCreateFromTitle
  | NoteCreatingFromText
  | NoteFailedToCreateFromText
  | NoteConvertingToMarkdown
  | NoteFailedToConvertToMarkdown;

// Editor

export enum EditorState {
  Inactive,
  ReadOnly,
  EditingAsMarkdown,
  EditingAsPlainText,
}

export interface EditorInactive {
  state: EditorState.Inactive;
}

export interface EditorReadOnly {
  state: EditorState.ReadOnly;
  text: string;
}

export interface EditorEditingAsMarkdown {
  state: EditorState.EditingAsMarkdown;
  defaultText: string;
}

export interface EditorEditingAsPlainText {
  state: EditorState.EditingAsPlainText;
  defaultText: string;
}

export type Editor =
  | EditorInactive
  | EditorReadOnly
  | EditorEditingAsMarkdown
  | EditorEditingAsPlainText;

// Note List

export enum SortingOrder {
  Alphabetic,
  MostRecentFirst,
}

export enum NoteListState {
  Retrieving,
  Retrieved,
  FailedToRetrieve,
}

export interface NoteListRetrieving {
  state: NoteListState.Retrieving;
}

export interface NoteListRetrieved {
  state: NoteListState.Retrieved;
  searchText: string;
  sortingOrder: SortingOrder;
  lastUsedNoteId: number;
  notes: Note[];
  selectedNoteId: string;
  editor: Editor;
}

export interface NoteListFailedToRetrieve {
  state: NoteListState.FailedToRetrieve;
  err: string;
}

export type NoteList =
  | NoteListRetrieving
  | NoteListRetrieved
  | NoteListFailedToRetrieve;

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
