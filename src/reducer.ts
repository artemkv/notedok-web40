import {
  handleCancelNoteEditRequested,
  handleConvertToMarkdownRequested,
  handleCreateNoteRequested,
  handleDeleteNoteRequested,
  handleEditNoteRequested,
  handleEditorCurrentStateReport,
  handleFailedToCreateNoteFromText,
  handleFailedToCreateNoteFromTitle,
  handleFailedToDeleteNote,
  handleFailedToInitializeMarkdownEditor,
  handleFailedToLoadNote,
  handleFailedToRenameNote,
  handleFailedToRestoreNote,
  handleFailedToRetrieveFileList,
  handleFailedToSaveNoteText,
  handleLoadNoteTextSuccess,
  handleNoteConvertedToMarkdown,
  handleNoteCreated,
  handleNoteDeleted,
  handleNoteDiscardNoteErrorRequested,
  handleNoteFailedToConvertToMarkdown,
  handleNoteRenamed,
  handleNoteRestored,
  handleNoteRestoredOnNewPath,
  handleNoteSaveTextRequested,
  handleNoteSelected,
  handleNoteTextSaved,
  handleNoteTitleUpdated,
  handleRestoreNoteRequested,
  handleRetrieveFileListSuccess,
  handleRetryLoadingNoteRequested,
  handleRetryNoteErrorRequested,
  handleSearchTextUpdated,
  handleSortingOrderUpdated,
  handleSwitchEditorToMarkdownRequested,
  handleSwitchEditorToTextRequested,
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
    if (event.type == EventType.FailedToRetrieveFileList) {
      return handleFailedToRetrieveFileList(event);
    }

    if (event.type == EventType.SearchTextUpdated) {
      return handleSearchTextUpdated(state, event);
    }
    if (event.type == EventType.SortingOrderUpdated) {
      return handleSortingOrderUpdated(state, event);
    }

    if (event.type == EventType.NoteSelected) {
      return handleNoteSelected(state, event);
    }

    if (event.type == EventType.LoadNoteTextSuccess) {
      return handleLoadNoteTextSuccess(state, event);
    }
    if (event.type == EventType.FailedToLoadNote) {
      return handleFailedToLoadNote(state, event);
    }
    if (event.type == EventType.RetryLoadingNoteRequested) {
      return handleRetryLoadingNoteRequested(state, event);
    }

    if (event.type == EventType.NoteTitleUpdated) {
      return handleNoteTitleUpdated(state, event);
    }
    if (event.type == EventType.NoteRenamed) {
      return handleNoteRenamed(state, event);
    }
    if (event.type == EventType.FailedToRenameNote) {
      return handleFailedToRenameNote(state, event);
    }

    if (event.type == EventType.EditNoteRequested) {
      return handleEditNoteRequested(state, event);
    }
    if (event.type == EventType.FailedToInitializeMarkdownEditor) {
      return handleFailedToInitializeMarkdownEditor(state);
    }
    if (event.type == EventType.CancelNoteEditRequested) {
      return handleCancelNoteEditRequested(state, event);
    }

    if (event.type == EventType.NoteSaveTextRequested) {
      return handleNoteSaveTextRequested(state, event);
    }
    if (event.type == EventType.NoteTextSaved) {
      return handleNoteTextSaved(state, event);
    }
    if (event.type == EventType.FailedToSaveNoteText) {
      return handleFailedToSaveNoteText(state, event);
    }

    if (event.type == EventType.CreateNoteRequested) {
      return handleCreateNoteRequested(state);
    }
    if (event.type == EventType.NoteCreated) {
      return handleNoteCreated(state, event);
    }
    if (event.type == EventType.FailedToCreateNoteFromTitle) {
      return handleFailedToCreateNoteFromTitle(state, event);
    }
    if (event.type == EventType.FailedToCreateNoteFromText) {
      return handleFailedToCreateNoteFromText(state, event);
    }

    if (event.type == EventType.EditorCurrentStateReport) {
      // TODO: remove
      // console.log("SAVED");
      // return JustState(state);
      return handleEditorCurrentStateReport(state, event);
    }

    if (event.type == EventType.DeleteNoteRequested) {
      return handleDeleteNoteRequested(state, event);
    }
    if (event.type == EventType.NoteDeleted) {
      return handleNoteDeleted(state, event);
    }
    if (event.type == EventType.FailedToDeleteNote) {
      return handleFailedToDeleteNote(state, event);
    }

    if (event.type == EventType.RestoreNoteRequested) {
      return handleRestoreNoteRequested(state, event);
    }
    if (event.type == EventType.NoteRestored) {
      return handleNoteRestored(state, event);
    }
    if (event.type == EventType.NoteRestoredOnNewPath) {
      return handleNoteRestoredOnNewPath(state, event);
    }
    if (event.type == EventType.FailedToRestoreNote) {
      return handleFailedToRestoreNote(state, event);
    }

    if (event.type == EventType.ConvertToMarkdownRequested) {
      return handleConvertToMarkdownRequested(state, event);
    }
    if (event.type == EventType.NoteConvertedToMarkdown) {
      return handleNoteConvertedToMarkdown(state, event);
    }
    if (event.type == EventType.NoteFailedToConvertToMarkdown) {
      return handleNoteFailedToConvertToMarkdown(state, event);
    }

    if (event.type == EventType.SwitchEditorToMarkdownRequested) {
      return handleSwitchEditorToMarkdownRequested(state, event);
    }
    if (event.type == EventType.SwitchEditorToTextRequested) {
      return handleSwitchEditorToTextRequested(state, event);
    }

    if (event.type == EventType.RetryNoteErrorRequested) {
      return handleRetryNoteErrorRequested(state, event);
    }
    if (event.type == EventType.DiscardNoteErrorRequested) {
      return handleNoteDiscardNoteErrorRequested(state, event);
    }
  }

  console.error(
    `Unknown event ${EventType[event.type]} '${JSON.stringify(event)}'`
  );

  return JustState(state);
};
