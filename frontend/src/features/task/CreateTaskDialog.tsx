import React, { useEffect, useState } from "react";
import {
  Dialog,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
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
  MD_EDITOR_CONFIG,
  Key,
} from "const";
import { selectAllMembers } from "features/member/MemberSlice";
import { Priority, BoardMember, Label } from "types";
import { createMdEditorStyles } from "styles";
import AvatarTag from "components/AvatarTag";
import AvatarOption from "components/AvatarOption";
import { selectAllLabels } from "features/label/LabelSlice";
import getMetaKey from "utils/shortcuts";
import LabelChip from "components/LabelChip";
import PriorityOption from "components/PriorityOption";

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
  .rc-md-editor {
    min-height: 160px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const CreateTaskDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const labelsOptions = useSelector(selectAllLabels);
  const members = useSelector(selectAllMembers);
  const open = useSelector((state: RootState) => state.task.createDialogOpen);
  const columnId = useSelector(
    (state: RootState) => state.task.createDialogColumn
  );
  const createLoading = useSelector(
    (state: RootState) => state.task.createLoading
  );
  const [titleTouched, setTitleTouched] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [assignees, setAssignees] = useState<BoardMember[]>([]);
  const [priority, setPriority] = useState<Priority | null>({
    value: "M",
    label: "Medium",
  });
  const [labels, setLabels] = useState<Label[]>([]);
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const handleEditorChange = ({ text }: any) => {
    setDescription(text);
  };

  const setInitialValues = () => {
    if (columnId) {
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
    if (window.confirm("Are you sure? Any progress made will be lost.")) {
      dispatch(setCreateDialogOpen(false));
    }
  };

  const handleCreate = async () => {
    setTitleTouched(true);
    if (columnId && priority) {
      const newTask = {
        title,
        description,
        column: columnId,
        labels: labels.map((l) => l.id),
        assignees: assignees.map((a) => a.id),
        priority: priority.value,
      };
      dispatch(createTask(newTask));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode == Key.Enter && e.metaKey) {
      handleCreate();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      keepMounted={false}
      fullScreen={xsDown}
    >
      <Content onKeyDown={handleKeyDown}>
        <DialogTitle>New issue</DialogTitle>

        <TextField
          autoFocus
          id="create-task-title"
          data-testid="create-task-title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            placeholder="Describe the issue..."
          />
        </EditorWrapper>

        <Autocomplete
          multiple
          filterSelectedOptions
          disableClearable
          openOnFocus
          id="create-assignee-select"
          size="small"
          options={members}
          getOptionLabel={(option) => option.username}
          value={assignees}
          onChange={(_event, value) => setAssignees(value)}
          renderOption={(option) => <AvatarOption option={option} />}
          renderInput={(params) => (
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
          css={css`
            width: 100%;
            margin-top: 1rem;
          `}
        />

        <Autocomplete
          id="create-priority-select"
          size="small"
          autoHighlight
          options={PRIORITY_OPTIONS}
          getOptionLabel={(option) => option.label}
          value={priority}
          onChange={(_: any, value: Priority | null) => setPriority(value)}
          renderOption={(option) => <PriorityOption option={option} />}
          renderInput={(params) => (
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
          openOnFocus
          options={labelsOptions}
          getOptionLabel={(option) => option.name}
          value={labels}
          onChange={(_, newLabels) => setLabels(newLabels)}
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
            margin-top: 1rem;
            width: 100%;
          `}
        />
      </Content>

      <Footer theme={theme}>
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
          css={css`
            ${theme.breakpoints.down("xs")} {
              flex-grow: 1;
            }
          `}
        >
          Create issue ({getMetaKey()}+⏎)
        </Button>
        <Button
          css={css`
            margin-left: 1rem;
          `}
          onClick={handleClose}
        >
          Cancel (Esc)
        </Button>
      </Footer>
    </Dialog>
  );
};

export default CreateTaskDialog;
