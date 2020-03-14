import React from "react";
import styled from "@emotion/styled";
import TextareaAutosize from "react-textarea-autosize";
import EditActions from "../../components/EditActions";
import { Avatar, Content, TaskFooter } from "./Task";
import { N0 } from "colors";
import { taskContainerStyles } from "styles";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "features/task/TaskSlice";
import { ITask } from "types";

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
  task: ITask;
  setEditing: (editing: boolean) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  adding: boolean;
}

const TaskEditor = ({ task, setEditing, text, setText, adding }: Props) => {
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    const newTask: ITask = { ...task, title: text };
    dispatch(updateTask(newTask));
    setEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const handleCancel = () => {
    setEditing(false);
    setText(task.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSave();
    }
    // Escape
    if (e.keyCode === 27) {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <Container css={taskContainerStyles} onKeyDown={handleKeyDown}>
      <Avatar src={task.author.avatarUrl} alt={task.author.name} />
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
        <TaskFooter task={task} />
        <EditActions
          saveLabel={adding ? "Add card" : "Save"}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
        />
      </Content>
    </Container>
  );
};

export default TaskEditor;
