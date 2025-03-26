import { Note } from "./model";

export enum EventType {
  // "Never" event is never triggered in the app
  // this is just to make TS happy
  Never,

  UserAuthenticated,
  UserSessionCreated,

  RetrieveFileListSuccess,

  NoteSelected,

  LoadNoteTextSuccess,
  NoteLoadFailed,

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

export interface NoteSelectedEvent {
  type: EventType.NoteSelected;
  note: Note;
}

export interface LoadNoteTextSuccessEvent {
  type: EventType.LoadNoteTextSuccess;
  note: Note;
  text: string;
}

export interface NoteLoadFailedEvent {
  type: EventType.NoteLoadFailed;
  note: Note;
  err: string;
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
  | NoteSelectedEvent
  | LoadNoteTextSuccessEvent
  | NoteLoadFailedEvent
  | RestApiErrorEvent;
