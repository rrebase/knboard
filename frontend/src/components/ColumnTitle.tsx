import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { grid, borderRadius, Key, taskHeaderTextareaWidth } from "const";
import { P100, PRIMARY, TASK_G as ACTION_G } from "utils/colors";
import { TextareaAutosize, Button, Popover } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Id } from "types";
import { patchColumn, deleteColumn } from "features/column/ColumnSlice";
import { css } from "@emotion/core";

const Container = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  color: ${PRIMARY};
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
  &:focus {
    outline: 2px solid ${P100};
    outline-offset: 2px;
  }
  textarea {
    color: ${PRIMARY};
    font-weight: bold;
    width: ${taskHeaderTextareaWidth}px;
    border: none;
    resize: none;
    border-radius: ${borderRadius}px;
    box-shadow: inset 0 0 0 1px #ccc;
    line-height: 1.43;
    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px ${PRIMARY};
    }
  }
`;

const InputTitle = styled.div`
  display: flex;
  align-items: center;
`;

const RegularTitle = styled.div`
  margin: 0;
  font-size: 14px;
  align-self: center;
  word-break: break-word;
  width: ${taskHeaderTextareaWidth}px;
  &:hover {
    cursor: pointer;
  }
`;

const Extra = styled.div`
  display: flex;
  align-items: flex-start;
`;

const InnerExtra = styled.div`
  display: flex;
  align-items: center;
`;

const Count = styled.div`
  overflow-wrap: anywhere;
  font-size: 14px;
`;

const OptionsContent = styled.div`
  padding: 0.75rem;
`;

interface Props {
  id: Id;
  title: string;
  tasksCount: number;
}

const ColumnTitle = ({ id, title, tasksCount, ...props }: Props) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [pendingTitle, setPendingTitle] = useState<string>(title);
  const [editing, setEditing] = useState<boolean>(false);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing && title === pendingTitle) {
      titleTextAreaRef?.current?.blur();
    }
  }, [pendingTitle, editing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === Key.Enter) {
      e.preventDefault();
      if (pendingTitle.length > 0) {
        titleTextAreaRef?.current?.blur();
      }
    }
    if (e.keyCode === Key.Escape) {
      e.preventDefault();
      setPendingTitle(title);
      setEditing(false);
      // blur via useEffect
    }
  };

  const handleSave = () => {
    if (editing && pendingTitle.length > 0) {
      setEditing(false);
      if (pendingTitle !== title) {
        dispatch(patchColumn({ id, fields: { title: pendingTitle } }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPendingTitle(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure? Deleting the column will also delete related tasks and this cannot be undone."
      )
    ) {
      dispatch(deleteColumn(id));
      handleOptionsClose();
    }
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? `col-${id}options-popover` : undefined;

  return (
    <Container {...props}>
      {editing ? (
        <InputTitle>
          <TextareaAutosize
            ref={titleTextAreaRef}
            value={pendingTitle}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            data-testid="column-title-textarea"
            onFocus={handleFocus}
            autoFocus
          />
        </InputTitle>
      ) : (
        <RegularTitle onClick={() => setEditing(true)}>
          {pendingTitle}
        </RegularTitle>
      )}
      <Extra>
        <InnerExtra>
          <Count>{tasksCount}</Count>
          <Button
            onClick={handleOptionsClick}
            data-testid="col-options"
            css={css`
              margin-left: 0.25rem;
              min-width: 0;
              padding: 2px 8px;
              height: 22px;
            `}
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </Button>
        </InnerExtra>
        <Popover
          id={popoverId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleOptionsClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <OptionsContent>
            <Button
              startIcon={<FontAwesomeIcon fixedWidth icon={faTrash} />}
              onClick={handleDelete}
              data-testid="delete-column"
              size="small"
              css={css`
                font-size: 12px;
                font-weight: bold;
                color: ${ACTION_G};
              `}
            >
              Delete column
            </Button>
          </OptionsContent>
        </Popover>
      </Extra>
    </Container>
  );
};

export default ColumnTitle;
