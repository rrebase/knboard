import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Button,
  TextField,
  TextareaAutosize,
  useTheme,
  useMediaQuery,
  WithTheme,
} from "@material-ui/core";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditDialogOpen,
  deleteTask,
  updateTasksByColumn,
  patchTask,
} from "./TaskSlice";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faLock,
  faAlignLeft,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { createInfoToast } from "features/toast/ToastSlice";
import { PRIMARY, TASK_G } from "utils/colors";
import { IColumn, TasksByColumn, Id, Priority, Label } from "types";
import {
  selectAllColumns,
  selectColumnsEntities,
} from "features/column/ColumnSlice";
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
  Key,
  taskDialogHeight,
  taskSideWidth,
} from "const";
import Close from "components/Close";
import {
  selectAllLabels,
  selectLabelEntities,
} from "features/label/LabelSlice";
import { formatDistanceToNow } from "date-fns";
import getMetaKey from "utils/shortcuts";
import LabelChip from "components/LabelChip";
import PriorityOption from "components/PriorityOption";
import CommentSection from "features/comment/CommentSection";

const mdParser = new MarkdownIt({ breaks: true });

const Content = styled.div<WithTheme>`
  display: flex;
  padding: 2rem;
  height: ${taskDialogHeight}px;
  ${(props) => props.theme.breakpoints.down("xs")} {
    flex-direction: column;
  }
`;

const Main = styled.div`
  width: 100%;
`;

const Side = styled.div<WithTheme>`
  margin-top: 2rem;
  ${(props) => props.theme.breakpoints.up("sm")} {
    max-width: ${taskSideWidth}px;
    min-width: ${taskSideWidth}px;
  }
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

const EditorWrapper = styled.div<WithTheme & { editing: boolean }>`
  margin: 1rem 0;
  margin-right: 2rem;
  ${(props) => createMdEditorStyles(props.editing)};

  .rc-md-editor {
    min-height: ${(props) => (props.editing ? 180 : 32)}px;
    border: none;
    .section-container {
      ${(props) =>
        props.editing &&
        `
        outline: none;
        box-shadow: inset 0 0 0 2px ${PRIMARY};
      `};
      padding: ${(props) => (props.editing ? "8px" : "0px")} !important;
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

const Text = styled.p`
  color: #626e83;
  margin: 4px 0;
  font-size: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DESCRIPTION_PLACEHOLDER = "Write here...";

const EditTaskDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const columns = useSelector(selectAllColumns);
  const labels = useSelector(selectAllLabels);
  const labelsById = useSelector(selectLabelEntities);
  const columnsById = useSelector(selectColumnsEntities);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const taskId = useSelector((state: RootState) => state.task.editDialogOpen);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MdEditor>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
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
        end: description.length,
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

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode == Key.Enter && e.metaKey) {
      handleSaveDescription();
    }
    if (e.keyCode === Key.Escape) {
      // Prevent propagation from reaching the Dialog
      e.stopPropagation();
      handleCancelDescription();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === Key.Enter) {
      e.preventDefault();
      titleTextAreaRef?.current?.blur();
    }
    if (e.keyCode === Key.Escape) {
      // Prevent propagation from reaching the Dialog
      e.stopPropagation();
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
      [value.id]: next,
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
    if (window.confirm("Are you sure? Deleting a task cannot be undone.")) {
      dispatch(deleteTask(task.id));
      handleClose();
    }
  };

  const handleDescriptionClick = () => {
    setEditingDescription(true);
  };

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const handleLabelsChange = (newLabels: Label[]) => {
    dispatch(
      patchTask({
        id: taskId,
        fields: { labels: newLabels.map((label) => label.id) },
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // don't listen for input when inputs are focused
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === "Backspace" && e.metaKey) {
      handleDelete();
    }

    if (e.key === "Escape" && e.metaKey) {
      handleClose();
    }

    if (e.key === "l" && e.metaKey) {
      e.preventDefault();
      handleNotImplemented();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      fullWidth
      keepMounted={false}
      fullScreen={xsDown}
      css={css`
        .MuiDialog-paper {
          max-width: 920px;
        }
      `}
    >
      <Content theme={theme}>
        <Close onClose={handleClose} />
        <Main>
          <Header>id: {task.id}</Header>
          <Title>
            <FontAwesomeIcon icon={faArrowUp} />
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
              onDoubleClick={
                editingDescription ? undefined : handleDescriptionClick
              }
              editing={editingDescription}
              ref={wrapperRef}
              theme={theme}
              onKeyDown={handleEditorKeyDown}
            >
              <MdEditor
                ref={editorRef}
                plugins={MD_EDITOR_PLUGINS}
                config={
                  editingDescription ? MD_EDITING_CONFIG : MD_READ_ONLY_CONFIG
                }
                value={
                  editingDescription
                    ? description
                    : description || DESCRIPTION_PLACEHOLDER
                }
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                placeholder={DESCRIPTION_PLACEHOLDER}
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
                  Save ({getMetaKey()}+⏎)
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
                  Cancel (Esc)
                </Button>
              </DescriptionActions>
            )}
          </Description>
          <CommentSection taskId={task.id} />
        </Main>
        <Side theme={theme}>
          <TaskAssignees task={task} />
          <Autocomplete
            id="column-select"
            size="small"
            options={columns}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
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
            blurOnSelect
            autoHighlight
            options={PRIORITY_OPTIONS}
            getOptionLabel={(option) => option.label}
            value={PRIORITY_MAP[task.priority]}
            onChange={handlePriorityChange}
            renderInput={(params) => (
              <TextField {...params} label="Priority" variant="outlined" />
            )}
            renderOption={(option) => <PriorityOption option={option} />}
            openOnFocus
            disableClearable
            data-testid="edit-priority"
            css={css`
              width: 100%;
              margin-top: 1rem;
            `}
          />
          <Autocomplete
            multiple
            id="labels-select"
            data-testid="edit-labels"
            size="small"
            filterSelectedOptions
            autoHighlight
            openOnFocus
            blurOnSelect
            disableClearable
            options={labels}
            getOptionLabel={(option) => option.name}
            value={
              tasksById[taskId].labels.map(
                (labelId) => labelsById[labelId]
              ) as Label[]
            }
            onChange={(_, newLabels) => handleLabelsChange(newLabels)}
            renderInput={(params) => (
              <TextField {...params} label="Labels" variant="outlined" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <LabelChip
                  key={option.id}
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderOption={(option) => <LabelChip label={option} size="small" />}
            css={css`
              width: 100%;
              margin-top: 1rem;
              margin-bottom: 2rem;
            `}
          />
          <ButtonsContainer>
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
              Lock task ({getMetaKey()}+L)
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
                margin-bottom: 2rem;
              `}
            >
              Delete task ({getMetaKey()}+⌫)
            </Button>
          </ButtonsContainer>
          <Text>
            Updated {formatDistanceToNow(new Date(task.modified))} ago
          </Text>
          <Text
            css={css`
              margin-bottom: 1rem;
            `}
          >
            Created {formatDistanceToNow(new Date(task.created))} ago
          </Text>
        </Side>
      </Content>
    </Dialog>
  );
};

export default EditTaskDialog;
