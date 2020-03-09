import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TasksByColumn } from "types";
import { authorQuoteMap as taskMap } from "data";

interface InitialState {
  columns: string[];
  tasksByColumn: TasksByColumn;
}

export const initialState: InitialState = {
  columns: Object.keys(taskMap),
  tasksByColumn: taskMap
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
    }
  }
});

export const { setTasksByColumn, setColumns } = slice.actions;

export default slice.reducer;
