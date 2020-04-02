import React from "react";
import { Button } from "@material-ui/core";
import styled from "@emotion/styled";
import { R50, T50, N30, N80A, N900 } from "utils/colors";
import { grid } from "const";
import { ITask } from "types";
import {
  DroppableProvided,
  DroppableStateSnapshot,
  Droppable
} from "react-beautiful-dnd";
import Task from "./Task";
import Title from "../../components/Title";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@emotion/core";
import { jake } from "data";
import TaskEditor from "./TaskEditor";

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

const AddCard = () => {
  const [adding, setAdding] = React.useState<boolean>(false);
  const newTask: ITask = { id: 999, title: "", author: jake, description: "" };

  return (
    <>
      {adding ? (
        <TaskEditor
          task={newTask}
          setEditing={() => null}
          text=""
          setText={() => null}
          adding={false}
        />
      ) : (
        <Button
          css={css`
            text-transform: inherit;
            color: ${N80A};
            padding: 4px 0;
            margin-top: 6px;
            margin-bottom: 6px;
            &:hover {
              color: ${N900};
            }
            .MuiButton-iconSizeMedium > *:first-of-type {
              font-size: 12px;
            }
          `}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          fullWidth
          onClick={() => setAdding(true)}
        >
          Add another card
        </Button>
      )}
    </>
  );
};

interface InnerListProps {
  dropProvided: DroppableProvided;
  tasks: ITask[];
  title?: string;
}

const InnerList = ({ tasks, dropProvided, title }: InnerListProps) => (
  <Container>
    {title ? <Title>{title}</Title> : null}
    <DropZone ref={dropProvided.innerRef}>
      <InnerTaskList tasks={tasks} />
      {dropProvided.placeholder}
    </DropZone>
    <AddCard />
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
  tasks: tasks,
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
              tasks={tasks}
              title={title}
              dropProvided={dropProvided}
            />
          </ScrollContainer>
        ) : (
          <InnerList tasks={tasks} title={title} dropProvided={dropProvided} />
        )}
      </Wrapper>
    )}
  </Droppable>
);

export default TaskList;
