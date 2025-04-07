import { useEffect, useState } from "react";
import uistrings from "../uistrings";
import "./NoteTitleEditor.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";

const NoteTitleEditor = function NoteTitleEditor(props: {
  noteId: string;
  defaultTitle: string;
  isNew: boolean;
  editable: boolean;
  deleted: boolean;
  dispatch: Dispatch<AppEvent>;
}) {
  const noteId = props.noteId;
  const defaultTitle = props.defaultTitle;
  const isNew = props.isNew;
  const editable = props.editable;
  const deleted = props.deleted;
  const dispatch = props.dispatch;

  // Local editor state
  const [title, setTitle] = useState(defaultTitle);

  // Update when note changes
  useEffect(() => {
    setTitle(() => defaultTitle);
  }, [noteId, defaultTitle]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editable) {
      setTitle(() => e.target.value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    dispatch({
      type: EventType.NoteTitleUpdated,
      noteId,
      newTitle: title,
    });
    e.preventDefault();
  };

  const onBlur = () => {
    dispatch({
      type: EventType.NoteTitleUpdated,
      noteId,
      newTitle: title,
    });
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle(() => defaultTitle);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {deleted ? (
        <del>
          <div className="note-title">{title}</div>
        </del>
      ) : (
        <input
          id={`${noteId}_title`}
          className="note-title"
          type="text"
          value={title}
          onChange={onChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
          placeholder={
            isNew
              ? uistrings.NewNoteTitlePlaceholder
              : uistrings.NoteTitlePlaceholder
          }
          maxLength={50}
        />
      )}
    </form>
  );
};

export default NoteTitleEditor;
