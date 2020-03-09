import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TasksByColumn, ITask, Id } from "types";
import { taskMap, taskMapOnlyId } from "data";
import { byId } from "utils/normalize";

interface InitialState {
  columns: string[];
  tasksByColumn: TasksByColumn;
  tasksById: Record<string, ITask>;
}

export const initialState: InitialState = {
  columns: Object.keys(taskMap),
  tasksByColumn: taskMapOnlyId,
  tasksById: byId(Object.values(taskMap).flat())
};

export const slice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.columns = action.payload;
    },
    setTasksByColumn: (state, action: PayloadAction<TasksByColumn>) => {
      state.tasksByColumn = action.payload;
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      state.tasksById[action.payload.id] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<Id>) => {
      for (const [column, tasks] of Object.entries(state.tasksByColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === action.payload) {
            state.tasksByColumn[column].splice(i, 1);
          }
        }
      }
      delete state.tasksById[action.payload];
    }
  }
});

export const {
  setTasksByColumn,
  setColumns,
  updateTask,
  deleteTask
} = slice.actions;

export default slice.reducer;
