import "./DraftControl.css";
import uistrings from "../uistrings";
import { memo } from "react";

const DraftControl = memo(function DraftControl(props: {
  onDiscardDraft: () => void;
}) {
  const onDiscardDraft = props.onDiscardDraft;

  const onDiscardClick = () => {
    onDiscardDraft();
  };

  return (
    <span className="draft-control">
      [<span className="draft-control-text">{uistrings.DraftText}</span>:
      <button className="draft-control-button" onClick={onDiscardClick}>
        {uistrings.DiscardDraftButtonText}
      </button>
      ]
    </span>
  );
});

export default DraftControl;
