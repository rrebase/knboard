import React from "react";

interface Props {
  saveLabel: string;
  setEditing: (editing: boolean) => void;
}

const EditActions = ({ saveLabel, setEditing }: Props) => {
  const handleSave = () => setEditing(false);
  const handleDelete = () => setEditing(false);
  const handleCancel = () => setEditing(false);

  return (
    <div>
      <div style={{ backgroundColor: "#5aac44" }} onClick={handleSave}>
        {saveLabel}
      </div>
      {handleDelete && (
        <div
          style={{ backgroundColor: "#EA2525", marginLeft: 0 }}
          onClick={handleDelete}
        >
          Delete
        </div>
      )}
      <div className="Edit-Button-Cancel" onClick={handleCancel}>
        X
      </div>
    </div>
  );
};

export default EditActions;
