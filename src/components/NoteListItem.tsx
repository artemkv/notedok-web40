import "./NoteListItem.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note, NoteState } from "../model";
import OrbitProgressIndicator from "./OrbitProgressIndicator";
import { getEffectiveTitle } from "../buisiness";

function NoteList(props: {
  note: Note;
  isSelected: boolean;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const isSelected = props.isSelected;
  const dispatch = props.dispatch;

  // TODO: make sure to handle all possible note states properly
  const isPending = (note: Note) => {
    if (note.state == NoteState.Saving) {
      return true;
    }
    return false;
  };

  const onNoteSelected = (note: Note) => {
    dispatch({
      type: EventType.NoteSelected,
      note,
    });
  };

  return (
    <div className="note-list-item-container" id={note.id}>
      <div
        className={
          isSelected
            ? "note-list-item note-list-item-selected"
            : "note-list-item"
        }
        onClick={() => onNoteSelected(note)}
      >
        {getEffectiveTitle(note)}
      </div>
      {isPending(note) ? (
        <div className="note-list-item-status">
          <OrbitProgressIndicator />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default NoteList;
