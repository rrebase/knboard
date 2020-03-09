import React from "react";
import styled from "@emotion/styled";
import { grid, borderRadius } from "const";
import { N30, G50 } from "colors";
import { ITask } from "types";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import TaskList from "components/TaskList";
import Title from "components/Title";

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) => (isDragging ? G50 : N30)};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${G50};
  }
`;

type Props = {
  title: string;
  quotes: ITask[];
  index: number;
  isScrollable?: boolean;
  isCombineEnabled?: boolean;
};

const Column = ({
  title,
  quotes,
  index,
  isScrollable,
  isCombineEnabled
}: Props) => {
  return (
    <Draggable draggableId={title} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <Header isDragging={snapshot.isDragging}>
            <Title
              {...provided.dragHandleProps}
              aria-label={`${title} quote list`}
            >
              {title}
            </Title>
          </Header>
          <TaskList
            listId={title}
            listType="QUOTE"
            style={{
              backgroundColor: snapshot.isDragging ? G50 : null
            }}
            quotes={quotes}
            internalScroll={isScrollable}
            isCombineEnabled={Boolean(isCombineEnabled)}
          />
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
