import "./NoteList.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note } from "../model";
import NoteListItem from "./NoteListItem";

function NoteList(props: {
  notes: Note[];
  selectedNoteId: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const notes = props.notes;
  const selectedNoteId = props.selectedNoteId;
  const dispatch = props.dispatch;

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteListItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}

export default NoteList;
