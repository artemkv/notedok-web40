import { AppCommand, DoNothing } from "./commands";
import { StartUserSession } from "./commands/auth";
import { UserAuthenticatedEvent } from "./events";
import {
  AppState,
  AppStateAuthenticated,
  AppStateUnauthenticated,
  AuthenticationStatus,
} from "./model";

export const handleUserAuthenticated = (
  state: AppStateUnauthenticated,
  event: UserAuthenticatedEvent
): [AppState, AppCommand] => {
  return [state, StartUserSession(event.idToken)];
};

export const handleUserSessionCreated = (): [
  AppStateAuthenticated,
  AppCommand
] => {
  const newState: AppStateAuthenticated = {
    auth: AuthenticationStatus.Authenticated,
    todo: "welcome",
  };

  return [newState, DoNothing];
};
