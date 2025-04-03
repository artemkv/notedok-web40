import "./EditorPanel.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent } from "../events";
import { getEffectiveText, getEffectiveTitle } from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";

function EditorPanel(props: {
  note: Note | undefined;
  editable: boolean;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const editable = props.editable;
  const dispatch = props.dispatch;

  // TODO: make sure to handle all possible note states properly

  if (note == undefined) {
    return <div className="editor-panel"></div>;
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

  const isTitleEditable = () => {
    if (note.state == NoteState.Loaded) {
      return true;
    }
    // TODO: show spinner next to the title while saving?
    return false;
  };

  if (
    note.state == NoteState.New ||
    note.state == NoteState.Loaded ||
    note.state == NoteState.Renaming ||
    note.state == NoteState.Deleting ||
    note.state == NoteState.Deleted ||
    note.state == NoteState.Restoring
  ) {
    // TODO: try make links clickable
    // TODO: try to support subscript and superscript
    // TODO: Spellchecking in code blocks is annoying
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
          <ControlPanel noteId={note.id} dispatch={dispatch} />
          <NoteTitleEditor
            noteId={note.id}
            defaultTitle={getEffectiveTitle(note)}
            editable={isTitleEditable()}
            dispatch={dispatch}
          />
          <MilkdownProvider>
            <MilkdownEditor
              noteId={note.id}
              editable={editable}
              defaultMarkdown={getEffectiveText(note)}
            />
          </MilkdownProvider>
        </div>
        <div className="editor-panel-right" />
      </div>
    );
  }

  return <div className="editor-panel"></div>;
}

export default EditorPanel;
