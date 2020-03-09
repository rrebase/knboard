import React from "react";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";
import { B200 } from "colors";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult
} from "react-beautiful-dnd";
import Column from "features/column";
import { TasksByColumn, Id } from "types";
import reorder, { reorderTasks } from "utils/reorder";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { setTasksByColumn, setColumns } from "./BoardSlice";

const ParentContainer = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

interface Props {
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
}

const Board = ({
  containerHeight,
  isCombineEnabled,
  withScrollableColumns
}: Props) => {
  const columns = useSelector((state: RootState) => state.board.columns);
  const tasksByColumn = useSelector(
    (state: RootState) => state.board.tasksByColumn
  );
  const tasksById = useSelector((state: RootState) => state.board.tasksById);
  const dispatch = useDispatch();

  const onDragEnd = (result: DropResult) => {
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow: string[] = [...columns];
        shallow.splice(result.source.index, 1);
        dispatch(setColumns(shallow));
        return;
      }

      const column: Id[] = tasksByColumn[result.source.droppableId];
      const withTaskRemoved: Id[] = [...column];
      withTaskRemoved.splice(result.source.index, 1);
      const newColumns: TasksByColumn = {
        ...tasksByColumn,
        [result.source.droppableId]: withTaskRemoved
      };
      dispatch(setTasksByColumn(newColumns));
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === "COLUMN") {
      const newOrdered: string[] = reorder(
        columns,
        source.index,
        destination.index
      );
      dispatch(setColumns(newOrdered));
      return;
    }

    const data = reorderTasks({
      tasksByColumn,
      source,
      destination
    });

    dispatch(setTasksByColumn(data.tasksByColumn));
  };

  const board = (
    <Droppable
      droppableId="board"
      type="COLUMN"
      direction="horizontal"
      ignoreContainerClipping={Boolean(containerHeight)}
      isCombineEnabled={isCombineEnabled}
    >
      {(provided: DroppableProvided) => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((key: string, index: number) => (
            <Column
              key={key}
              index={index}
              title={key}
              tasks={tasksByColumn[key].map(taskId => tasksById[taskId])}
              isScrollable={withScrollableColumns}
              isCombineEnabled={isCombineEnabled}
            />
          ))}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
          board
        )}
      </DragDropContext>
      <Global
        styles={css`
          body {
            background: ${B200};
          }
        `}
      />
    </>
  );
};

export default Board;
