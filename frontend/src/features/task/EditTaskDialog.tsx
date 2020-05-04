import React, { useState, useEffect, useRef } from "react";
import { Dialog, Button, TextField, TextareaAutosize } from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditDialogOpen,
  deleteTask,
  updateTasksByColumn,
  patchTask
} from "./TaskSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faLock,
  faAlignLeft,
  faCube
} from "@fortawesome/free-solid-svg-icons";
import { createInfoToast } from "features/toast/ToastSlice";
import { PRIMARY, TASK_G } from "utils/colors";
import { IColumn, TasksByColumn, Id, Priority } from "types";
import { selectAllColumns } from "features/column/ColumnSlice";
import { Autocomplete } from "@material-ui/lab";
import { createMdEditorStyles, descriptionStyles } from "styles";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import TaskAssignees from "./TaskAssignees";
import {
  MD_EDITOR_PLUGINS,
  borderRadius,
  PRIORITY_OPTIONS,
  PRIORITY_MAP,
  MD_EDITING_CONFIG,
  MD_READ_ONLY_CONFIG,
  Key
} from "const";
import Close from "components/Close";

const mdParser = new MarkdownIt({ breaks: true });

const Content = styled.div`
  display: flex;
  padding: 2rem;
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
  textarea {
    color: ${PRIMARY};
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    margin: 0 2rem 0 0.375rem;
    border: none;
    resize: none;
    &:focus {
      outline: none;
      border-radius: ${borderRadius}px;
      box-shadow: inset 0 0 0 2px ${PRIMARY};
    }
  }
`;

const EditorWrapper = styled.div<{ editing: boolean }>`
  margin: 1rem 0;
  margin-right: 2rem;
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
      padding: ${props => (props.editing ? "8px" : "0px")} !important;
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
  const columnsById = useSelector((state: RootState) => state.column.entities);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const taskId = useSelector((state: RootState) => state.task.editDialogOpen);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("Describe the task...");
  const [editingDescription, setEditingDescription] = useState(false);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MdEditor>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const open = taskId !== null;

  useEffect(() => {
    if (taskId && tasksById[taskId]) {
      setDescription(tasksById[taskId].description);
      setTitle(tasksById[taskId].title);
    }
  }, [open, taskId]);

  const handleSaveTitle = () => {
    if (taskId) {
      dispatch(patchTask({ id: taskId, fields: { title } }));
    }
  };

  const handleSaveDescription = () => {
    if (taskId) {
      dispatch(patchTask({ id: taskId, fields: { description } }));
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

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === Key.Enter) {
      e.preventDefault();
      titleTextAreaRef?.current?.blur();
    }
  };

  const handleClose = () => {
    dispatch(setEditDialogOpen(null));
    setEditingDescription(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
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

  const handlePriorityChange = (_: any, priority: Priority | null) => {
    if (priority) {
      dispatch(patchTask({ id: taskId, fields: { priority: priority.value } }));
    }
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
        <Close onClose={handleClose} />
        <Main>
          <Header>id: {task.id}</Header>
          <Title>
            <FontAwesomeIcon icon={faCube} />
            <TextareaAutosize
              ref={titleTextAreaRef}
              value={title}
              onChange={handleTitleChange}
              onBlur={handleSaveTitle}
              onKeyDown={handleTitleKeyDown}
              data-testid="task-title"
            />
          </Title>
          <DescriptionHeader>
            <FontAwesomeIcon icon={faAlignLeft} />
            <h3>Description</h3>
          </DescriptionHeader>
          <Description
            key={`${taskId}${editingDescription}`}
            data-testid="task-description"
          >
            <EditorWrapper
              onClick={editingDescription ? undefined : handleDescriptionClick}
              editing={editingDescription}
              ref={wrapperRef}
            >
              <MdEditor
                ref={editorRef}
                plugins={MD_EDITOR_PLUGINS}
                config={
                  editingDescription ? MD_EDITING_CONFIG : MD_READ_ONLY_CONFIG
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
          <TaskAssignees task={task} />
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
            `}
          />
          <Autocomplete
            id="priority-select"
            size="small"
            options={PRIORITY_OPTIONS}
            getOptionLabel={option => option.label}
            value={PRIORITY_MAP[task.priority]}
            onChange={handlePriorityChange}
            renderInput={params => (
              <TextField {...params} label="Priority" variant="outlined" />
            )}
            openOnFocus
            disableClearable
            data-testid="edit-priority"
            css={css`
              width: 100%;
              margin-top: 1rem;
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
