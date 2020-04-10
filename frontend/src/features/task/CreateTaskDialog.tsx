import React, { useEffect, useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Avatar
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { setDialogOpen, createTask } from "./TaskSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { PRIMARY } from "utils/colors";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  QUILL_MODULES,
  QUILL_FORMATS,
  borderRadius,
  PRIORITY_OPTIONS,
  PRIORITY_2
} from "const";
import { selectAllColumns } from "features/column/ColumnSlice";
import { selectAllMembers } from "features/member/MemberSlice";

const DialogTitle = styled.h3`
  color: ${PRIMARY};
  margin-top: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const Footer = styled.div`
  text-align: right;
  border-top: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const CreateTaskDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.task.dialogOpen);
  const columnId = useSelector((state: RootState) => state.task.dialogColumn);
  const columns = useSelector((state: RootState) => selectAllColumns(state));
  const columnsById = useSelector((state: RootState) => state.column.entities);
  const members = useSelector((state: RootState) => selectAllMembers(state));
  const createLoading = useSelector(
    (state: RootState) => state.task.createLoading
  );
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("Describe the task...");

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
        <DialogTitle>Create Task</DialogTitle>

        <TextField
          autoFocus
          id="task-title"
          label="Short Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
        />

        <ReactQuill
          theme="snow"
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          value={text}
          onChange={setText}
          placeholder="Describe the task here..."
          css={css`
            margin: 1rem 0;
            .ql-toolbar {
              border-top-left-radius: ${borderRadius}px;
              border-top-right-radius: ${borderRadius}px;
              border-bottom: 0;
            }
            .ql-container {
              border-bottom-left-radius: ${borderRadius}px;
              border-bottom-right-radius: ${borderRadius}px;
            }
            & .ql-editor {
              min-height: 110px;
            }
          `}
        />

        <Autocomplete
          id="column-select"
          size="small"
          options={columns}
          getOptionLabel={option => option.title}
          renderInput={params => (
            <TextField {...params} label="Column" variant="outlined" />
          )}
          defaultValue={columnId ? columnsById[columnId] : undefined}
          disableClearable
          openOnFocus
          css={css`
            width: 100%;
          `}
        />

        <Autocomplete
          multiple
          filterSelectedOptions
          id="assignee-select"
          size="small"
          options={members}
          getOptionLabel={option => option.username}
          renderOption={option => (
            <React.Fragment>
              <span>
                <Avatar
                  alt={option?.avatar?.name}
                  src={option?.avatar?.photo}
                />
              </span>
              <span
                css={css`
                  margin-left: 0.5rem;
                `}
              >
                {option.username}
              </span>
            </React.Fragment>
          )}
          renderInput={params => (
            <TextField {...params} label="Assignees" variant="outlined" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.id}
                avatar={
                  <Avatar
                    alt={option?.avatar?.name}
                    src={option?.avatar?.photo}
                  />
                }
                variant="outlined"
                label={option.username}
                size="small"
                {...getTagProps({ index })}
              />
            ))
          }
          disableClearable
          css={css`
            width: 100%;
            margin-top: 1rem;
          `}
        />

        <Autocomplete
          id="priority-select"
          size="small"
          options={PRIORITY_OPTIONS}
          renderInput={params => (
            <TextField {...params} label="Priority" variant="outlined" />
          )}
          defaultValue={PRIORITY_2}
          openOnFocus
          disableClearable
          css={css`
            width: 100%;
            margin-top: 1rem;
          `}
        />
      </Content>

      <Footer>
        <Button
          startIcon={
            createLoading ? (
              <CircularProgress color="inherit" size={16} />
            ) : (
              <FontAwesomeIcon icon={faRocket} />
            )
          }
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreate}
          disabled={createLoading}
        >
          Create Task
        </Button>
        <Button
          css={css`
            margin-left: 1rem;
          `}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Footer>
    </Dialog>
  );
};

export default CreateTaskDialog;
