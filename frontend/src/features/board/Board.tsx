import React from "react";
import styled from "@emotion/styled";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import Column from "features/column";
import { IColumn } from "types";
import reorder, { reorderTasks } from "utils/reorder";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { updateTasksByColumn } from "features/task/TaskSlice";
import { updateColumns, columnSelectors } from "features/column/ColumnSlice";
import { useParams } from "react-router-dom";
import { fetchBoardById } from "./BoardSlice";
import Spinner from "components/Spinner";
import { barHeight, sidebarWidth } from "const";
import PageError from "components/PageError";
import SEO from "components/SEO";

const BoardContainer = styled.div`
  min-width: calc(100vw - ${sidebarWidth});
  min-height: calc(100vh - ${barHeight * 2}px);
  overflow-x: scroll;
  display: flex;
`;

const ColumnContainer = styled.div`
  display: inline-flex;
  width: 100%;
`;

const EmptyBoard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const ColumnsBlock = styled.div``;

const RightMargin = styled.div`
  /* 
  With overflow-x the right-margin of the rightmost column is hidden.
  This is a dummy element that fills up the space to make it 
  seem like there's some right margin.
   */
  &:after {
    content: "";
    display: block;
    width: 0.5rem;
  }
`;

const Board = () => {
  const detail = useSelector((state: RootState) => state.board.detail);
  const error = useSelector((state: RootState) => state.board.detailError);
  const columns = useSelector(columnSelectors.selectAll);
  const tasksByColumn = useSelector((state: RootState) => state.task.byColumn);
  const tasksById = useSelector((state: RootState) => state.task.byId);
  const dispatch = useDispatch();
  const { id } = useParams();

  React.useEffect(() => {
    if (id) {
      dispatch(fetchBoardById({ boardId: id }));
    }
  }, [id]);

  const onDragEnd = (result: DropResult) => {
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
      const newOrdered: IColumn[] = reorder(
        columns,
        source.index,
        destination.index
      );
      dispatch(updateColumns(newOrdered));
      return;
    }

    const data = reorderTasks({
      tasksByColumn,
      source,
      destination,
    });
    dispatch(updateTasksByColumn(data.tasksByColumn));
  };

  const detailDataExists = detail?.id.toString() === id;

  if (error) {
    return <PageError>{error}</PageError>;
  }

  if (!detailDataExists) {
    return <Spinner loading={!detailDataExists} />;
  }

  return (
    <>
      <SEO title={detail?.name} />
      {columns.length !== 0 ? (
        <BoardContainer data-testid="board-container">
          <ColumnsBlock>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
              >
                {(provided: DroppableProvided) => (
                  <ColumnContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columns.map((column: IColumn, index: number) => (
                      <Column
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        index={index}
                        tasks={tasksByColumn[column.id].map(
                          (taskId) => tasksById[taskId]
                        )}
                      />
                    ))}
                    {provided.placeholder}
                  </ColumnContainer>
                )}
              </Droppable>
            </DragDropContext>
          </ColumnsBlock>
          <RightMargin />
        </BoardContainer>
      ) : (
        <EmptyBoard>This board is empty.</EmptyBoard>
      )}
    </>
  );
};

export default Board;
