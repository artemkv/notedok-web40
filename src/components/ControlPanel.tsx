import "./ControlPanel.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import uistrings from "../uistrings";

function ControlPanel(props: { dispatch: Dispatch<AppEvent> }) {
  const dispatch = props.dispatch;

  const onCreateNote = () => {};

  const noteCreateButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onDeleteNote = () => {};

  const noteDeleteButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onRestoreNote = () => {};

  const noteRestoreButtonOnClick = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
    }
  };

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
