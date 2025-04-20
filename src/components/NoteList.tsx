import "./NoteList.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note } from "../model";
import NoteListItem from "./NoteListItem";
import { memo } from "react";

const NoteList = memo(function NoteList(props: {
  filteredNotes: Note[];
  selectedNoteId: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const filteredNotes = props.filteredNotes;
  const selectedNoteId = props.selectedNoteId;
  const dispatch = props.dispatch;

  return (
    <div className="note-list">
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
