import "./ControlPanel.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import uistrings from "../uistrings";

function ControlPanel(props: { noteId: string; dispatch: Dispatch<AppEvent> }) {
  const noteId = props.noteId;
  const dispatch = props.dispatch;

  const onCreateNote = () => {
    dispatch({
      type: EventType.CreateNoteRequested,
    });
  };

  const noteCreateButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      dispatch({
        type: EventType.CreateNoteRequested,
      });
      e.preventDefault();
    }
  };

  const onDeleteNote = () => {
    dispatch({
      type: EventType.DeleteNoteRequested,
      noteId,
    });
  };

  const noteDeleteButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      dispatch({
        type: EventType.DeleteNoteRequested,
        noteId,
      });
      e.preventDefault();
    }
  };

  const onRestoreNote = () => {
    dispatch({
      type: EventType.RestoreNoteRequested,
      noteId,
    });
  };

  const noteRestoreButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      dispatch({
        type: EventType.RestoreNoteRequested,
        noteId,
      });
      e.preventDefault();
    }
  };

  // TODO: make buttons and extract into a separate component
  return (
    <div className="control-panel">
      <div className="control-panel-left">
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={onCreateNote}
          onKeyDown={noteCreateButtonOnClick}
        >
          {uistrings.NewButtonText}
        </a>
      </div>
      <div className="control-panel-right">
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={onRestoreNote}
          onKeyDown={noteRestoreButtonOnClick}
        >
          {uistrings.RestoreButtonText}
        </a>
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={onDeleteNote}
          onKeyDown={noteDeleteButtonOnClick}
        >
          {uistrings.DeleteButtonText}
        </a>
      </div>
    </div>
  );
}

export default ControlPanel;
