import { AppEvent } from "./events";
import { Command } from "./hooks/useReducer";
import {
  Maybe,
  NoteConvertingToMarkdown,
  NoteConvertingToText,
  NoteCreatingFromText,
  NoteCreatingFromTitle,
  NoteDeleting,
  NoteFormat,
  NoteLoading,
  NoteRenaming,
  NoteRestoring,
  NoteSavingText,
} from "./model";

export enum CommandType {
  DoNothing,
  DoMany,
  CreateUserSession,
  ScheduleIdTokenRefresh,
  RetrieveFileList,
  LoadNoteText,

  CreateNewNoteWithTitle,
  CreateNewNoteWithText,
  RenameNote,
  SaveNoteText,
  DeleteNote,
  RestoreNote,

  UpdateExistingNoteDraft,
  UpdateNewNoteDraft,
  UpdateNoteDraftOnRename,
  UpdateNoteDraftOnCreate,
  DiscardNoteDraft,

  ConvertToMarkdown,
  ConvertToText,
}

export interface DoNothingCommand extends Command<AppEvent> {
  type: CommandType.DoNothing;
}

export interface DoManyCommand extends Command<AppEvent> {
  type: CommandType.DoMany;
  commands: AppCommand[];
}

export interface CreateUserSessionCommand extends Command<AppEvent> {
  type: CommandType.CreateUserSession;
  idToken: string;
}

export interface ScheduleIdTokenRefreshCommand extends Command<AppEvent> {
  type: CommandType.ScheduleIdTokenRefresh;
}

export interface RetrieveFileListCommand extends Command<AppEvent> {
  type: CommandType.RetrieveFileList;
}

export interface LoadNoteTextCommand extends Command<AppEvent> {
  type: CommandType.LoadNoteText;
  note: NoteLoading;
}

export interface CreateNewNoteWithTitleCommand extends Command<AppEvent> {
  type: CommandType.CreateNewNoteWithTitle;
  note: NoteCreatingFromTitle;
}

export interface CreateNewNoteWithTextCommand extends Command<AppEvent> {
  type: CommandType.CreateNewNoteWithText;
  note: NoteCreatingFromText;
}

export interface RenameNoteCommand extends Command<AppEvent> {
  type: CommandType.RenameNote;
  note: NoteRenaming;
}

export interface SaveNoteTextCommand extends Command<AppEvent> {
  type: CommandType.SaveNoteText;
  note: NoteSavingText;
}

export interface DeleteNoteCommand extends Command<AppEvent> {
  type: CommandType.DeleteNote;
  note: NoteDeleting;
}

export interface RestoreNoteCommand extends Command<AppEvent> {
  type: CommandType.RestoreNote;
  note: NoteRestoring;
}

export interface UpdateExistingNoteDraftCommand extends Command<AppEvent> {
  type: CommandType.UpdateExistingNoteDraft;
  key: string;
  draft: Maybe<string>;
}

export interface UpdateNewNoteDraftCommand extends Command<AppEvent> {
  type: CommandType.UpdateNewNoteDraft;
  key: string;
  timestamp: number;
  format: NoteFormat;
  draft: Maybe<string>;
}

export interface UpdateNoteDraftOnRenameCommand extends Command<AppEvent> {
  type: CommandType.UpdateNoteDraftOnRename;
  oldKey: string;
  newKey: string;
}

export interface UpdateNoteDraftOnCreateCommand extends Command<AppEvent> {
  type: CommandType.UpdateNoteDraftOnCreate;
  oldKey: string;
  newKey: string;
}

export interface DiscardNoteDraftCommand extends Command<AppEvent> {
  type: CommandType.DiscardNoteDraft;
  key: string;
  isNewNote: boolean;
}

export interface ConvertToMarkdownCommand extends Command<AppEvent> {
  type: CommandType.ConvertToMarkdown;
  note: NoteConvertingToMarkdown;
}

export interface ConvertToTextCommand extends Command<AppEvent> {
  type: CommandType.ConvertToText;
  note: NoteConvertingToText;
}

export type AppCommand =
  | DoNothingCommand
  | DoManyCommand
  | CreateUserSessionCommand
  | ScheduleIdTokenRefreshCommand
  | RetrieveFileListCommand
  | LoadNoteTextCommand
  | CreateNewNoteWithTitleCommand
  | CreateNewNoteWithTextCommand
  | RenameNoteCommand
  | SaveNoteTextCommand
  | DeleteNoteCommand
  | RestoreNoteCommand
  | UpdateExistingNoteDraftCommand
  | UpdateNewNoteDraftCommand
  | UpdateNoteDraftOnRenameCommand
  | UpdateNoteDraftOnCreateCommand
  | DiscardNoteDraftCommand
  | ConvertToMarkdownCommand
  | ConvertToTextCommand;

export const DoNothing: DoNothingCommand = {
  type: CommandType.DoNothing,
  execute: () => {},
};

export const DoMany = (commands: AppCommand[]): DoManyCommand => ({
  type: CommandType.DoMany,
  commands,
  execute: async (dispatch) => {
    commands.forEach((c) => c.execute(dispatch));
  },
});

// Initial command

export const InitialCommand = DoNothing;
