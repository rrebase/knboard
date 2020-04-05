import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { TasksByColumn, ITask, Id } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast
} from "features/toast/ToastSlice";
import api, { API_SORT_TASKS, API_TASKS } from "api";

type TasksById = Record<string, ITask>;

interface InitialState {
  byColumn: TasksByColumn;
  byId: TasksById;
}

export const initialState: InitialState = {
  byColumn: {},
  byId: {}
};

export const updateTaskTitle = createAsyncThunk<
  ITask,
  { id: number; title: string }
>("task/updateTaskTitleStatus", async ({ id, title }) => {
  const response = await api.patch(`${API_TASKS}${id}/`, { title });
  return response.data;
});

export const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasksByColumn: (state, action: PayloadAction<TasksByColumn>) => {
      state.byColumn = action.payload;
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
  },
  extraReducers: builder => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const byColumn: TasksByColumn = {};
      const byId: TasksById = {};
      for (const col of action.payload.columns) {
        for (const task of col.tasks) {
          byId[task.id] = task;
        }
        byColumn[col.id] = col.tasks.map(t => t.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    });
    builder.addCase(updateTaskTitle.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
    });
  }
});

export const { setTasksByColumn, deleteTask } = slice.actions;

export const updateTasksByColumn = (
  tasksByColumn: TasksByColumn
): AppThunk => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const previousTasksByColumn = state.task.byColumn;
  const boardId = state.board.detail?.id;
  try {
    dispatch(setTasksByColumn(tasksByColumn));
    await api.post(API_SORT_TASKS, {
      board: boardId,
      tasks: tasksByColumn,
      order: Object.values(tasksByColumn).flat()
    });
    dispatch(createSuccessToast("Tasks ordered"));
  } catch (err) {
    dispatch(setTasksByColumn(previousTasksByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
