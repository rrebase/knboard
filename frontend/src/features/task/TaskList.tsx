import React from "react";
import styled from "@emotion/styled";
import { R50, T50, COLUMN_COLOR } from "utils/colors";
import { grid, barHeight } from "const";
import { ITask } from "types";
import {
  DroppableProvided,
  DroppableStateSnapshot,
  Droppable
} from "react-beautiful-dnd";
import Task from "./Task";
import AddTask from "./AddTask";
import { css } from "@emotion/core";

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
  return COLUMN_COLOR;
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
  columnId: number;
  listType?: string;
  tasks: ITask[];
  title?: string;
  internalScroll?: boolean;
  scrollContainerStyle?: Record<string, any>;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: Record<string, any>;
  ignoreContainerClipping?: boolean;
}

interface TaskListProps {
  tasks: ITask[];
}

const InnerTaskList = ({ tasks }: TaskListProps) => (
  <>
    {tasks.map((task: ITask, index: number) => (
      <Task key={task.id} task={task} index={index} />
    ))}
  </>
);

interface InnerListProps {
  dropProvided: DroppableProvided;
  columnId: number;
  tasks: ITask[];
}

const InnerList = ({ columnId, tasks, dropProvided }: InnerListProps) => (
  <Container>
    <DropZone
      data-testid="drop-zone"
      ref={dropProvided.innerRef}
      css={css`
        max-height: calc(100vh - ${barHeight * 5}px);
        overflow-y: scroll;
      `}
    >
      <InnerTaskList tasks={tasks} />
      {dropProvided.placeholder}
    </DropZone>
    <AddTask columnId={columnId} />
  </Container>
);

const TaskList = ({
  ignoreContainerClipping,
  internalScroll,
  scrollContainerStyle,
  isDropDisabled,
  isCombineEnabled,
  columnId,
  listType,
  style,
  tasks: tasks
}: Props) => (
  <Droppable
    droppableId={columnId.toString()}
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
              columnId={columnId}
              tasks={tasks}
              dropProvided={dropProvided}
            />
          </ScrollContainer>
        ) : (
          <InnerList
            columnId={columnId}
            tasks={tasks}
            dropProvided={dropProvided}
          />
        )}
      </Wrapper>
    )}
  </Droppable>
);

export default TaskList;
