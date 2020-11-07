import React from "react";
import styled from "@emotion/styled";
import { ITask, BoardMember } from "types";
import {
  DraggableProvided,
  Draggable,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { N30, N0, N70, PRIMARY } from "utils/colors";
import { PRIO_COLORS } from "const";
import { taskContainerStyles } from "styles";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@material-ui/core";
import { setEditDialogOpen } from "./TaskSlice";
import TaskLabels from "./TaskLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { selectMembersEntities } from "features/member/MemberSlice";

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return "#eee";
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
  border-color: ${(props) => getBorderColor(props.isDragging)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${N70}` : "none"};

  &:focus {
    border-color: #aaa;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardIcon = styled.div`
  display: flex;
  font-size: 0.75rem;
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
    ...style,
  };
};

export const TaskFooter = ({ task }: { task: ITask }) => {
  const membersByIds = useSelector(selectMembersEntities);
  const assignees = task.assignees.map(
    (assigneeId) => membersByIds[assigneeId]
  ) as BoardMember[];

  return (
    <Footer>
      <CardIcon data-testid="task-priority">
        <FontAwesomeIcon icon={faArrowUp} color={PRIO_COLORS[task.priority]} />
      </CardIcon>
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
            {assignees.map((assignee) => (
              <Avatar
                key={assignee.id}
                css={css`
                  height: 1.25rem;
                  width: 1.25rem;
                  font-size: 8px;
                  margin-left: -12px;
                `}
                src={assignee.avatar?.photo}
                alt={assignee.avatar?.name}
              >
                {assignee.username.charAt(0)}
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
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setEditDialogOpen(task.id));
  };

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
          onClick={handleClick}
          css={taskContainerStyles}
        >
          <Content>
            <TextContent>{task.title}</TextContent>
            <TaskId>id: {task.id}</TaskId>
            <TaskLabels task={task} />
            <TaskFooter task={task} />
          </Content>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo<Props>(Task);
