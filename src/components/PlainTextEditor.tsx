import "./PlainTextEditor.css";
import { memo, useEffect, useRef, useState } from "react";

const PlainTextEditor = memo(function PlainTextEditor(props: {
  noteId: string;
  defaultText: string;
  getTextRef: { getText: () => string | undefined };
}) {
  const noteId = props.noteId;
  const defaultText = props.defaultText;
  // This is done this way to align with MilkdownEditor implementation
  const getTextRef = props.getTextRef;

  const [text, setText] = useState(defaultText);
  getTextRef.getText = () => text;

  // Update when note changes
  useEffect(() => {
    setText(() => defaultText);
  }, [noteId, defaultText]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    focusTextarea();
  });

  const noteTextOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(() => e.target.value);
  };

  const noteTextOnKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setText(() => defaultText);
    }
  };

  return (
    <div className="note-text-editable-container">
      <textarea
        ref={textareaRef}
        className="note-text-editable"
        value={text}
        onChange={noteTextOnChange}
        onKeyUp={noteTextOnKeyUp}
      ></textarea>
    </div>
  );
});

export default PlainTextEditor;
