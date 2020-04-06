import React, { useEffect, useState } from "react";
import {
  Dialog,
  FormControl,
  Select,
  InputLabel,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { setDialogOpen, createTask } from "./TaskSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEgg } from "@fortawesome/free-solid-svg-icons";

const Header = styled.div`
  display: flex;
`;

const Main = styled.div`
  width: 100%;
  padding-right: 3rem;
`;

const Sidebar = styled.div`
  width: 200px;
  border-left: 1px solid #ccc;
  padding-left: 1rem;
`;

const Content = styled.div`
  display: flex;
  padding: 2rem;
`;

const Block = styled.div`
  margin-top: 2rem;

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

const Footer = styled.div`
  border-top: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const TaskDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.task.dialogOpen);
  const columnId = useSelector((state: RootState) => state.task.dialogColumn);
  const entities = useSelector((state: RootState) => state.column.entities);
  const createLoading = useSelector(
    (state: RootState) => state.task.createLoading
  );
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  const clearFields = () => {
    setTitle("");
    setText("");
  };

  useEffect(() => {
    clearFields();
  }, [open]);

  const handleClose = () => {
    dispatch(setDialogOpen(false));
  };

  const handleCreate = async () => {
    if (columnId) {
      const newTask = { title: title, description: text, column: columnId };
      dispatch(createTask(newTask));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      keepMounted={false}
    >
      <Content>
        <Main>
          <Header>
            <TextField
              autoFocus
              id="task-title"
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
            />
          </Header>

          <Block>
            <TextareaAutosize
              placeholder="Enter description for this card..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="edit-textarea"
              data-testid="edit-text"
            />
          </Block>
        </Main>
        <Sidebar>
          <FormControl variant="outlined">
            <InputLabel htmlFor="task-column">Column</InputLabel>
            <Select
              native
              value={columnId}
              onChange={() => null}
              label="Column"
              inputProps={{
                name: "column",
                id: "task-column"
              }}
              css={css`
                .MuiOutlinedInput-input {
                  padding: 12px 14px;
                  padding-right: 32px;
                }
              `}
              disabled
            >
              {columnId && (
                <option value={columnId}>{entities[columnId]?.title}</option>
              )}
            </Select>
          </FormControl>
        </Sidebar>
      </Content>
      <Footer>
        <Button
          startIcon={
            createLoading ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              <FontAwesomeIcon icon={faEgg} />
            )
          }
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreate}
          disabled={createLoading}
        >
          Create card
        </Button>
      </Footer>
    </Dialog>
  );
};

export default TaskDialog;
