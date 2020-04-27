import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { grid, borderRadius, Key } from "const";
import { P100, PRIMARY } from "utils/colors";
import { TextareaAutosize } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Id } from "types";
import { patchColumn } from "features/column/ColumnSlice";

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
  &:focus {
    outline: 2px solid ${P100};
    outline-offset: 2px;
  }
  textarea {
    color: ${PRIMARY};
    font-weight: bold;
    width: 100%;
    margin: 0 2rem 0 0.75rem;
    border: none;
    resize: none;
    &:focus {
      outline: none;
      border-radius: ${borderRadius}px;
      box-shadow: inset 0 0 0 2px ${PRIMARY};
    }
  }
`;

const InputTitle = styled.div``;

const RegularTitle = styled.div`
  width: 190px;
`;

const Extra = styled.div`
  display: flex;
`;

const Count = styled.div``;

const Options = styled.div`
  margin-left: 0.5rem;
`;

interface Props {
  id: Id;
  title: string;
  tasksCount: number;
}

const ColumnTitle = ({ id, title, tasksCount, ...props }: Props) => {
  const dispatch = useDispatch();
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
        <Count>{tasksCount}</Count>
        <Options>
          <FontAwesomeIcon icon={faEllipsisV} />
        </Options>
      </Extra>
    </Container>
  );
};

export default ColumnTitle;
