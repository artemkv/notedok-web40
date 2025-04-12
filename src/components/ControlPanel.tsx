import "./ControlPanel.css";
import uistrings from "../uistrings";
import OrbitProgressIndicator from "./OrbitProgressIndicator";
import { memo } from "react";

const ControlPanel = memo(function ControlPanel(props: {
  showNew: boolean;
  onNew: () => void;

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

  const newButtonOnClick = () => {
    onNew();
  };

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
      <div className="control-panel-left">
        {showNew ? (
          <button className="control-panel-button" onClick={newButtonOnClick}>
            {uistrings.NewButtonText}
          </button>
        ) : null}
      </div>
      <div className="control-panel-right">
        {showConvertToMarkdown ? (
          <button
            className="control-panel-button"
            onClick={convertToMarkdownButtonOnClick}
          >
            {uistrings.ConvertToMarkdownButtonText}
          </button>
        ) : null}
        {showEdit ? (
          <button className="control-panel-button" onClick={editButtonOnClick}>
            {uistrings.EditButtonText}
          </button>
        ) : null}
        {showSave ? (
          <button className="control-panel-button" onClick={saveButtonOnClick}>
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
        {showProgress ? <OrbitProgressIndicator /> : null}
      </div>
    </div>
  );
});

export default ControlPanel;
