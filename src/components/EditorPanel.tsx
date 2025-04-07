import "./EditorPanel.css";
import "github-markdown-css";
import { EditorState, Note, NoteState } from "../model";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";
import {
  canDelete,
  canEdit,
  canRestore,
  getEffectiveText,
  getEffectiveTitle,
} from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";
import { useRef } from "react";

function EditorPanel(props: {
  note: Note | undefined;
  editorState: EditorState;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const editorState = props.editorState;
  const dispatch = props.dispatch;

  const getMarkdownRef = useRef({ getMarkdown: () => undefined });

  // TODO: make sure to handle all possible note states properly

  if (note == undefined) {
    return <div className="editor-panel"></div>;
  }

  // TODO: remove Ref
  if (note.state == NoteState.Ref) {
    return (
      <div className="editor-panel">
        Ref
        <ProgressIndicator />
      </div>
    );
  }

  // TODO: remove Loading
  if (note.state == NoteState.Loading) {
    return (
      <div className="editor-panel">
        Loading
        <ProgressIndicator />
      </div>
    );
  }

  const isTitleEditable = () => {
    if (note.state == NoteState.Loaded || note.state == NoteState.New) {
      return true;
    }
    // TODO: show spinner next to the title while saving?
    return false;
  };

  const isTextEditable = editorState == EditorState.Editing;

  const onNew = () => {
    dispatch({
      type: EventType.CreateNoteRequested,
    });
  };

  const onEdit = () => {
    dispatch({
      type: EventType.EditNoteRequested,
    });
  };

  const onSave = () => {
    const md = getMarkdownRef.current.getMarkdown();
    if (md != undefined) {
      dispatch({
        type: EventType.NoteSaveTextRequested,
        noteId: note.id,
        newText: md,
      });
    }
  };

  const onCancel = () => {
    dispatch({
      type: EventType.CancelNoteEditRequested,
    });
  };

  const onDelete = () => {
    dispatch({
      type: EventType.DeleteNoteRequested,
      noteId: note.id,
    });
  };

  const onRestore = () => {
    dispatch({
      type: EventType.RestoreNoteRequested,
      noteId: note.id,
    });
  };

  const showControlPanelAsPending = () => {
    if (
      note.state == NoteState.CreatingFromTitle ||
      note.state == NoteState.CreatingFromText ||
      note.state == NoteState.Renaming ||
      note.state == NoteState.SavingText ||
      note.state == NoteState.Deleting ||
      note.state == NoteState.Restoring
    ) {
      return true;
    }
    return false;
  };

  const showAsDeleted = () => {
    if (
      note.state == NoteState.Deleting ||
      note.state == NoteState.Deleted ||
      note.state == NoteState.Restoring ||
      note.state == NoteState.FailedToRestore
    ) {
      return true;
    }
    return false;
  };

  const isNew = note.state == NoteState.New;

  if (
    note.state == NoteState.New ||
    note.state == NoteState.Loaded ||
    note.state == NoteState.CreatingFromTitle ||
    note.state == NoteState.CreatingFromText ||
    note.state == NoteState.Renaming ||
    note.state == NoteState.SavingText ||
    note.state == NoteState.Deleting ||
    note.state == NoteState.Deleted ||
    note.state == NoteState.Restoring
  ) {
    return (
      <div className="editor-panel">
        <div className="editor-panel-left" />
        <div id="editor" className="editor-panel-inner">
          <ControlPanel
            showNew={true}
            onNew={onNew}
            showEdit={canEdit(note) && editorState != EditorState.Editing}
            onEdit={onEdit}
            showSave={editorState == EditorState.Editing}
            onSave={onSave}
            showCancel={editorState == EditorState.Editing}
            onCancel={onCancel}
            showDelete={canDelete(note)}
            onDelete={onDelete}
            showRestore={canRestore(note)}
            onRestore={onRestore}
            showProgress={showControlPanelAsPending()}
          />
          <NoteTitleEditor
            noteId={note.id}
            isNew={isNew}
            defaultTitle={getEffectiveTitle(note)}
            editable={isTitleEditable()}
            deleted={showAsDeleted()}
            dispatch={dispatch}
          />
          <MilkdownProvider>
            <MilkdownEditor
              noteId={note.id}
              defaultMarkdown={getEffectiveText(note)}
              editable={isTextEditable}
              deleted={showAsDeleted()}
              getMarkdownRef={getMarkdownRef.current}
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
