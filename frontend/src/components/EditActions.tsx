import React from "react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconBoxStyles } from "styles";

const Actions = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-right: 8px;
  }
`;

const CancelIcon = styled.div``;

interface Props {
  saveLabel: string;
  setEditing: (editing: boolean) => void;
}

const EditActions = ({ saveLabel, setEditing }: Props) => {
  const handleSave = () => setEditing(false);
  const handleDelete = () => setEditing(false);
  const handleCancel = () => setEditing(false);

  return (
    <Actions>
      <Button onClick={handleSave} variant="contained" size="small">
        {saveLabel}
      </Button>
      {handleDelete && (
        <Button size="small" onClick={handleDelete} variant="outlined">
          Delete
        </Button>
      )}
      <CancelIcon css={iconBoxStyles} onClick={handleCancel}>
        <FontAwesomeIcon icon={faTimes} color="#999" />
      </CancelIcon>
    </Actions>
  );
};

export default EditActions;
