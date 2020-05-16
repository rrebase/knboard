import React, { useEffect, useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  CircularProgress,
  Chip
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
import {
  selectAllColumns,
  selectColumnsEntities
} from "features/column/ColumnSlice";
import { selectAllMembers } from "features/member/MemberSlice";
import { Priority, BoardMember, IColumn, Label } from "types";
import { createMdEditorStyles } from "styles";
import AvatarTag from "components/AvatarTag";
import AvatarOption from "components/AvatarOption";
import { selectAllLabels } from "features/label/LabelSlice";

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
  const labelsOptions = useSelector(selectAllLabels);
  const columns: IColumn[] = useSelector(selectAllColumns);
  const columnsById = useSelector(selectColumnsEntities);
  const members = useSelector(selectAllMembers);
  const open = useSelector((state: RootState) => state.task.createDialogOpen);
  const defaultColumnId = useSelector(
    (state: RootState) => state.task.createDialogColumn
  );
  const createLoading = useSelector(
    (state: RootState) => state.task.createLoading
  );
  const [titleTouched, setTitleTouched] = useState<boolean>(false);
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
  const [labels, setLabels] = useState<Label[]>([]);

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const setInitialValues = () => {
    if (defaultColumnId) {
      setColumn(columnsById[defaultColumnId] || null);
      setTitleTouched(false);
      setTitle("");
      setDescription("");
      setAssignees([]);
      setPriority(PRIORITY_2);
      setLabels([]);
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [open]);

  const handleClose = () => {
    dispatch(setCreateDialogOpen(false));
  };

  const handleCreate = async () => {
    setTitleTouched(true);
    if (defaultColumnId && column && priority) {
      const newTask = {
        title,
        description,
        column: column.id,
        labels: labels.map(l => l.id),
        assignees: assignees.map(a => a.id),
        priority: priority.value
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
          data-testid="create-task-title"
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          onBlur={() => setTitleTouched(true)}
          error={titleTouched && !title}
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
          renderOption={option => <AvatarOption option={option} />}
          renderInput={params => (
            <TextField {...params} label="Assignees" variant="outlined" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <AvatarTag
                key={option.id}
                option={option}
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

        <Autocomplete
          multiple
          id="create-labels-select"
          size="small"
          filterSelectedOptions
          autoHighlight
          options={labelsOptions}
          getOptionLabel={option => option.name}
          value={labels}
          onChange={(_, newLabels) => setLabels(newLabels)}
          renderInput={params => (
            <TextField {...params} label="Labels" variant="outlined" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                size="small"
                key={option.id}
                variant="outlined"
                label={option.name}
                {...getTagProps({ index })}
              />
            ))
          }
          css={css`
            margin-top: 1rem;
            width: 100%;
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
          data-testid="task-create"
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
