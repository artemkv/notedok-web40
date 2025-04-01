import {
  handleCreateNoteRequested,
  handleDeleteNoteRequested,
  handleLoadNoteTextSuccess,
  handleNoteAllChangesSaved,
  handleNoteCreated,
  handleNoteDeleted,
  handleNoteReachedSavePoint,
  handleNoteSelected,
  handleRestoreNoteRequested,
  handleRetrieveFileListSuccess,
  handleUserAuthenticated,
  handleUserSessionCreated,
} from "./buisiness";
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
    if (event.type === EventType.RetrieveFileListSuccess) {
      return handleRetrieveFileListSuccess(event);
    }

    if (event.type == EventType.NoteSelected) {
      return handleNoteSelected(state, event);
    }

    if (event.type == EventType.LoadNoteTextSuccess) {
      return handleLoadNoteTextSuccess(state, event);
    }

    if (event.type == EventType.NoteReachedSavePoint) {
      return handleNoteReachedSavePoint(state, event);
    }

    if (event.type == EventType.NoteAllChangesSaved) {
      return handleNoteAllChangesSaved(state, event);
    }

    if (event.type == EventType.CreateNoteRequested) {
      return handleCreateNoteRequested(state);
    }

    if (event.type == EventType.NoteCreated) {
      return handleNoteCreated(state, event);
    }

    if (event.type == EventType.DeleteNoteRequested) {
      return handleDeleteNoteRequested(state, event);
    }

    if (event.type == EventType.NoteDeleted) {
      return handleNoteDeleted(state, event);
    }

    if (event.type == EventType.RestoreNoteRequested) {
      return handleRestoreNoteRequested(state, event);
    }
  }

  console.error(
    `Unknown event ${EventType[event.type]} '${JSON.stringify(event)}'`
  );

  return JustState(state);
};
