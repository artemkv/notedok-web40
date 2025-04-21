import "./EditorPanel.css";
import "github-markdown-css";
import { Editor, EditorState, MaybeOption, Note, NoteState } from "../model";
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
          isFormatMarkdown={editor.state == EditorState.EditingAsMarkdown}
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
          isFormatMarkdown={editor.state == EditorState.EditingAsMarkdown}
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
          isFormatMarkdown={editor.state == EditorState.EditingAsMarkdown}
        />
        <ErrorLoadingNote noteId={note.id} err={note.err} dispatch={dispatch} />
      </>
    );
  }

  const isTitleEditable = () => {
    if (note.state == NoteState.Loaded || note.state == NoteState.New) {
      return true;
    }
    return false;
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

  const onSaveDraft = () => {
    if (editor.state == EditorState.EditingAsMarkdown) {
      const md = getMarkdownRef.current.getMarkdown();
      if (md != undefined && md != editorDefaultText()) {
        dispatch({
          type: EventType.EditorCurrentStateReport,
          noteId: note.id,
          text: md,
        });
      }
    }

    if (editor.state == EditorState.EditingAsPlainText) {
      const text = getTextRef.current.getText();
      if (text != undefined && text != editorDefaultText()) {
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
        note,
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

  // TODO: I need to make it clear how the draft is handled, otherwise it's a bit messy
  const editorDefaultText = () => {
    // TODO: draft??
    if (editor.state == EditorState.Inactive) {
      return getEffectiveText(note);
    }

    // TODO: I could ignore the text from the note, and just use the one on the editor
    // TODO: it would be calculated once upon request to edit
    // TODO: and that would be the place I insert draft
    // TODO: this would avoid changing default text when draft updates

    // TODO: alternative is to, instead of updating the note directly,
    // TODO: instead update a draft property of an editor
    // TODO: the draft goes away on both save and cancel, which means I could update
    // TODO: the note only when it is selected again.
    // TODO: but I think it is more confusing
    if (editor.draft.option == MaybeOption.Some) {
      return editor.draft.value;
    }
    return getEffectiveText(note);
  };

  const markdownEditor = () => {
    // We are in fallback mode
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <>
          <PlainTextEditor
            noteId={note.id}
            defaultText={editorDefaultText()}
            getTextRef={getTextRef.current}
          />
          <IntervalTrigger callback={onSaveDraft} />
        </>
      );
    }

    return (
      <>
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
        <IntervalTrigger callback={onSaveDraft} />
      </>
    );
  };

  // Eventually will go away, when I convert all my notes to md
  const plainTextEditor = () => {
    if (editor.state == EditorState.EditingAsPlainText) {
      return (
        <>
          <PlainTextEditor
            noteId={note.id}
            defaultText={editorDefaultText()}
            getTextRef={getTextRef.current}
          />
          <IntervalTrigger callback={onSaveDraft} />
        </>
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

    return (
      <>
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
              isNew={isNew}
              defaultTitle={getEffectiveTitle(note)}
              editable={isTitleEditable()}
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
