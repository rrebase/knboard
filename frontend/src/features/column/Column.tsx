import React from "react";
import styled from "@emotion/styled";
import { grid } from "const";
import { COLUMN_COLOR, PRIMARY } from "utils/colors";
import { ITask } from "types";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import TaskList from "features/task/TaskList";
import ColumnTitle from "components/ColumnTitle";
import { useDispatch } from "react-redux";
import {
  setCreateDialogColumn,
  setCreateDialogOpen,
} from "features/task/TaskSlice";

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
  background-color: ${COLUMN_COLOR};
  transition: background-color 0.2s ease;
  [data-rbd-drag-handle-context-id="0"] {
    cursor: initial;
  }
`;

type Props = {
  id: number;
  title: string;
  tasks: ITask[];
  index: number;
};

const Column = ({ id, title, tasks, index }: Props) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (index > 8) return;
      if (e.key === (index + 1).toString() && e.metaKey && e.shiftKey) {
        e.preventDefault();
        dispatch(setCreateDialogColumn(id));
        dispatch(setCreateDialogOpen(true));
      }
    };

    document.addEventListener("keydown", (e) => handleKeydown(e));
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

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
              id={id}
              title={title}
              tasksCount={tasks.length}
              aria-label={`${title} task list`}
              data-testid="column-title"
            />
          </Header>
          <TaskList columnId={id} listType="TASK" tasks={tasks} index={index} />
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
