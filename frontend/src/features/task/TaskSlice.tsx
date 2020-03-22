import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TasksByColumn, ITask, Id } from "types";
import {
  getBoardDetailSuccess,
  BoardDetailResponse
} from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast
} from "features/toast/ToastSlice";
import api, { API_SORT_TASKS } from "api";

type TasksById = Record<string, ITask>;

interface InitialState {
  byColumn: TasksByColumn;
  byId: TasksById;
}

export const initialState: InitialState = {
  byColumn: {},
  byId: {}
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
  },
  extraReducers: {
    [getBoardDetailSuccess.type]: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      const byColumn: TasksByColumn = {};
      const byId: TasksById = {};
      for (const col of action.payload.columns) {
        for (const task of col.tasks) {
          byId[task.id] = task;
        }
        byColumn[col.title] = col.tasks.map(t => t.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    }
  }
});

export const { setTasksByColumn, updateTask, deleteTask } = slice.actions;

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
