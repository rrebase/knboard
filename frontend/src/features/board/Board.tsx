import React from "react";
import styled from "@emotion/styled";
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
import { setTasksByColumn } from "features/task/TaskSlice";
import { setColumns } from "features/column/ColumnSlice";
import { useParams } from "react-router-dom";
import { fetchBoardDetail } from "./BoardSlice";
import Spinner from "components/Spinner";

const ParentContainer = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  min-height: 100vh - 50px;
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
  const loading = useSelector((state: RootState) => state.board.detailLoading);
  const columns = useSelector((state: RootState) => state.column.entities);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBoardDetail(id));
    }
  }, [id]);

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

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {containerHeight ? (
          <ParentContainer height={containerHeight}>{board}</ParentContainer>
        ) : (
          board
        )}
      </DragDropContext>
    </>
  );
};

export default Board;
