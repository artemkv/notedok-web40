import { AppEvent } from "./events";
import { Command } from "./hooks/useReducer";
import {
  Maybe,
  NoteConvertingToMarkdown,
  NoteCreatingFromText,
  NoteCreatingFromTitle,
  NoteDeleting,
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

  UpdateNoteDraft,

  ConvertToMarkdown,
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

export interface UpdateNoteDraftCommand extends Command<AppEvent> {
  type: CommandType.UpdateNoteDraft;
  key: string;
  draft: Maybe<string>;
}

export interface ConvertToMarkdownCommand extends Command<AppEvent> {
  type: CommandType.ConvertToMarkdown;
  note: NoteConvertingToMarkdown;
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
  | UpdateNoteDraftCommand
  | ConvertToMarkdownCommand;

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
