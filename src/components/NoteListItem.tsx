import "./NoteListItem.css";
import { AppEvent, EventType } from "../events";
import { Dispatch } from "../hooks/useReducer";
import { MaybeType, Note, NoteState } from "../model";
import OrbitProgressIndicator from "./OrbitProgressIndicator";
import ErrorIcon from "../assets/error_outline.svg";
import { getDraft, getEffectiveTitle, isMarkdownNote } from "../buisiness";
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
      note.state == NoteState.Restoring ||
      note.state == NoteState.ConvertingToMarkdown
    ) {
      return true;
    }
    return false;
  };

  // TODO: single-source
  const [hasError, error] = (() => {
    if (
      note.state == NoteState.FailedToCreateFromTitle ||
      note.state == NoteState.FailedToCreateFromText ||
      note.state == NoteState.FailedToRename ||
      note.state == NoteState.FailedToSaveText ||
      note.state == NoteState.FailedToDelete ||
      note.state == NoteState.FailedToRestore ||
      note.state == NoteState.FailedToConvertToMarkdown
    ) {
      return [true, note.err];
    }
    return [false, ""];
  })();

  const hasDraft = getDraft(note).type == MaybeType.Some;

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

  const noteStatus = () => {
    if (isPending(note)) {
      return (
        <div className="note-list-item-status">
          <OrbitProgressIndicator />
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="note-list-item-status">
          <img className="note-error-icon" src={ErrorIcon} title={error} />
        </div>
      );
    }

    if (!isMarkdownNote(note)) {
      return <div className="note-format-indicator">.txt</div>;
    }
  };

  return (
    <div className="note-list-item-container" id={note.id}>
      <div className={className} onClick={() => onNoteSelected(note)}>
        {hasDraft ? "• " : ""}
        {getEffectiveTitle(note) !== ""
          ? getEffectiveTitle(note)
          : placeholderText(note)}
      </div>
      {noteStatus()}
    </div>
  );
});

export default NoteListItem;
