import "./EditorPanel.css";
import "github-markdown-css";
import { Note, NoteState } from "../model";
import Empty from "./Empty";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";
import { getEffectiveText, getEffectiveTitle } from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";

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
  if (note.state == NoteState.Loaded || note.state == NoteState.Saving) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
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

  return (
    <div className="editor-panel">
      <Empty />
    </div>
  );
}

export default EditorPanel;
