import "./NoteListItem.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { Note, NoteState } from "../model";
import OrbitProgressIndicator from "./OrbitProgressIndicator";
import { getEffectiveTitle, isMarkdownNote } from "../buisiness";
import uistrings from "../uistrings";
import { memo } from "react";

const NoteListItem = memo(function NoteListItem(props: {
  note: Note;
  isSelected: boolean;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const isSelected = props.isSelected;
  const dispatch = props.dispatch;

  const effectiveTitle = getEffectiveTitle(note);

  const isPending = (note: Note) => {
    if (
      note.state == NoteState.CreatingFromTitle ||
      note.state == NoteState.CreatingFromText ||
      note.state == NoteState.SavingText ||
      note.state == NoteState.Renaming ||
      note.state == NoteState.Deleting ||
      note.state == NoteState.Restoring
    ) {
      return true;
    }
    return false;
  };

  const placeholderText = (note: Note) => {
    if (note.state == NoteState.New) {
      return uistrings.NewNoteTitlePlaceholder;
    }
    return uistrings.NoteTitlePlaceholder;
  };

  const onNoteSelected = (note: Note) => {
    dispatch({
      type: EventType.NoteSelected,
      note,
    });
  };

  let className = "note-list-item";
  if (isSelected) {
    className += " note-list-item-selected";
  }
  if (!effectiveTitle) {
    className += " note-list-item-placeholder";
  }
  if (
    note.state == NoteState.Deleting ||
    note.state == NoteState.Deleted ||
    note.state == NoteState.Restoring ||
    note.state == NoteState.FailedToRestore
  ) {
    className += " note-list-item-deleted";
  }

  return (
    <div className="note-list-item-container" id={note.id}>
      <div className={className} onClick={() => onNoteSelected(note)}>
        {getEffectiveTitle(note) !== ""
          ? getEffectiveTitle(note)
          : placeholderText(note)}
      </div>
      {isPending(note) ? (
        <div className="note-list-item-status">
          <OrbitProgressIndicator />
        </div>
      ) : !isMarkdownNote(note) ? (
        <div className="note-format-indicator">.txt</div>
      ) : null}
    </div>
  );
});

export default NoteListItem;
