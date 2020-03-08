import React from "react";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";
import { B100, B200 } from "colors";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult
} from "react-beautiful-dnd";
import Column from "features/column";
import { QuoteMap, Quote } from "types";
import reorder, { reorderQuoteMap } from "utils/reorder";

const ParentContainer = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  background-color: ${B100};
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

interface Props {
  initial: QuoteMap;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
}

const Board = ({
  initial,
  containerHeight,
  isCombineEnabled,
  withScrollableColumns
}: Props) => {
  const [columns, setColumns] = React.useState<QuoteMap>(initial);
  const [ordered, setOrdered] = React.useState<string[]>(Object.keys(initial));

  const onDragEnd = (result: DropResult) => {
    if (result.combine) {
      if (result.type === "COLUMN") {
        const shallow: string[] = [...ordered];
        shallow.splice(result.source.index, 1);
        setOrdered(shallow);
        return;
      }

      const column: Quote[] = columns[result.source.droppableId];
      const withQuoteRemoved: Quote[] = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const newColumns: QuoteMap = {
        ...columns,
        [result.source.droppableId]: withQuoteRemoved
      };
      setColumns(newColumns);
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
        ordered,
        source.index,
        destination.index
      );
      setOrdered(newOrdered);

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: columns,
      source,
      destination
    });

    setColumns(data.quoteMap);
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
          {ordered.map((key: string, index: number) => (
            <Column
              key={key}
              index={index}
              title={key}
              quotes={columns[key]}
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
