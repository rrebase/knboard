import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TasksByColumn, ITask, Id } from "types";
import { taskMap, taskMapOnlyId } from "data";
import { arrayToObjbyId } from "utils/normalize";

interface InitialState {
  byColumn: TasksByColumn;
  byId: Record<string, ITask>;
}

export const initialState: InitialState = {
  byColumn: taskMapOnlyId,
  byId: arrayToObjbyId(Object.values(taskMap).flat())
};

export const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasksByColumn: (state, action: PayloadAction<TasksByColumn>) => {
      state.byColumn = action.payload;
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      state.byId[action.payload.id] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<Id>) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    }
  }
});

export const { setTasksByColumn, updateTask, deleteTask } = slice.actions;

export default slice.reducer;
