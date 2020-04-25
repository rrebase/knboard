import React, { useState, useEffect, useRef } from "react";
import { Dialog, Button, IconButton, TextField } from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditDialogOpen,
  deleteTask,
  updateTasksByColumn,
  updateTaskDescription
} from "./TaskSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faLock,
  faAlignLeft,
  faBolt
} from "@fortawesome/free-solid-svg-icons";
import { createInfoToast } from "features/toast/ToastSlice";
import { PRIMARY, TASK_G } from "utils/colors";
import { ReactComponent as TimesIcon } from "static/svg/times.svg";
import { IColumn, TasksByColumn, Id } from "types";
import { selectAllColumns } from "features/column/ColumnSlice";
import { Autocomplete } from "@material-ui/lab";
import { createMdEditorStyles, descriptionStyles } from "styles";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { MD_EDITOR_PLUGINS } from "const";

const mdParser = new MarkdownIt({ breaks: true });

const Content = styled.div`
  display: flex;
  padding: 2rem;
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
  h3 {
    margin: 0 0.25rem 0 0;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${PRIMARY};
  font-size: 1rem;
  h3 {
    font-size: 20px;
    margin: 0 0 0 0.75rem;
  }
`;

const EditorWrapper = styled.div<{ editing: boolean }>`
  margin: 1rem 0;
  margin-right: 1rem;
  ${props => createMdEditorStyles(props.editing)};

  .rc-md-editor {
    border: none;
    .section-container {
      ${props =>
        props.editing &&
        `
        outline: none;
        box-shadow: inset 0 0 0 2px ${PRIMARY};
        `};
      &.input {
        line-height: 20px;
      }
    }
  }
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  h3 {
    margin: 0 0 0 12px;
  }
`;

const Description = styled.div`
  ${descriptionStyles}
`;

const DescriptionActions = styled.div`
  display: flex;
`;

const EditTaskDialog = () => {
  const dispatch = useDispatch();
  const columns: IColumn[] = useSelector(selectAllColumns);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const columnsById = useSelector((state: RootState) => state.column.entities);
  const taskId = useSelector((state: RootState) => state.task.editDialogOpen);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const [description, setDescription] = useState("Describe the task...");
  const [editingDescription, setEditingDescription] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MdEditor>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const open = taskId !== null;

  useEffect(() => {
    if (taskId && tasksById[taskId]) {
      setDescription(tasksById[taskId].description);
    }
  }, [open, taskId]);

  const handleSaveDescription = () => {
    if (taskId) {
      dispatch(updateTaskDescription({ id: taskId, description }));
      setEditingDescription(false);
    }
  };

  const handleCancelDescription = () => {
    if (taskId && tasksById[taskId]) {
      setDescription(tasksById[taskId].description);
      setEditingDescription(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        cancelRef.current &&
        !cancelRef.current?.contains(event.target)
      ) {
        handleSaveDescription();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, taskId, description]);

  useEffect(() => {
    if (editingDescription && editorRef && editorRef.current) {
      editorRef.current.setSelection({
        start: 0,
        end: description.length
      });
    }
  }, [editingDescription]);

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
    setEditingDescription(false);
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

  const handleDescriptionClick = () => {
    setEditingDescription(true);
  };

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      keepMounted={false}
      css={css`
        .MuiDialog-paper {
          max-width: 768px;
        }
      `}
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
          <Title>
            <FontAwesomeIcon icon={faBolt} />
            <h3>{task.title}</h3>
          </Title>
          <DescriptionHeader>
            <FontAwesomeIcon icon={faAlignLeft} />
            <h3>Description</h3>
          </DescriptionHeader>
          <Description
            onClick={editingDescription ? undefined : handleDescriptionClick}
            key={`${taskId}${editingDescription}`}
            data-testid="task-description"
          >
            <EditorWrapper editing={editingDescription} ref={wrapperRef}>
              <MdEditor
                ref={editorRef}
                plugins={MD_EDITOR_PLUGINS}
                config={
                  editingDescription
                    ? {
                        view: {
                          menu: false,
                          md: true,
                          html: false
                        },
                        canView: {
                          menu: false,
                          md: true,
                          html: false,
                          fullScreen: false,
                          hideMenu: false
                        }
                      }
                    : {
                        view: {
                          menu: false,
                          md: false,
                          html: true
                        },
                        canView: {
                          menu: false,
                          md: false,
                          html: true,
                          fullScreen: false,
                          hideMenu: false
                        }
                      }
                }
                value={description}
                renderHTML={text => mdParser.render(text)}
                onChange={handleEditorChange}
              />
            </EditorWrapper>
            {editingDescription && (
              <DescriptionActions>
                <Button
                  variant="contained"
                  data-testid="save-description"
                  onClick={handleSaveDescription}
                  color="primary"
                  size="small"
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  data-testid="cancel-description"
                  onClick={handleCancelDescription}
                  ref={cancelRef}
                  size="small"
                  css={css`
                    margin-left: 0.5rem;
                  `}
                >
                  Cancel
                </Button>
              </DescriptionActions>
            )}
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
