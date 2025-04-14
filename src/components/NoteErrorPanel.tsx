import "./NoteErrorPanel.css";
import CloseIcon from "../assets/close.svg";
import { memo } from "react";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";

const NoteErrorPanel = memo(function NoteErrorPanel(props: {
  noteId: string;
  err: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteId = props.noteId;
  const err = props.err;
  const dispatch = props.dispatch;

  const onClickRetry = () => {
    dispatch({
      type: EventType.RetryNoteErrorRequested,
      noteId,
    });
  };

  const onCloseClick = () => {
    dispatch({
      type: EventType.DiscardNoteErrorRequested,
      noteId,
    });
  };

  return (
    <div className="note-error-panel">
      <div className="note-error-panel-content">
        <div className="error-message">{err}</div>
        <button className="note-error-retry-button" onClick={onClickRetry}>
          Retry
        </button>
      </div>
      <button className="error-panel-close-button" onClick={onCloseClick}>
        <img src={CloseIcon} />
      </button>
    </div>
  );
});

export default NoteErrorPanel;
