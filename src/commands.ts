import { AppEvent } from "./events";
import { Command } from "./hooks/useReducer";
import { Note, NoteCreating, NoteDeleting, NoteSaving } from "./model";

export enum CommandType {
  DoNothing,
  DoMany,
  CreateUserSession,
  ScheduleIdTokenRefresh,
  RetrieveFileList,
  LoadNoteText,

  CreateNote,
  SaveNote,
  DeleteNote,
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
  note: Note;
}

export interface CreateNoteCommand extends Command<AppEvent> {
  type: CommandType.CreateNote;
  note: NoteCreating;
}

export interface SaveNoteCommand extends Command<AppEvent> {
  type: CommandType.SaveNote;
  note: NoteSaving;
}

export interface DeleteNoteCommand extends Command<AppEvent> {
  type: CommandType.DeleteNote;
  note: NoteDeleting;
}

export type AppCommand =
  | DoNothingCommand
  | DoManyCommand
  | CreateUserSessionCommand
  | ScheduleIdTokenRefreshCommand
  | RetrieveFileListCommand
  | LoadNoteTextCommand
  | CreateNoteCommand
  | SaveNoteCommand
  | DeleteNoteCommand;

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
