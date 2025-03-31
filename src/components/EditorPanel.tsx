import "./EditorPanel.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";

function EditorPanel(props: {
  note: Note | undefined;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const dispatch = props.dispatch;

  // TODO: make sure to handle all possible note states properly

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

  // TODO: debug code
  const onSave = () => {
    let noteTitle = "unknown";
    let noteText = "unknown";
    if (note != undefined && note.state == NoteState.Loaded) {
      noteTitle = note.title;
      noteText = note.text;
    }

    // TODO: from here, see what happens when multiple changes go in succession
    dispatch({
      type: EventType.NoteReachedSavePoint,
      noteId: note.id,
      currentTitle: noteTitle + ".upd",
      currentText: "upd." + noteText,
    });
  };

  // TODO: extract so that I don't have to deal with MilkdownProvider
  // TODO: provide the way to get back edits

  // TODO: try make links clickable
  // TODO: try to supper subscript and superscript
  // TODO: Spellchecking in code blocks is annoying

  // TODO: maybe #editor should be a separate div
  // TODO: remove save button, it is for debugging
  if (note.state == NoteState.Loaded || note.state == NoteState.Saving) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
          <button onClick={() => onSave()}>Save</button>
          <MilkdownProvider>
            <MilkdownEditor noteId={note.id} defaultMarkdown={note.text} />
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
