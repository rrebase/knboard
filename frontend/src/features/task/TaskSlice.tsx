import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { TasksByColumn, ITask, Id, NewTask, PriorityValue } from "types";
import { fetchBoardById } from "features/board/BoardSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import {
  createErrorToast,
  createSuccessToast,
  createInfoToast,
} from "features/toast/ToastSlice";
import api, { API_SORT_TASKS, API_TASKS } from "api";
import { addColumn, deleteColumn } from "features/column/ColumnSlice";
import { deleteLabel } from "features/label/LabelSlice";
import { removeBoardMember } from "features/member/MemberSlice";

type TasksById = Record<string, ITask>;

interface InitialState {
  byColumn: TasksByColumn;
  byId: TasksById;
  createLoading: boolean;
  createDialogOpen: boolean;
  createDialogColumn: Id | null;
  editDialogOpen: Id | null;
}

export const initialState: InitialState = {
  byColumn: {},
  byId: {},
  createLoading: false,
  createDialogOpen: false,
  createDialogColumn: null,
  editDialogOpen: null,
};

interface PatchFields {
  title: string;
  description: string;
  priority: PriorityValue;
  labels: Id[];
  assignees: Id[];
}

export const patchTask = createAsyncThunk<
  ITask,
  { id: Id; fields: Partial<PatchFields> }
>("task/patchTaskStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_TASKS}${id}/`, fields);
  return response.data;
});

interface CreateTaskResponse extends ITask {
  column: Id;
}

export const createTask = createAsyncThunk<
  CreateTaskResponse,
  NewTask,
  {
    rejectValue: string;
  }
>("task/createTaskStatus", async (task, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.post(`${API_TASKS}`, task);
    dispatch(createSuccessToast("Task created"));
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteTask = createAsyncThunk<Id, Id>(
  "task/deleteTaskStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_TASKS}${id}/`);
    dispatch(createInfoToast("Task deleted"));
    return id;
  }
);

export const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasksByColumn: (state, action: PayloadAction<TasksByColumn>) => {
      state.byColumn = action.payload;
    },
    setCreateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.createDialogOpen = action.payload;
    },
    setCreateDialogColumn: (state, action: PayloadAction<Id>) => {
      state.createDialogColumn = action.payload;
    },
    setEditDialogOpen: (state, action: PayloadAction<Id | null>) => {
      state.editDialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      const byColumn: TasksByColumn = {};
      const byId: TasksById = {};
      for (const col of action.payload.columns) {
        for (const task of col.tasks) {
          byId[task.id] = task;
        }
        byColumn[col.id] = col.tasks.map((t) => t.id);
      }
      state.byColumn = byColumn;
      state.byId = byId;
    });
    builder.addCase(patchTask.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
    });
    builder.addCase(createTask.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.byId[action.payload.id] = action.payload;
      state.byColumn[action.payload.column].push(action.payload.id);
      state.createDialogOpen = false;
      state.createLoading = false;
    });
    builder.addCase(createTask.rejected, (state) => {
      state.createLoading = false;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      for (const [column, tasks] of Object.entries(state.byColumn)) {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i] === action.payload) {
            state.byColumn[column].splice(i, 1);
          }
        }
      }
      delete state.byId[action.payload];
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.byColumn[action.payload.id] = [];
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      delete state.byColumn[action.payload];
    });
    builder.addCase(deleteLabel.fulfilled, (state, action) => {
      const deletedLabelId = action.payload;
      for (const taskId in state.byId) {
        const task = state.byId[taskId];
        task.labels = task.labels.filter(
          (labelId) => labelId !== deletedLabelId
        );
      }
    });
    builder.addCase(removeBoardMember, (state, action) => {
      const deletedMemberId = action.payload;
      for (const taskId in state.byId) {
        const task = state.byId[taskId];
        task.assignees = task.assignees.filter(
          (assigneeId) => assigneeId !== deletedMemberId
        );
      }
    });
  },
});

export const {
  setTasksByColumn,
  setCreateDialogOpen,
  setCreateDialogColumn,
  setEditDialogOpen,
} = slice.actions;

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
      order: Object.values(tasksByColumn).flat(),
    });
  } catch (err) {
    dispatch(setTasksByColumn(previousTasksByColumn));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
