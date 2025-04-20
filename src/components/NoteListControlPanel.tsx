import { memo } from "react";
import "./NoteListControlPanel.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";

const NoteListControlPanel = memo(function NoteList(props: {
  notesTotal: number;
  filteredNotesTotal: number;
  dispatch: Dispatch<AppEvent>;
}) {
  const notesTotal = props.notesTotal;
  const filteredNotesTotal = props.filteredNotesTotal;
  const dispatch = props.dispatch;

  return (
    <div className="note-list-control-panel">
      <div className="note-list-counter">
        {filteredNotesTotal}/{notesTotal}
      </div>
    </div>
  );
});

export default NoteListControlPanel;
