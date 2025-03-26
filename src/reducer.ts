import { handleUserAuthenticated, handleUserSessionCreated } from "./buisiness";
import { AppCommand, DoNothing } from "./commands";
import { AppEvent, EventType } from "./events";
import { AppState, AuthenticationStatus } from "./model";

export const JustState = (state: AppState): [AppState, AppCommand] => [
  state,
  DoNothing,
];

export const Reducer = (
  state: AppState,
  event: AppEvent
): [AppState, AppCommand] => {
  /*
    // Uncomment when debugging
  console.log(
    `Reducing event '${EventType[event.type]} ${JSON.stringify(event)}'`
  );*/

  if (state.auth === AuthenticationStatus.Unauthenticated) {
    if (event.type == EventType.UserAuthenticated) {
      return handleUserAuthenticated(state, event);
    }

    if (event.type == EventType.UserSessionCreated) {
      return handleUserSessionCreated();
    }
  } else {
    // TODO:
  }

  console.error(
    `Unknown event ${EventType[event.type]} '${JSON.stringify(event)}'`
  );

  return JustState(state);
};
