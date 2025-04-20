import { memo } from "react";
import "./NoteListControlPanel.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import NoteListFilter from "./NoteListFilter";
import { SortingOrder } from "../model";

const NoteListControlPanel = memo(function NoteList(props: {
  notesTotal: number;
  filteredNotesTotal: number;
  sortingOrder: SortingOrder;
  dispatch: Dispatch<AppEvent>;
}) {
  const notesTotal = props.notesTotal;
  const filteredNotesTotal = props.filteredNotesTotal;
  const sortingOrder = props.sortingOrder;
  const dispatch = props.dispatch;

  return (
    <div className="note-list-control-panel">
      <div className="note-list-counter">
        {filteredNotesTotal}/{notesTotal}
      </div>
      <div className="note-list-filter">
        <NoteListFilter sortingOrder={sortingOrder} dispatch={dispatch} />
      </div>
    </div>
  );
});

export default NoteListControlPanel;
