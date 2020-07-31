import { TasksByColumn, Id } from "types";
import { DraggableLocation } from "react-beautiful-dnd";

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

interface ReorderTasksArgs {
  tasksByColumn: TasksByColumn;
  source: DraggableLocation;
  destination: DraggableLocation;
}

export interface ReorderTasksResult {
  tasksByColumn: TasksByColumn;
}

export const reorderTasks = ({
  tasksByColumn,
  source,
  destination,
}: ReorderTasksArgs): ReorderTasksResult => {
  const current: Id[] = [...tasksByColumn[source.droppableId]];
  const next: Id[] = [...tasksByColumn[destination.droppableId]];
  const target: Id = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Id[] = reorder(current, source.index, destination.index);
    const result: TasksByColumn = {
      ...tasksByColumn,
      [source.droppableId]: reordered,
    };
    return {
      tasksByColumn: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: TasksByColumn = {
    ...tasksByColumn,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    tasksByColumn: result,
  };
};
