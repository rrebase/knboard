import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import { grid, borderRadius } from "const";
import { COLUMN_COLOR, G50, PRIMARY } from "utils/colors";
import { ITask } from "types";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import TaskList from "features/task/TaskList";
import ColumnTitle from "components/ColumnTitle";
import { TextareaAutosize } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { patchColumn } from "./ColumnSlice";

const Container = styled.div`
  margin: ${grid / 2}px;
  display: flex;
  flex-direction: column;
  border-top: 3px solid ${PRIMARY};
`;

const Header = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) => (isDragging ? G50 : COLUMN_COLOR)};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${G50};
  }
`;

type Props = {
  id: number;
  title: string;
  tasks: ITask[];
  index: number;
  isScrollable?: boolean;
  isCombineEnabled?: boolean;
};

const Column = ({
  id,
  title,
  tasks,
  index,
  isScrollable,
  isCombineEnabled
}: Props) => {
  const dispatch = useDispatch();
  const [pendingTitle, setPendingTitle] = useState<string>(title);
  const [editing, setEditing] = useState<boolean>(false);
  const titleTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    // Enter
    if (e.keyCode === 13) {
      e.preventDefault();
      if (pendingTitle.length > 0) {
        titleTextAreaRef?.current?.blur();
      }
    }
  };

  const handleSaveTitle = () => {
    if (pendingTitle.length > 0) {
      setEditing(false);
      dispatch(patchColumn({ id, fields: { title: pendingTitle } }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPendingTitle(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  return (
    <Draggable draggableId={`col-${id}`} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-testid={`col-${title}`}
        >
          <Header isDragging={snapshot.isDragging}>
            <ColumnTitle
              {...provided.dragHandleProps}
              aria-label={`${title} task list`}
              onClick={() => setEditing(true)}
              data-testid="column-title"
            >
              {editing ? (
                <div>
                  <TextareaAutosize
                    ref={titleTextAreaRef}
                    value={pendingTitle}
                    onChange={handleTitleChange}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleTitleKeyDown}
                    data-testid="column-title-textarea"
                    onFocus={handleFocus}
                    autoFocus
                  />
                </div>
              ) : (
                <div>{pendingTitle}</div>
              )}
              <div>{tasks.length}</div>
            </ColumnTitle>
          </Header>
          <TaskList
            columnId={id}
            listType="TASK"
            style={{
              backgroundColor: snapshot.isDragging ? G50 : null
            }}
            tasks={tasks}
            internalScroll={isScrollable}
            isCombineEnabled={Boolean(isCombineEnabled)}
          />
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
