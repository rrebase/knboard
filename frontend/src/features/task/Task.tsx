import React from "react";
import styled from "@emotion/styled";
import { ITask, PriorityValue } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot
} from "react-beautiful-dnd";
import { N30, N0, N70, PRIMARY } from "utils/colors";
import { grid, PRIO_COLORS } from "const";
import TaskEditor from "features/task/TaskEditor";
import EditButton from "./EditButton";
import { taskContainerStyles } from "styles";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Avatar } from "@material-ui/core";

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return "orange";
  }

  if (isGroupedOver) {
    return N30;
  }

  return N0;
};

const getBorderColor = (isDragging: boolean) =>
  isDragging ? "orange" : "transparent";

interface ContainerProps {
  isDragging: boolean;
  isGroupedOver: boolean;
}

const Container = styled.span<ContainerProps>`
  border-color: ${props => getBorderColor(props.isDragging)};
  background-color: ${props =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${N70}` : "none"};

  &:focus {
    border-color: #aaa;
  }
`;

export const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const TextContent = styled.div`
  position: relative;
  padding-right: 14px;
  word-break: break-word;
  color: ${PRIMARY};
  font-weight: bold;
  font-size: 12px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${grid}px;
  align-items: center;
`;

const Priority = styled.div<{ priority: PriorityValue }>`
  padding: 2px 6px;
  background-color: ${props => PRIO_COLORS[props.priority]};
  color: #fff;
  border-radius: 20px;
  font-size: 0.5rem;
  font-weight: bold;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: left;
  font-weight: bold;
  color: #aaa;
  font-size: 8px;
`;

const Assignees = styled.div``;

const getStyle = (provided: DraggableProvided, style?: Record<string, any>) => {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
};

export const TaskFooter = ({ task }: { task: ITask }) => {
  const membersByIds = useSelector((state: RootState) => state.member.entities);
  const assignees = task.assignees.map(assigneeId => membersByIds[assigneeId]);

  return (
    <Footer>
      <Priority priority={task.priority}>{task.priority}</Priority>
      {assignees.length > 0 && (
        <Assignees>
          <AvatarGroup
            max={3}
            css={css`
              & .MuiAvatarGroup-avatar {
                height: 1.25rem;
                width: 1.25rem;
                font-size: 8px;
                margin-left: -4px;
                border: none;
              }
            `}
          >
            {assignees.map(assignee => (
              <Avatar
                key={assignee?.id}
                css={css`
                  height: 1.25rem;
                  width: 1.25rem;
                  font-size: 8px;
                  margin-left: -12px;
                  &:hover {
                    cursor: pointer;
                  }
                `}
                src={assignee?.avatar?.photo}
                alt={assignee?.avatar?.name}
              >
                {assignee?.username.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
        </Assignees>
      )}
    </Footer>
  );
};

interface Props {
  task: ITask;
  style?: Record<string, any>;
  index: number;
}

const Task = ({ task: task, style, index }: Props) => {
  const [text, setText] = React.useState<string>(task.title);
  const [hover, setHover] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  const beginHover = () => setHover(true);
  const endHover = () => setHover(false);

  if (editing) {
    return (
      <TaskEditor
        task={task}
        setEditing={setEditing}
        text={text}
        setText={setText}
        adding={false}
      />
    );
  }

  return (
    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
      {(
        dragProvided: DraggableProvided,
        dragSnapshot: DraggableStateSnapshot
      ) => (
        <Container
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={getStyle(dragProvided, style)}
          data-is-dragging={dragSnapshot.isDragging}
          data-testid={`task-${task.id}`}
          data-index={index}
          aria-label={`task ${task.title}`}
          onMouseEnter={beginHover}
          onMouseLeave={endHover}
          css={taskContainerStyles}
        >
          <Content>
            <TextContent>{text}</TextContent>
            <TaskId>id: {task.id}</TaskId>
            <TaskFooter task={task} />
          </Content>
          {hover && (
            <EditButton taskId={task.id} handleClick={() => setEditing(true)} />
          )}
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Task);
