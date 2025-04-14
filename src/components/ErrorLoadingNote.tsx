import "./ErrorLoadingNote.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { memo } from "react";

const ErrorLoadingNote = memo(function ErrorLoadingNote(props: {
  noteId: string;
  err: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteId = props.noteId;
  const err = props.err;
  const dispatch = props.dispatch;

  const onClickRetry = () => {
    dispatch({
      type: EventType.RetryLoadingNoteRequested,
      noteId,
    });
  };

  return (
    <>
      <div className="error-message">{err}</div>
      <button className="error-retry-button" onClick={onClickRetry}>
        Retry
      </button>
    </>
  );
});

export default ErrorLoadingNote;
