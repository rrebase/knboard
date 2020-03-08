import React from "react";
import styled from "@emotion/styled";
import TextareaAutosize from "react-textarea-autosize";
import EditActions from "./EditActions";

const Wrapper = styled.div``;

const Text = styled.div`
  min-height: 50px;
  padding-left: 8px;
  padding-right: 15px;
  &:hover {
    background: white;
  }
  & .edit-textarea {
    width: 100%;
    border: none;
    resize: none;
    outline: none;
    font-size: 15px;
  }
`;

interface Props {
  setEditing: (editing: boolean) => void;
}

const TaskEditor = ({ setEditing }: Props) => {
  const [text, setText] = React.useState<string>("");
  const [adding, setAdding] = React.useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter
    if (e.keyCode === 13) {
      e.preventDefault();
      setEditing(false);
    }
    // Escape
    if (e.keyCode === 27) {
      e.preventDefault();
      setEditing(false);
    }
  };

  return (
    <Wrapper>
      <Text>
        <TextareaAutosize
          autoFocus
          placeholder="Enter the text for this card..."
          value={text}
          onChange={handleChange}
          className="edit-textarea"
          onKeyDown={handleKeyDown}
        />
      </Text>
      <EditActions
        saveLabel={adding ? "Add card" : "Save"}
        setEditing={setEditing}
      />
    </Wrapper>
  );
};

export default TaskEditor;
