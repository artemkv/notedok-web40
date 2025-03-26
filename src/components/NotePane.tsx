import { NoteEditor, NoteEditorState } from "../model";
import "./NotePane.css";
import ProgressIndicator from "./ProgressIndicator";

// TODO:
function NotePane(props: { noteEditor: NoteEditor }) {
  const noteEditor = props.noteEditor;

  if (noteEditor.state == NoteEditorState.Inactive) {
    return <div className="note-pane"></div>;
  }

  if (noteEditor.state == NoteEditorState.LoadingNoteContent) {
    return (
      <div className="note-pane">
        <ProgressIndicator />
      </div>
    );
  }

  return <div className="note-pane">{noteEditor.text}</div>;
}

export default NotePane;
