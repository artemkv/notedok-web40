import "./NoteList.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note } from "../model";

function NoteList(props: {
  notes: Note[];
  selectedNote: Note | undefined;
  dispatch: Dispatch<AppEvent>;
}) {
  const notes = props.notes;
  const selectedNote = props.selectedNote;
  const dispatch = props.dispatch;

  const onNoteSelected = (note: Note) => {
    dispatch({
      type: EventType.NoteSelected,
      note,
    });
  };

  return (
    <div className="note-list">
      {notes.map((note) => (
        <div
          key={note.path}
          className={note === selectedNote ? "note-list-item-selected" : ""}
          onClick={() => onNoteSelected(note)}
        >
          {note.title}
        </div>
      ))}
    </div>
  );
}

export default NoteList;
