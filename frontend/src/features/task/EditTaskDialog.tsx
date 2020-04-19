import React from "react";
import { Dialog, Button, IconButton, TextField } from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditDialogOpen,
  deleteTask,
  updateTasksByColumn
} from "./TaskSlice";
import styled from "@emotion/styled";
import ReactQuill from "react-quill";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faLock } from "@fortawesome/free-solid-svg-icons";
import { createInfoToast } from "features/toast/ToastSlice";
import { PRIMARY, TASK_G } from "utils/colors";
import { ReactComponent as TimesIcon } from "static/svg/times.svg";
import { IColumn, TasksByColumn, Id } from "types";
import { selectAllColumns } from "features/column/ColumnSlice";
import { Autocomplete } from "@material-ui/lab";

const Content = styled.div`
  display: flex;
  padding: 2rem;

  ol {
    margin-block-start: 0.25em;
    margin-block-end: 0.25em;
    padding-inline-start: 30px;
  }
  p {
    margin: 0;
  }
  code {
    background-color: #f0f0f0;
    border-radius: 3px;
    font-size: 85%;
    padding: 2px 4px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const Main = styled.div`
  width: 100%;
`;

const Side = styled.div`
  margin-top: 2rem;
  width: 200px;
`;

const Header = styled.div`
  color: ${TASK_G};
  height: 2rem;
`;

const Title = styled.h3`
  font-size: 20px;
  color: ${PRIMARY};
  margin-top: 0;
`;

const Description = styled.div``;

const EditTaskDialog = () => {
  const dispatch = useDispatch();
  const columns: IColumn[] = useSelector(selectAllColumns);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const columnsById = useSelector((state: RootState) => state.column.entities);
  const taskId = useSelector((state: RootState) => state.task.editDialogOpen);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const open = taskId !== null;

  const findTaskColumnId = () => {
    for (const columnId in tasksByColumn) {
      for (const id of tasksByColumn[columnId]) {
        if (id === taskId) {
          return columnId;
        }
      }
    }
    return null;
  };

  const columnId = findTaskColumnId();

  if (!taskId || !tasksById[taskId] || !columnId) {
    return null;
  }

  const task = tasksById[taskId];
  const column = columnsById[columnId];

  const handleClose = () => {
    dispatch(setEditDialogOpen(null));
  };

  const handleColumnChange = (_: any, value: IColumn | null) => {
    if (!column || !value || column.id === value.id) {
      return;
    }
    const current: Id[] = [...tasksByColumn[column.id]];
    const next: Id[] = [...tasksByColumn[value.id]];

    const currentId = current.indexOf(task.id);
    const newPosition = 0;

    // remove from original
    current.splice(currentId, 1);
    // insert into next
    next.splice(newPosition, 0, task.id);

    const updatedTasksByColumn: TasksByColumn = {
      ...tasksByColumn,
      [column.id]: current,
      [value.id]: next
    };
    dispatch(updateTasksByColumn(updatedTasksByColumn));
    handleClose();
  };

  const handleNotImplemented = () => {
    dispatch(createInfoToast("Not implemented yet 😟"));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    handleClose();
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
        <Close>
          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="close"
            css={css`
              height: 2.5rem;
              width: 2.5rem;
              color: ${TASK_G};
              padding: 0.75rem;
            `}
          >
            <TimesIcon />
          </IconButton>
        </Close>
        <Main>
          <Header>id: {task.id}</Header>
          <Title>{task.title}</Title>
          <Description>
            <ReactQuill
              readOnly
              theme="snow"
              modules={{ toolbar: false }}
              value={task.description}
              css={css`
                .ql-container {
                  border: none;
                }
                .ql-editor {
                  padding: 0;
                }
              `}
            />
          </Description>
        </Main>
        <Side>
          <Autocomplete
            id="column-select"
            size="small"
            options={columns}
            getOptionLabel={option => option.title}
            renderInput={params => (
              <TextField {...params} label="Column" variant="outlined" />
            )}
            value={column}
            onChange={handleColumnChange}
            disableClearable
            openOnFocus
            data-testid="edit-column"
            css={css`
              width: 100%;
              margin-bottom: 2rem;
            `}
          />
          <Button
            startIcon={<FontAwesomeIcon fixedWidth icon={faLock} />}
            onClick={handleNotImplemented}
            size="small"
            css={css`
              font-size: 12px;
              font-weight: bold;
              color: ${TASK_G};
            `}
          >
            Lock task
          </Button>
          <Button
            startIcon={<FontAwesomeIcon fixedWidth icon={faTrash} />}
            onClick={handleDelete}
            data-testid="delete-task"
            size="small"
            css={css`
              font-size: 12px;
              font-weight: bold;
              color: ${TASK_G};
            `}
          >
            Delete task
          </Button>
        </Side>
      </Content>
    </Dialog>
  );
};

export default EditTaskDialog;
