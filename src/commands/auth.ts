import {
  CommandType,
  CreateUserSessionCommand,
  ScheduleIdTokenRefreshCommand,
} from "../commands";
import { EventType } from "../events";
import { setIdToken } from "../sessionapi";
import { fetchAuthSession } from "aws-amplify/auth";

const ID_TOKEN_REFRESH_INTERVAL = 300000;

export const StartUserSession = (
  idToken: string
): CreateUserSessionCommand => ({
  type: CommandType.CreateUserSession,
  idToken,
  execute: async (dispatch) => {
    setIdToken(idToken);
    dispatch({
      type: EventType.UserSessionCreated,
    });
  },
});

export const ScheduleIdTokenRefresh = (): ScheduleIdTokenRefreshCommand => ({
  type: CommandType.ScheduleIdTokenRefresh,
  execute: async () => {
    scheduleIdTokenRefresh();
  },
});

const scheduleIdTokenRefresh = () => {
  setTimeout(() => {
    fetchAuthSession({ forceRefresh: true }).then((s) => {
      if (s.tokens && s.tokens.idToken) {
        setIdToken(s.tokens.idToken.toString());
      }
      scheduleIdTokenRefresh();
    });
  }, ID_TOKEN_REFRESH_INTERVAL);
};
