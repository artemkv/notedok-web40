import { useEffect, useState } from "react";
import uistrings from "../uistrings";
import "./NoteTitleEditor.css";

const NoteTitleEditor = function NoteTitleEditor(props: {
  noteId: string;
  defaultTitle: string;
  reportTitle: (title: string) => void;
}) {
  // We reset to default title when note id changes
  const noteId = props.noteId;
  const defaultTitle = props.defaultTitle;
  const reportTitle = props.reportTitle;

  // Local editor state
  const [title, setTitle] = useState(defaultTitle);

  // TODO: title could also save on timer, just like text
  useEffect(() => {
    setTitle(defaultTitle);

    // this is on purpose. Only reload editor when noteId changes
    // the default title may update, but it can be stale
    // the most latest state is ephemeral, and is found inside the editor itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(() => e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    reportTitle(title);
    e.preventDefault();
  };

  const onBlur = () => {
    reportTitle(title);
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTitle(() => defaultTitle);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        id={`${noteId}_title`}
        className="note-title"
        type="text"
        value={title}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        placeholder={uistrings.NoteTitlePlaceholder}
        maxLength={50}
      />
    </form>
  );
};

export default NoteTitleEditor;
