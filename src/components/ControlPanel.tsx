import "./ControlPanel.css";
import uistrings from "../uistrings";

function ControlPanel(props: {
  onNew: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  const onNew = props.onNew;
  const onEdit = props.onEdit;
  const onSave = props.onSave;
  const onCancel = props.onCancel;
  const onDelete = props.onDelete;
  const onRestore = props.onRestore;

  // TODO: control visibility

  const newButtonOnClick = () => {
    onNew();
  };

  const newButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onNew();
      e.preventDefault();
    }
  };

  const editButtonOnClick = () => {
    onEdit();
  };

  const editButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onEdit();
      e.preventDefault();
    }
  };

  const saveButtonOnClick = () => {
    onSave();
  };

  const saveButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onSave();
      e.preventDefault();
    }
  };

  const cancelButtonOnClick = () => {
    onCancel();
  };

  const cancelButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onCancel();
      e.preventDefault();
    }
  };

  const deleteButtonOnClick = () => {
    onDelete();
  };

  const deleteButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onDelete();
      e.preventDefault();
    }
  };

  const restoreButtonOnClick = () => {
    onRestore();
  };

  const restoreButtonOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      onRestore();
      e.preventDefault();
    }
  };

  // TODO: make buttons and extract into a separate component
  return (
    <div className="control-panel">
      <div className="control-panel-left">
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={newButtonOnClick}
          onKeyDown={newButtonOnKeyDown}
        >
          {uistrings.NewButtonText}
        </a>
      </div>
      <div className="control-panel-right">
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={editButtonOnClick}
          onKeyDown={editButtonOnKeyDown}
        >
          {uistrings.EditButtonText}
        </a>
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={saveButtonOnClick}
          onKeyDown={saveButtonOnKeyDown}
        >
          {uistrings.SaveButtonText}
        </a>
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={cancelButtonOnClick}
          onKeyDown={cancelButtonOnKeyDown}
        >
          {uistrings.CancelButtonText}
        </a>
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={deleteButtonOnClick}
          onKeyDown={deleteButtonOnKeyDown}
        >
          {uistrings.DeleteButtonText}
        </a>
        <a
          className="control-panel-button"
          tabIndex={0}
          onClick={restoreButtonOnClick}
          onKeyDown={restoreButtonOnKeyDown}
        >
          {uistrings.RestoreButtonText}
        </a>
      </div>
    </div>
  );
}

export default ControlPanel;
