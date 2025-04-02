import "./NoteList.css";
import { AppEvent } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note } from "../model";
import NoteListItem from "./NoteListItem";
import { filter } from "../buisiness";

function NoteList(props: {
  notes: Note[];
  searchText: string;
  selectedNoteId: string;
  dispatch: Dispatch<AppEvent>;
}) {
  const notes = props.notes;
  const searchText = props.searchText;
  const selectedNoteId = props.selectedNoteId;
  const dispatch = props.dispatch;

  return (
    <div className="note-list">
      {filter(notes, searchText).map((note) => (
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
