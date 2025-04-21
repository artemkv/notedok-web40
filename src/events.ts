import { Note, NoteLoading, SortingOrder } from "./model";

export enum EventType {
  // "Never" event is never triggered in the app
  // this is just to make TS happy
  Never,

  UserAuthenticated,
  UserSessionCreated,

  RetrieveFileListSuccess,
  FailedToRetrieveFileList,

  SearchTextUpdated,
  SortingOrderUpdated,

  NoteSelected,

  LoadNoteTextSuccess,
  FailedToLoadNote,
  RetryLoadingNoteRequested,

  NoteTitleUpdated,
  NoteRenamed,
  FailedToRenameNote,

  EditNoteRequested,
  FailedToInitializeMarkdownEditor,
  CancelNoteEditRequested,
  NoteSaveTextRequested,
  NoteTextSaved,
  FailedToSaveNoteText,

  CreateNoteRequested,
  NoteCreated,
  FailedToCreateNoteFromTitle,
  FailedToCreateNoteFromText,

  EditorCurrentStateReport,

  DeleteNoteRequested,
  NoteDeleted,
  FailedToDeleteNote,

  RestoreNoteRequested,
  NoteRestored,
  NoteRestoredOnNewPath,
  FailedToRestoreNote,

  ConvertToMarkdownRequested,
  NoteConvertedToMarkdown,
  NoteFailedToConvertToMarkdown,

  SwitchEditorToMarkdownRequested,
  SwitchEditorToTextRequested,

  RetryNoteErrorRequested,
  DiscardNoteErrorRequested,
}

export interface NeverEvent {
  type: EventType.Never;
}

export interface UserAuthenticatedEvent {
  type: EventType.UserAuthenticated;
  idToken: string;
}

export interface UserSessionCreatedEvent {
  type: EventType.UserSessionCreated;
}

export type FileInfo = {
  fileName: string;
  lastModified: Date;
};

export interface RetrieveFileListSuccessEvent {
  type: EventType.RetrieveFileListSuccess;
  fileList: FileInfo[];
}

export interface FailedToRetrieveFileListEvent {
  type: EventType.FailedToRetrieveFileList;
  err: string;
}

export interface SearchTextUpdatedEvent {
  type: EventType.SearchTextUpdated;
  searchText: string;
}

export interface SortingOrderUpdatedEvent {
  type: EventType.SortingOrderUpdated;
  sortingOrder: SortingOrder;
}

export interface NoteSelectedEvent {
  type: EventType.NoteSelected;
  note: Note;
}

export interface LoadNoteTextSuccessEvent {
  type: EventType.LoadNoteTextSuccess;
  note: NoteLoading;
  text: string;
}

export interface FailedToLoadNoteEvent {
  type: EventType.FailedToLoadNote;
  note: NoteLoading;
  err: string;
}

export interface RetryLoadingNoteRequestedEvent {
  type: EventType.RetryLoadingNoteRequested;
  noteId: string;
}

export interface NoteTitleUpdatedEvent {
  type: EventType.NoteTitleUpdated;
  noteId: string;
  newTitle: string;
}

export interface NoteRenamedEvent {
  type: EventType.NoteRenamed;
  noteId: string;
  newPath: string;
}

export interface FailedToRenameNoteEvent {
  type: EventType.FailedToRenameNote;
  noteId: string;
  err: string;
}

export interface EditNoteRequestedEvent {
  type: EventType.EditNoteRequested;
  note: Note;
}

export interface FailedToInitializeMarkdownEditorEvent {
  type: EventType.FailedToInitializeMarkdownEditor;
  note: Note;
}

export interface CancelNoteEditRequestedEvent {
  type: EventType.CancelNoteEditRequested;
}

export interface NoteSaveTextRequestedEvent {
  type: EventType.NoteSaveTextRequested;
  noteId: string;
  newText: string;
}

export interface NoteTextSavedEvent {
  type: EventType.NoteTextSaved;
  noteId: string;
}

export interface FailedToSaveNoteTextEvent {
  type: EventType.FailedToSaveNoteText;
  noteId: string;
  err: string;
}

export interface CreateNoteRequestedEvent {
  type: EventType.CreateNoteRequested;
}

export interface NoteCreatedEvent {
  type: EventType.NoteCreated;
  noteId: string;
  path: string;
}

export interface FailedToCreateNoteFromTitleEvent {
  type: EventType.FailedToCreateNoteFromTitle;
  noteId: string;
  err: string;
}

export interface FailedToCreateNoteFromTextEvent {
  type: EventType.FailedToCreateNoteFromText;
  noteId: string;
  err: string;
}

export interface EditorCurrentStateReportEvent {
  type: EventType.EditorCurrentStateReport;
  noteId: string;
  text: string;
}

export interface DeleteNoteRequestedEvent {
  type: EventType.DeleteNoteRequested;
  noteId: string;
}

export interface NoteDeletedEvent {
  type: EventType.NoteDeleted;
  noteId: string;
}

export interface FailedToDeleteNoteEvent {
  type: EventType.FailedToDeleteNote;
  noteId: string;
  err: string;
}

export interface RestoreNoteRequestedEvent {
  type: EventType.RestoreNoteRequested;
  noteId: string;
}

export interface NoteRestoredEvent {
  type: EventType.NoteRestored;
  noteId: string;
}

export interface NoteRestoredOnNewPathEvent {
  type: EventType.NoteRestoredOnNewPath;
  noteId: string;
  path: string;
}

export interface FailedToRestoreNoteEvent {
  type: EventType.FailedToRestoreNote;
  noteId: string;
  err: string;
}

export interface ConvertToMarkdownRequestedEvent {
  type: EventType.ConvertToMarkdownRequested;
  noteId: string;
}

export interface NoteConvertedToMarkdownEvent {
  type: EventType.NoteConvertedToMarkdown;
  noteId: string;
  newPath: string;
  newText: string;
}

export interface NoteFailedToConvertToMarkdownEvent {
  type: EventType.NoteFailedToConvertToMarkdown;
  noteId: string;
  err: string;
}

export interface SwitchEditorToMarkdownRequestedEvent {
  type: EventType.SwitchEditorToMarkdownRequested;
  text: string;
}

export interface SwitchEditorToTextRequestedEvent {
  type: EventType.SwitchEditorToTextRequested;
  text: string;
}

export interface RetryNoteErrorRequestedEvent {
  type: EventType.RetryNoteErrorRequested;
  noteId: string;
}

export interface DiscardNoteErrorRequestedEvent {
  type: EventType.DiscardNoteErrorRequested;
  noteId: string;
}

export type AppEvent =
  | NeverEvent
  | UserAuthenticatedEvent
  | UserSessionCreatedEvent
  | RetrieveFileListSuccessEvent
  | FailedToRetrieveFileListEvent
  | SearchTextUpdatedEvent
  | SortingOrderUpdatedEvent
  | NoteSelectedEvent
  | LoadNoteTextSuccessEvent
  | FailedToLoadNoteEvent
  | RetryLoadingNoteRequestedEvent
  | NoteTitleUpdatedEvent
  | NoteRenamedEvent
  | FailedToRenameNoteEvent
  | EditNoteRequestedEvent
  | FailedToInitializeMarkdownEditorEvent
  | CancelNoteEditRequestedEvent
  | NoteSaveTextRequestedEvent
  | NoteTextSavedEvent
  | FailedToSaveNoteTextEvent
  | CreateNoteRequestedEvent
  | NoteCreatedEvent
  | FailedToCreateNoteFromTitleEvent
  | FailedToCreateNoteFromTextEvent
  | EditorCurrentStateReportEvent
  | DeleteNoteRequestedEvent
  | NoteDeletedEvent
  | FailedToDeleteNoteEvent
  | RestoreNoteRequestedEvent
  | NoteRestoredEvent
  | NoteRestoredOnNewPathEvent
  | FailedToRestoreNoteEvent
  | ConvertToMarkdownRequestedEvent
  | NoteConvertedToMarkdownEvent
  | NoteFailedToConvertToMarkdownEvent
  | SwitchEditorToMarkdownRequestedEvent
  | SwitchEditorToTextRequestedEvent
  | RetryNoteErrorRequestedEvent
  | DiscardNoteErrorRequestedEvent;
