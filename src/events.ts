import { Note, NoteLoading } from "./model";

// TODO: maybe I'll need separate events for the case path changes

export enum EventType {
  // "Never" event is never triggered in the app
  // this is just to make TS happy
  Never,

  UserAuthenticated,
  UserSessionCreated,

  RetrieveFileListSuccess,

  SearchTextUpdated,

  NoteSelected,

  LoadNoteTextSuccess,
  NoteLoadFailed,

  NoteTitleUpdated,
  NoteRenamed,

  EditNoteRequested,

  NoteSaveTextRequested,
  NoteTextSaved,

  CreateNoteRequested,
  NoteCreated,

  DeleteNoteRequested,
  NoteDeleted,

  RestoreNoteRequested,
  NoteRestored,

  RestApiError,
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

export interface RetrieveFileListSuccessEvent {
  type: EventType.RetrieveFileListSuccess;
  fileList: string[];
}

export interface SearchTextUpdatedEvent {
  type: EventType.SearchTextUpdated;
  searchText: string;
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

export interface NoteLoadFailedEvent {
  type: EventType.NoteLoadFailed;
  note: NoteLoading;
  err: string;
}

export interface NoteTitleUpdatedEvent {
  type: EventType.NoteTitleUpdated;
}

export interface NoteRenamedEvent {
  type: EventType.NoteRenamed;
}

export interface EditNoteRequestedEvent {
  type: EventType.EditNoteRequested;
}

export interface NoteSaveTextRequestedEvent {
  type: EventType.NoteSaveTextRequested;
}

export interface NoteTextSavedEvent {
  type: EventType.NoteTextSaved;
}

export interface CreateNoteRequestedEvent {
  type: EventType.CreateNoteRequested;
}

export interface NoteCreatedEvent {
  type: EventType.NoteCreated;
  noteId: string;
  path: string;
}

export interface DeleteNoteRequestedEvent {
  type: EventType.DeleteNoteRequested;
  noteId: string;
}

export interface NoteDeletedEvent {
  type: EventType.NoteDeleted;
  noteId: string;
}

export interface RestoreNoteRequestedEvent {
  type: EventType.RestoreNoteRequested;
  noteId: string;
}

export interface NoteRestoredEvent {
  type: EventType.NoteRestored;
  noteId: string;
}

export interface RestApiErrorEvent {
  type: EventType.RestApiError;
  err: string;
}

export type AppEvent =
  | NeverEvent
  | UserAuthenticatedEvent
  | UserSessionCreatedEvent
  | RetrieveFileListSuccessEvent
  | SearchTextUpdatedEvent
  | NoteSelectedEvent
  | LoadNoteTextSuccessEvent
  | NoteLoadFailedEvent
  | NoteTitleUpdatedEvent
  | NoteRenamedEvent
  | EditNoteRequestedEvent
  | NoteSaveTextRequestedEvent
  | NoteTextSavedEvent
  | CreateNoteRequestedEvent
  | NoteCreatedEvent
  | DeleteNoteRequestedEvent
  | NoteDeletedEvent
  | RestoreNoteRequestedEvent
  | NoteRestoredEvent
  | RestApiErrorEvent;
