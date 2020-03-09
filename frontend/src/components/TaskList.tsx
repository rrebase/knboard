import React from "react";
import styled from "@emotion/styled";
import { R50, T50, N30 } from "colors";
import { grid } from "const";
import { ITask } from "types";
import {
  DroppableProvided,
  DroppableStateSnapshot,
  Droppable
} from "react-beautiful-dnd";
import Task from "./Task";
import Title from "./Title";

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return R50;
  }
  if (isDraggingFrom) {
    return T50;
  }
  return N30;
};

const Wrapper = styled.div<{
  isDraggingOver: boolean;
  isDraggingFrom: boolean;
  isDropDisabled?: boolean;
}>`
  background-color: ${props =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : "inherit")};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

const Container = styled.div``;

interface Props {
  listId?: string;
  listType?: string;
  quotes: ITask[];
  title?: string;
  internalScroll?: boolean;
  scrollContainerStyle?: Record<string, any>;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: Record<string, any>;
  ignoreContainerClipping?: boolean;
}

interface TaskListProps {
  quotes: ITask[];
}

const InnerTaskList = ({ quotes }: TaskListProps) => (
  <>
    {quotes.map((quote: ITask, index: number) => (
      <Task key={quote.id} quote={quote} index={index} />
    ))}
  </>
);

interface InnerListProps {
  dropProvided: DroppableProvided;
  quotes: ITask[];
  title?: string;
}

const InnerList = ({ quotes, dropProvided, title }: InnerListProps) => (
  <Container>
    {title ? <Title>{title}</Title> : null}
    <DropZone ref={dropProvided.innerRef}>
      <InnerTaskList quotes={quotes} />
      {dropProvided.placeholder}
    </DropZone>
  </Container>
);

const TaskList = ({
  ignoreContainerClipping,
  internalScroll,
  scrollContainerStyle,
  isDropDisabled,
  isCombineEnabled,
  listId = "LIST",
  listType,
  style,
  quotes,
  title
}: Props) => (
  <Droppable
    droppableId={listId}
    type={listType}
    ignoreContainerClipping={ignoreContainerClipping}
    isDropDisabled={isDropDisabled}
    isCombineEnabled={isCombineEnabled}
  >
    {(
      dropProvided: DroppableProvided,
      dropSnapshot: DroppableStateSnapshot
    ) => (
      <Wrapper
        style={style}
        isDraggingOver={dropSnapshot.isDraggingOver}
        isDropDisabled={isDropDisabled}
        isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
        {...dropProvided.droppableProps}
      >
        {internalScroll ? (
          <ScrollContainer style={scrollContainerStyle}>
            <InnerList
              quotes={quotes}
              title={title}
              dropProvided={dropProvided}
            />
          </ScrollContainer>
        ) : (
          <InnerList
            quotes={quotes}
            title={title}
            dropProvided={dropProvided}
          />
        )}
      </Wrapper>
    )}
  </Droppable>
);

export default TaskList;
