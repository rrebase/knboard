import React from "react";
import styled from "@emotion/styled";
import TextareaAutosize from "react-textarea-autosize";
import EditActions from "./EditActions";
import { Avatar, Content, TaskFooter } from "./Task";
import { ITask } from "types";
import { N0 } from "colors";
import { taskContainerStyles } from "styles";

const Container = styled.div`
  border-color: "transparent";
  background-color: ${N0};
  box-shadow: "none";
`;

const Text = styled.div`
  min-height: 50px;
  padding-right: 14px;
  &:hover {
    background: white;
  }
  & .edit-textarea {
    width: 100%;
    border: none;
    resize: none;
    outline: none;

    /* From CssBaseline */
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    font-size: 0.875rem;
  }
`;

interface Props {
  quote: ITask;
  setEditing: (editing: boolean) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const TaskEditor = ({ quote, setEditing, text, setText }: Props) => {
  const [adding, setAdding] = React.useState<boolean>(false);

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
    <Container css={taskContainerStyles} onKeyDown={handleKeyDown}>
      <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
      <Content>
        <Text>
          <TextareaAutosize
            autoFocus
            placeholder="Enter the text for this card..."
            value={text}
            onChange={handleChange}
            className="edit-textarea"
          />
        </Text>
        <TaskFooter quote={quote} />
        <EditActions
          saveLabel={adding ? "Add card" : "Save"}
          setEditing={setEditing}
        />
      </Content>
    </Container>
  );
};

export default TaskEditor;
