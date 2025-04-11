import "./NoteList.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note } from "../model";
import NoteListItem from "./NoteListItem";
import { memo } from "react";

const NoteList = memo(function NoteList(props: {
  notes: Note[];
  filteredNotes: Note[];
  selectedNoteId: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const notes = props.notes;
  const filteredNotes = props.filteredNotes;
  const selectedNoteId = props.selectedNoteId;
  const dispatch = props.dispatch;

  return (
    <div className="note-list">
      <div className="note-list-counter">
        {filteredNotes.length}/{notes.length}
      </div>
      {filteredNotes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
});

export default NoteList;
