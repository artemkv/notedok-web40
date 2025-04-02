import "./EditorPanel.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";
import { getEffectiveText, getEffectiveTitle } from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";

function EditorPanel(props: {
  note: Note | undefined;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
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

  const onTitleUpdated = (newTitle: string) => {
    dispatch({
      type: EventType.NoteReachedSavePoint,
      noteId: note.id,
      currentTitle: newTitle,
      currentText: getEffectiveText(note), // TODO:
    });
  };

  // TODO: extract so that I don't have to deal with MilkdownProvider
  // TODO: provide the way to get back edits

  // TODO: try make links clickable
  // TODO: try to supper subscript and superscript
  // TODO: Spellchecking in code blocks is annoying

  // TODO: maybe #editor should be a separate div
  // TODO: remove save button, it is for debugging
  if (
    note.state == NoteState.New ||
    note.state == NoteState.Loaded ||
    note.state == NoteState.Saving ||
    note.state == NoteState.Creating ||
    note.state == NoteState.Deleting ||
    note.state == NoteState.Deleted ||
    note.state == NoteState.Restoring
  ) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
          <ControlPanel noteId={note.id} dispatch={dispatch} />
          <NoteTitleEditor
            noteId={note.id}
            defaultTitle={getEffectiveTitle(note)}
            onUpdated={onTitleUpdated}
          />
          <MilkdownProvider>
            <MilkdownEditor
              noteId={note.id}
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
