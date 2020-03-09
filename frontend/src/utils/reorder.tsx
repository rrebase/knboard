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
  destination
}: ReorderTasksArgs): ReorderTasksResult => {
  const current: Id[] = [...tasksByColumn[source.droppableId]];
  const next: Id[] = [...tasksByColumn[destination.droppableId]];
  const target: Id = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Id[] = reorder(current, source.index, destination.index);
    const result: TasksByColumn = {
      ...tasksByColumn,
      [source.droppableId]: reordered
    };
    return {
      tasksByColumn: result
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
    [destination.droppableId]: next
  };

  return {
    tasksByColumn: result
  };
};

type List<T> = {
  id: string;
  values: T[];
};

interface MoveBetweenArgs<T> {
  list1: List<T>;
  list2: List<T>;
  source: DraggableLocation;
  destination: DraggableLocation;
}

type MoveBetweenResult<T> = {
  list1: List<T>;
  list2: List<T>;
};

export function moveBetween<T>({
  list1,
  list2,
  source,
  destination
}: MoveBetweenArgs<T>): MoveBetweenResult<T> {
  const newFirst = Array.from(list1.values);
  const newSecond = Array.from(list2.values);

  const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
  const moveTo = moveFrom === newFirst ? newSecond : newFirst;

  const [moved] = moveFrom.splice(source.index, 1);
  moveTo.splice(destination.index, 0, moved);

  return {
    list1: {
      ...list1,
      values: newFirst
    },
    list2: {
      ...list2,
      values: newSecond
    }
  };
}
