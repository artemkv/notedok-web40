import "./EditorPanel.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";
import { useEffect } from "react";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";

function EditorPanel(props: { note: Note | undefined }) {
  const note = props.note;

  // TODO: integrate this better with the rest of the ui logic
  useEffect(() => {
    /*let noteText = "";
    if (note?.state == NoteState.Loaded) {
      noteText = note.text;
    }*/
  }, [note]);

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

  // TODO: extract so that I don't have to deal with MilkdownProvider
  // TODO: provide the way to get back edits

  // TODO: try make links clickable
  // TODO: try to supper subscript and superscript
  // TODO: Spellchecking in code blocks is annoying

  // TODO: maybe #editor should be a separate div
  if (note.state == NoteState.Loaded) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
          <MilkdownProvider>
            <MilkdownEditor markdown={note.text} />
          </MilkdownProvider>
        </div>
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
