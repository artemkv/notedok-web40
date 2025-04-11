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
  isMarkdownNote,
} from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";
import { useRef } from "react";
import { htmlEscape, renderNoteTextHtml } from "../ui";
import PlainTextEditor from "./PlainTextEditor";

function EditorPanel(props: {
  note: Note | undefined;
  editorState: EditorState;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const editorState = props.editorState;
  const dispatch = props.dispatch;

  const getMarkdownRef = useRef({ getMarkdown: () => undefined });
  const getTextRef = useRef({ getText: () => undefined });

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
    if (note.state == NoteState.Loaded || note.state == NoteState.New) {
      return true;
    }
    // TODO: show spinner next to the title while saving?
    return false;
  };

  const onNew = () => {
    dispatch({
      type: EventType.CreateNoteRequested,
    });
  };

  const onEdit = () => {
    dispatch({
      type: EventType.EditNoteRequested,
      note,
    });
  };

  const onSave = () => {
    if (editorState == EditorState.EditingAsMarkdown) {
      const md = getMarkdownRef.current.getMarkdown();
      if (md != undefined) {
        dispatch({
          type: EventType.NoteSaveTextRequested,
          noteId: note.id,
          newText: md,
        });
      }
    }

    if (editorState == EditorState.EditingAsPlainText) {
      const text = getTextRef.current.getText();
      if (text != undefined) {
        dispatch({
          type: EventType.NoteSaveTextRequested,
          noteId: note.id,
          newText: text,
        });
      }
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

  const onMdEditorError = () => {
    if (editorState == EditorState.EditingAsMarkdown) {
      dispatch({
        type: EventType.FailedToInitializeMarkdownEditor,
      });
    }
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

  const markdownEditor = () => {
    // We are in fallback mode
    if (editorState == EditorState.EditingAsPlainText) {
      return (
        <PlainTextEditor
          noteId={note.id}
          defaultText={getEffectiveText(note)}
          getTextRef={getTextRef.current}
        />
      );
    }

    return (
      <MilkdownProvider>
        <MilkdownEditor
          noteId={note.id}
          defaultMarkdown={getEffectiveText(note)}
          editable={editorState == EditorState.EditingAsMarkdown}
          deleted={showAsDeleted()}
          getMarkdownRef={getMarkdownRef.current}
          onError={onMdEditorError}
        />
      </MilkdownProvider>
    );
  };

  // Eventually will go away, when I convert all my notes to md
  const plainTextEditor = () => {
    if (editorState == EditorState.EditingAsPlainText) {
      return (
        <PlainTextEditor
          noteId={note.id}
          defaultText={getEffectiveText(note)}
          getTextRef={getTextRef.current}
        />
      );
    }

    return (
      <div
        className={
          showAsDeleted() ? "note-text note-text-deleted" : "note-text"
        }
        dangerouslySetInnerHTML={{
          __html: renderNoteTextHtml(htmlEscape(getEffectiveText(note))),
        }}
      ></div>
    );
  };

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
            showEdit={canEdit(note) && editorState == EditorState.Inactive}
            onEdit={onEdit}
            showSave={editorState != EditorState.Inactive}
            onSave={onSave}
            showCancel={editorState != EditorState.Inactive}
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
          {isMarkdownNote(note) ? markdownEditor() : plainTextEditor()}
        </div>
        <div className="editor-panel-right" />
      </div>
    );
  }

  return <div className="editor-panel"></div>;
}

export default EditorPanel;
