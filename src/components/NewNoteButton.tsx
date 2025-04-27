import "./NewNoteButton.css";
import { memo, useState } from "react";
import uistrings from "../uistrings";
import { NoteFormat } from "../model";

const NewNoteButton = memo(function NewNoteButton(props: {
  onNew: (format: NoteFormat) => void;
}) {
  const onNew = props.onNew;

  const [expanded, setExpanded] = useState(false);

  const expand = () => {
    setExpanded(true);
  };

  const collapse = () => {
    setExpanded(false);
  };

  if (expanded) {
    return (
      <span className="format-selector" onMouseLeave={collapse}>
        [
        <button
          className="format-selector-button"
          onClick={() => onNew(NoteFormat.Markdown)}
        >
          {uistrings.AsMarkdownButtonText}
        </button>
        |
        <button
          className="format-selector-button"
          onClick={() => onNew(NoteFormat.Text)}
        >
          {uistrings.AsTextButtonText}
        </button>
        ]
      </span>
    );
  }

  return (
    <button
      className="control-panel-button"
      onMouseEnter={expand}
      onClick={() => onNew(NoteFormat.Markdown)}
    >
      {uistrings.NewButtonText}
    </button>
  );
});

export default NewNoteButton;
