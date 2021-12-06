import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { Key } from "const";
import { TextareaAutosize } from "@material-ui/core";
import { css } from "@emotion/core";
import { useDispatch } from "react-redux";
import { Id } from "types";
import { patchBoard } from "features/board/BoardSlice";

const Container = styled.div`
  color: #6869f6;
  textarea {
    color: #6869f6;
    font-weight: bold;
  }
`;

interface Props {
  id: Id;
  name: string;
  isOwner: boolean;
}

const BoardName = ({ id, name, isOwner, ...props }: Props) => {
  const dispatch = useDispatch();
  const [pendingName, setPendingName] = useState<string>(name);
  const [editing, setEditing] = useState<boolean>(false);
  const nameTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing && name === pendingName) {
      nameTextAreaRef?.current?.blur();
    }
  }, [pendingName, editing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === Key.Enter) {
      e.preventDefault();
      if (pendingName.length > 0) {
        nameTextAreaRef?.current?.blur();
      }
    }
    if (e.keyCode === Key.Escape) {
      e.preventDefault();
      setPendingName(name);
      setEditing(false);
      // blur via useEffect
    }
  };

  const handleSave = () => {
    if (editing && pendingName.length > 0) {
      setEditing(false);
      if (pendingName !== name) {
        dispatch(patchBoard({ id, fields: { name: pendingName } }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPendingName(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  return (
    <Container {...props}>
      {editing ? (
        <div>
          <TextareaAutosize
            ref={nameTextAreaRef}
            value={pendingName}
            onChange={handleChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            data-testid="board-name-textarea"
            onFocus={handleFocus}
            autoFocus
          />
        </div>
      ) : (
        <div
          css={css`
            ${isOwner && `&:hover {cursor: pointer;}`}
          `}
          onClick={() => setEditing(isOwner)}
        >
          {pendingName}
        </div>
      )}
    </Container>
  );
};

export default BoardName;
