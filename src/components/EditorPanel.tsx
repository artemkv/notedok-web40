import { Note, NoteState } from "../model";
import "./EditorPanel.css";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";

function EditorPanel(props: { note: Note | undefined }) {
  const note = props.note;

  if (note == undefined) {
    return <Empty />;
  }

  if (note.state == NoteState.Ref) {
    return <ProgressIndicator />;
  }
  if (note.state == NoteState.Loading) {
    return <ProgressIndicator />;
  }

  if (note.state == NoteState.Loaded) {
    return <div className="editor-panel">{note.text}</div>;
  }

  return <Empty />;
}

export default EditorPanel;
