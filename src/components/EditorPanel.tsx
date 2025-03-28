import { Note, NoteState } from "../model";
import "./EditorPanel.css";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";

function EditorPanel(props: { note: Note | undefined }) {
  const note = props.note;

  if (note == undefined) {
    return (
      <div className="editor-panel">
        <Empty />
      </div>
    );
  }

  if (note.state == NoteState.Ref) {
    return (
      <div className="editor-panel">
        <ProgressIndicator />
      </div>
    );
  }
  if (note.state == NoteState.Loading) {
    return (
      <div className="editor-panel">
        <ProgressIndicator />
      </div>
    );
  }

  if (note.state == NoteState.Loaded) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div className="editor-panel-inner">{note.text}</div>
        <div className="editor-panel-right" />
      </div>
    );
  }

  return (
    <div className="editor-panel">
      <Empty />
    </div>
  );
}

export default EditorPanel;
