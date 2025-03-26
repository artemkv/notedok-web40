import { AppEvent } from "./events";
import { Command } from "./hooks/useReducer";

export enum CommandType {
  DoNothing,
  DoMany,
  CreateUserSession,
  ScheduleIdTokenRefresh,
  RetrieveFileList,
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

export type AppCommand =
  | DoNothingCommand
  | DoManyCommand
  | CreateUserSessionCommand
  | RetrieveFileListCommand
  | ScheduleIdTokenRefreshCommand;

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
