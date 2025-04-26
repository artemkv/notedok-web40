import "./EditorPanel.css";
import "github-markdown-css";
import { Editor, EditorState, MaybeType, Note, NoteState } from "../model";
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
  getDraft,
  getEffectiveTitle,
  isMarkdownNote,
  isTitleEditable,
} from "../buisiness";
import NoteTitleEditor from "./NoteTitleEditor";
import ControlPanel from "./ControlPanel";
import { memo, useRef } from "react";
import { htmlEscape, renderNoteTextHtml } from "../ui";
import PlainTextEditor from "./PlainTextEditor";
import ErrorLoadingNote from "./ErrorLoadingNote";
import NoteErrorPanel from "./NoteErrorPanel";
import IntervalTrigger from "./IntervalTrigger";

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

  const onNew = () => {
    dispatch({
      type: EventType.CreateNoteRequested,
    });
  };

  if (note == undefined) {
    return (
      <>
        <ControlPanel
          showNew={true}
          onNew={onNew}
          showConvertToMarkdown={false}
          onFormatSwitch={() => {}}
          onConvertToMarkdown={() => {}}
          showEdit={false}
          onEdit={() => {}}
          showSave={false}
          onSave={() => {}}
          showCancel={false}
          onCancel={() => {}}
          showDelete={false}
          onDelete={() => {}}
          showRestore={false}
          onRestore={() => {}}
          showProgress={false}
          showFormatSwitch={false}
          isFormatMarkdown={false}
          hasDraft={false}
          onDiscardDraft={() => {}}
        />
        <div className="editor-panel"></div>
      </>
    );
  }

  if (
    note.state == NoteState.Ref ||
    note.state == NoteState.Loading ||
    note.state == NoteState.ConvertingToMarkdown
  ) {
    return (
      <>
        <ControlPanel
          showNew={true}
          onNew={onNew}
          showConvertToMarkdown={false}
          onFormatSwitch={() => {}}
          onConvertToMarkdown={() => {}}
          showEdit={false}
          onEdit={() => {}}
          showSave={false}
          onSave={() => {}}
          showCancel={false}
          onCancel={() => {}}
          showDelete={false}
          onDelete={() => {}}
          showRestore={false}
          onRestore={() => {}}
          showProgress={false}
          showFormatSwitch={false}
          isFormatMarkdown={false}
          hasDraft={false}
          onDiscardDraft={() => {}}
        />
        <div className="editor-panel">
          <ProgressIndicator />
        </div>
      </>
    );
  }

  if (note.state == NoteState.FailedToLoad) {
    return (
      <>
        <ControlPanel
          showNew={true}
          onNew={onNew}
          showConvertToMarkdown={false}
          onFormatSwitch={() => {}}
          onConvertToMarkdown={() => {}}
          showEdit={false}
          onEdit={() => {}}
          showSave={false}
          onSave={() => {}}
          showCancel={false}
          onCancel={() => {}}
          showDelete={false}
          onDelete={() => {}}
          showRestore={false}
          onRestore={() => {}}
          showProgress={false}
          showFormatSwitch={false}
          isFormatMarkdown={false}
          hasDraft={false}
          onDiscardDraft={() => {}}
        />
        <ErrorLoadingNote noteId={note.id} err={note.err} dispatch={dispatch} />
      </>
    );
  }

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

  const onSaveDraft = () => {
    if (editor.state == EditorState.EditingAsMarkdown) {
      const md = getMarkdownRef.current.getMarkdown();
      if (md != undefined) {
        dispatch({
          type: EventType.EditorCurrentStateReport,
          noteId: note.id,
          text: md,
        });
      }
    }

    if (editor.state == EditorState.EditingAsPlainText) {
      const text = getTextRef.current.getText();
      if (text != undefined) {
        dispatch({
          type: EventType.EditorCurrentStateReport,
          noteId: note.id,
          text,
        });
      }
    }
  };

  const onCancel = () => {
    dispatch({
      type: EventType.CancelNoteEditRequested,
      noteId: note.id,
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

  const onDiscardDraft = () => {
    dispatch({
      type: EventType.DiscardNoteDraftRequested,
      noteId: note.id,
    });
  };

  // Implementation note: editor part is fully initialized in business
  // and does not depend on the note; this creates a specific place where the state
  // is transferred from the note to the editor, detaching the latter from the note
  // this allows updating note w/o re-rendering the editor component
  const markdownEditor = () => {
    // We are in fallback mode
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <>
          <PlainTextEditor
            noteId={note.id}
            defaultText={editor.defaultText}
            getTextRef={getTextRef.current}
          />
          <IntervalTrigger callback={onSaveDraft} />
        </>
      );
    }

    if (editor.state == EditorState.EditingAsMarkdown) {
      return (
        <>
          <MilkdownProvider>
            <MilkdownEditor
              noteId={note.id}
              defaultMarkdown={editor.defaultText}
              editable={true}
              deleted={false}
              getMarkdownRef={getMarkdownRef.current}
              dispatch={dispatch}
            />
          </MilkdownProvider>
          <IntervalTrigger callback={onSaveDraft} />
        </>
      );
    }

    if (editor.state == EditorState.ReadOnly) {
      return (
        <>
          <MilkdownProvider>
            <MilkdownEditor
              noteId={note.id}
              defaultMarkdown={editor.text}
              editable={false}
              deleted={showAsDeleted()}
              getMarkdownRef={getMarkdownRef.current}
              dispatch={dispatch}
            />
          </MilkdownProvider>
        </>
      );
    }

    return null;
  };

  // Eventually will go away, when I convert all my notes to md
  const plainTextEditor = () => {
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <>
          <PlainTextEditor
            noteId={note.id}
            defaultText={editor.defaultText}
            getTextRef={getTextRef.current}
          />
          <IntervalTrigger callback={onSaveDraft} />
        </>
      );
    }

    if (editor.state == EditorState.ReadOnly) {
      return (
        <div
          className={
            showAsDeleted() ? "note-text note-text-deleted" : "note-text"
          }
          dangerouslySetInnerHTML={{
            __html: renderNoteTextHtml(htmlEscape(editor.text)),
          }}
        ></div>
      );
    }

    return null;
  };

  if (
    note.state == NoteState.New ||
    note.state == NoteState.Loaded ||
    note.state == NoteState.CreatingFromTitle ||
    note.state == NoteState.FailedToCreateFromTitle ||
    note.state == NoteState.CreatingFromText ||
    note.state == NoteState.FailedToCreateFromText ||
    note.state == NoteState.Renaming ||
    note.state == NoteState.FailedToRename ||
    note.state == NoteState.SavingText ||
    note.state == NoteState.FailedToSaveText ||
    note.state == NoteState.Deleting ||
    note.state == NoteState.FailedToDelete ||
    note.state == NoteState.Deleted ||
    note.state == NoteState.Restoring ||
    note.state == NoteState.FailedToRestore ||
    note.state == NoteState.FailedToConvertToMarkdown
  ) {
    const [hasError, error] = (() => {
      if (
        note.state == NoteState.FailedToCreateFromTitle ||
        note.state == NoteState.FailedToCreateFromText ||
        note.state == NoteState.FailedToRename ||
        note.state == NoteState.FailedToSaveText ||
        note.state == NoteState.FailedToDelete ||
        note.state == NoteState.FailedToRestore ||
        note.state == NoteState.FailedToConvertToMarkdown
      ) {
        return [true, note.err];
      }
      return [false, ""];
    })();

    const hasDraft = getDraft(note).type == MaybeType.Some;

    return (
      <>
        <ControlPanel
          showNew={true}
          onNew={onNew}
          showConvertToMarkdown={
            canConvertToMarkdown(note) && editor.state == EditorState.ReadOnly
          }
          onFormatSwitch={onFormatSwitch}
          onConvertToMarkdown={onConvertToMarkdown}
          showEdit={canEdit(note) && editor.state == EditorState.ReadOnly}
          onEdit={onEdit}
          showSave={
            editor.state == EditorState.EditingAsMarkdown ||
            editor.state == EditorState.EditingAsPlainText
          }
          onSave={onSave}
          showCancel={
            editor.state == EditorState.EditingAsMarkdown ||
            editor.state == EditorState.EditingAsPlainText
          }
          onCancel={onCancel}
          showDelete={canDelete(note)}
          onDelete={onDelete}
          showRestore={canRestore(note)}
          onRestore={onRestore}
          showProgress={showControlPanelAsPending()}
          showFormatSwitch={
            isMarkdownNote(note) &&
            (editor.state == EditorState.EditingAsMarkdown ||
              editor.state == EditorState.EditingAsPlainText)
          }
          isFormatMarkdown={editor.state == EditorState.EditingAsMarkdown}
          hasDraft={hasDraft && editor.state == EditorState.ReadOnly}
          onDiscardDraft={onDiscardDraft}
        />
        <div className="editor-panel">
          <div id="editor" className="editor-panel-editor">
            {hasError ? (
              <NoteErrorPanel
                noteId={note.id}
                err={error}
                dispatch={dispatch}
              ></NoteErrorPanel>
            ) : null}
            <NoteTitleEditor
              noteId={note.id}
              isNew={note.state == NoteState.New}
              defaultTitle={getEffectiveTitle(note)}
              editable={isTitleEditable(note)}
              deleted={showAsDeleted()}
              dispatch={dispatch}
            />
            {isMarkdownNote(note) ? markdownEditor() : plainTextEditor()}
          </div>
        </div>
      </>
    );
  }

  return <div className="editor-panel"></div>;
});

export default EditorPanel;
