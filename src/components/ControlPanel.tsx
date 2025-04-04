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
        <button className="control-panel-button" onClick={newButtonOnClick}>
          {uistrings.NewButtonText}
        </button>
      </div>
      <div className="control-panel-right">
        <button className="control-panel-button" onClick={editButtonOnClick}>
          {uistrings.EditButtonText}
        </button>
        <button className="control-panel-button" onClick={saveButtonOnClick}>
          {uistrings.SaveButtonText}
        </button>
        <button className="control-panel-button" onClick={cancelButtonOnClick}>
          {uistrings.CancelButtonText}
        </button>
        <button className="control-panel-button" onClick={deleteButtonOnClick}>
          {uistrings.DeleteButtonText}
        </button>
        <button className="control-panel-button" onClick={restoreButtonOnClick}>
          {uistrings.RestoreButtonText}
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
