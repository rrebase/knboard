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
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

import { setCreateDialogOpen, createTask } from "./TaskSlice";
import { PRIMARY } from "utils/colors";
import {
  PRIORITY_OPTIONS,
  PRIORITY_2,
  MD_EDITOR_PLUGINS,
  MD_EDITOR_CONFIG
} from "const";
import { selectAllColumns } from "features/column/ColumnSlice";
import { selectAllMembers } from "features/member/MemberSlice";
import { Priority, BoardMember, IColumn } from "types";
import { createMdEditorStyles } from "styles";

const mdParser = new MarkdownIt();

const DialogTitle = styled.h3`
  color: ${PRIMARY};
  margin-top: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
`;

const EditorWrapper = styled.div`
  margin: 1rem 0;
  ${createMdEditorStyles(false)}
`;

const Footer = styled.div`
  text-align: right;
  border-top: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const CreateTaskDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.task.createDialogOpen);
  const defaultColumnId = useSelector(
    (state: RootState) => state.task.createDialogColumn
  );
  const columns: IColumn[] = useSelector(selectAllColumns);
  const columnsById = useSelector((state: RootState) => state.column.entities);
  const members = useSelector((state: RootState) => selectAllMembers(state));
  const createLoading = useSelector(
    (state: RootState) => state.task.createLoading
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>(
    "Describe the task..."
  );
  const [column, setColumn] = useState<IColumn | null>(null);
  const [assignees, setAssignees] = useState<BoardMember[]>([]);
  const [priority, setPriority] = useState<Priority | null>({
    value: "M",
    label: "Medium"
  });

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const setInitialValues = () => {
    if (defaultColumnId) {
      setColumn(columnsById[defaultColumnId] || null);
      setTitle("");
      setDescription("");
      setAssignees([]);
      setPriority(PRIORITY_2);
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [open]);

  const handleClose = () => {
    dispatch(setCreateDialogOpen(false));
  };

  const handleCreate = async () => {
    if (defaultColumnId && column && priority) {
      const newTask = {
        title: title,
        description,
        column: column.id,
        assignees,
        priority
      };
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
          id="create-task-title"
          label="Short Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
        />

        <EditorWrapper>
          <MdEditor
            plugins={MD_EDITOR_PLUGINS}
            config={MD_EDITOR_CONFIG}
            value={description}
            renderHTML={text => mdParser.render(text)}
            onChange={handleEditorChange}
          />
        </EditorWrapper>

        <Autocomplete
          id="create-column-select"
          size="small"
          options={columns}
          getOptionLabel={option => option.title}
          renderInput={params => (
            <TextField {...params} label="Column" variant="outlined" />
          )}
          value={column}
          onChange={(_: any, value: IColumn | null) => setColumn(value)}
          disableClearable
          openOnFocus
          css={css`
            width: 100%;
          `}
        />

        <Autocomplete
          multiple
          filterSelectedOptions
          id="create-assignee-select"
          size="small"
          options={members}
          getOptionLabel={option => option.username}
          value={assignees}
          onChange={(_event, value) => setAssignees(value)}
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
          id="create-priority-select"
          size="small"
          options={PRIORITY_OPTIONS}
          getOptionLabel={option => option.label}
          value={priority}
          onChange={(_: any, value: Priority | null) => setPriority(value)}
          renderInput={params => (
            <TextField {...params} label="Priority" variant="outlined" />
          )}
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
