import "./EditorPanel.css";
import "github-markdown-css";
import { Editor, EditorState, Note, NoteState } from "../model";
import ProgressIndicator from "./ProgressIndicator";
import { MilkdownProvider } from "@milkdown/react";
import MilkdownEditor from "./MilkdownEditor";
import { Dispatch } from "../hooks/useReducer";
import { AppEvent, EventType } from "../events";
import {
  canConvertToMarkdown,
  canDelete,
  canEdit,
  canRestore,
  getEffectiveText,
  getEffectiveTitle,
  isMarkdownNote,
} from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";
import { memo, useRef } from "react";
import { htmlEscape, renderNoteTextHtml } from "../ui";
import PlainTextEditor from "./PlainTextEditor";
import ErrorLoadingNote from "./ErrorLoadingNote";

const EditorPanel = memo(function EditorPanel(props: {
  note: Note | undefined;
  editor: Editor;
  dispatch: Dispatch<AppEvent>;
}) {
  const note = props.note;
  const editor = props.editor;
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

  if (note.state == NoteState.ConvertingToMarkdown) {
    return (
      <div className="editor-panel">
        <ProgressIndicator />
      </div>
    );
  }

  if (note.state == NoteState.FailedToLoad) {
    return (
      <ErrorLoadingNote noteId={note.id} err={note.err} dispatch={dispatch} />
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

  const onConvertToMarkdown = () => {
    dispatch({
      type: EventType.ConvertToMarkdownRequested,
      noteId: note.id,
    });
  };

  const onEdit = () => {
    dispatch({
      type: EventType.EditNoteRequested,
      note,
    });
  };

  const onSave = () => {
    if (editor.state == EditorState.EditingAsMarkdown) {
      const md = getMarkdownRef.current.getMarkdown();
      if (md != undefined) {
        dispatch({
          type: EventType.NoteSaveTextRequested,
          noteId: note.id,
          newText: md,
        });
      }
    }

    if (editor.state == EditorState.EditingAsPlainText) {
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
    if (editor.state == EditorState.EditingAsMarkdown) {
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

  const onFormatSwitch = (isMarkdown: boolean) => {
    if (editor.state == EditorState.EditingAsMarkdown && !isMarkdown) {
      const md = getMarkdownRef.current.getMarkdown();
      if (md != undefined) {
        dispatch({
          type: EventType.SwitchEditorToTextRequested,
          text: md,
        });
        return;
      }
    }

    if (editor.state == EditorState.EditingAsPlainText && isMarkdown) {
      const text = getTextRef.current.getText();
      if (text != undefined) {
        dispatch({
          type: EventType.SwitchEditorToMarkdownRequested,
          text,
        });
        return;
      }
    }
  };

  const isNew = note.state == NoteState.New;

  const editorDefaultText = () => {
    if (editor.state == EditorState.Inactive) {
      return getEffectiveText(note);
    }

    return editor.defaultText ?? getEffectiveText(note);
  };

  const markdownEditor = () => {
    // We are in fallback mode
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <PlainTextEditor
          noteId={note.id}
          defaultText={editorDefaultText()}
          getTextRef={getTextRef.current}
        />
      );
    }

    return (
      <MilkdownProvider>
        <MilkdownEditor
          noteId={note.id}
          defaultMarkdown={editorDefaultText()}
          editable={editor.state == EditorState.EditingAsMarkdown}
          deleted={showAsDeleted()}
          getMarkdownRef={getMarkdownRef.current}
          onError={onMdEditorError}
        />
      </MilkdownProvider>
    );
  };

  // Eventually will go away, when I convert all my notes to md
  const plainTextEditor = () => {
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <PlainTextEditor
          noteId={note.id}
          defaultText={editorDefaultText()}
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
          __html: renderNoteTextHtml(htmlEscape(editorDefaultText())),
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
            showConvertToMarkdown={
              canConvertToMarkdown(note) && editor.state == EditorState.Inactive
            }
            onFormatSwitch={onFormatSwitch}
            onConvertToMarkdown={onConvertToMarkdown}
            showEdit={canEdit(note) && editor.state == EditorState.Inactive}
            onEdit={onEdit}
            showSave={editor.state != EditorState.Inactive}
            onSave={onSave}
            showCancel={editor.state != EditorState.Inactive}
            onCancel={onCancel}
            showDelete={canDelete(note)}
            onDelete={onDelete}
            showRestore={canRestore(note)}
            onRestore={onRestore}
            showProgress={showControlPanelAsPending()}
            showFormatSwitch={
              isMarkdownNote(note) && editor.state != EditorState.Inactive
            }
            isFormatMarkdown={editor.state == EditorState.EditingAsMarkdown}
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
});

export default EditorPanel;
