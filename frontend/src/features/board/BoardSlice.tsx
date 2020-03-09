import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TasksByColumn, ITask } from "types";
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
    updateTaskTitle: (state, action: PayloadAction<TasksByColumn>) => {
      state.tasksByColumn = action.payload;
    }
  }
});

export const { setTasksByColumn, setColumns } = slice.actions;

export default slice.reducer;
