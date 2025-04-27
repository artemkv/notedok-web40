import "./ControlPanel.css";
import uistrings from "../uistrings";
import OrbitProgressIndicator from "./OrbitProgressIndicator";
import { memo } from "react";
import FormatSwitch from "./FormatSwitch";
import DraftControl from "./DraftControl";
import NewNoteButton from "./NewNoteButton";
import { NoteFormat } from "../model";

const ControlPanel = memo(function ControlPanel(props: {
  showNew: boolean;
  onNew: (format: NoteFormat) => void;

  showConvertToMarkdown: boolean;
  onConvertToMarkdown: () => void;

  showEdit: boolean;
  onEdit: () => void;

  showSave: boolean;
  onSave: () => void;

  showCancel: boolean;
  onCancel: () => void;

  showDelete: boolean;
  onDelete: () => void;

  showRestore: boolean;
  onRestore: () => void;

  showProgress: boolean;

  showFormatSwitch: boolean;
  isFormatMarkdown: boolean;
  onFormatSwitch: (isMarkdown: boolean) => void;

  hasDraft: boolean;
  onDiscardDraft: () => void;
}) {
  const showNew = props.showNew;
  const onNew = props.onNew;
  const showConvertToMarkdown = props.showConvertToMarkdown;
  const onConvertToMarkdown = props.onConvertToMarkdown;
  const showEdit = props.showEdit;
  const onEdit = props.onEdit;
  const showSave = props.showSave;
  const onSave = props.onSave;
  const showCancel = props.showCancel;
  const onCancel = props.onCancel;
  const showDelete = props.showDelete;
  const onDelete = props.onDelete;
  const showRestore = props.showRestore;
  const onRestore = props.onRestore;
  const showProgress = props.showProgress;
  const showFormatSwitch = props.showFormatSwitch;
  const isFormatMarkdown = props.isFormatMarkdown;
  const onFormatSwitch = props.onFormatSwitch;
  const hasDraft = props.hasDraft;
  const onDiscardDraft = props.onDiscardDraft;

  const convertToMarkdownButtonOnClick = () => {
    onConvertToMarkdown();
  };

  const editButtonOnClick = () => {
    onEdit();
  };

  const saveButtonOnClick = () => {
    onSave();
  };

  const cancelButtonOnClick = () => {
    onCancel();
  };

  const deleteButtonOnClick = () => {
    onDelete();
  };

  const restoreButtonOnClick = () => {
    onRestore();
  };

  return (
    <div className="control-panel">
      <div className="control-panel-inner">
        <div className="control-panel-left">
          {showNew ? <NewNoteButton onNew={onNew} /> : null}
        </div>
        <div className="control-panel-right">
          {hasDraft ? <DraftControl onDiscardDraft={onDiscardDraft} /> : null}
          {showConvertToMarkdown ? (
            <button
              className="control-panel-button"
              onClick={convertToMarkdownButtonOnClick}
            >
              {uistrings.ConvertToMarkdownButtonText}
            </button>
          ) : null}
          {showEdit ? (
            <button
              className="control-panel-button"
              onClick={editButtonOnClick}
            >
              {uistrings.EditButtonText}
            </button>
          ) : null}
          {showFormatSwitch ? (
            <FormatSwitch
              isMarkdown={isFormatMarkdown}
              onFormatSwitch={onFormatSwitch}
            />
          ) : null}
          {showSave ? (
            <button
              className="control-panel-button"
              onClick={saveButtonOnClick}
            >
              {uistrings.SaveButtonText}
            </button>
          ) : null}
          {showCancel ? (
            <button
              className="control-panel-button"
              onClick={cancelButtonOnClick}
            >
              {uistrings.CancelButtonText}
            </button>
          ) : null}
          {showDelete ? (
            <button
              className="control-panel-button"
              onClick={deleteButtonOnClick}
            >
              {uistrings.DeleteButtonText}
            </button>
          ) : null}
          {showRestore ? (
            <button
              className="control-panel-button"
              onClick={restoreButtonOnClick}
            >
              {uistrings.RestoreButtonText}
            </button>
          ) : null}
          {showProgress ? (
            <span className="control-panel-status">
              <OrbitProgressIndicator />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default ControlPanel;
