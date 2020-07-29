import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { fetchBoardById } from "features/board/BoardSlice";
import { IColumn, Id } from "types";
import api, { API_SORT_COLUMNS, API_COLUMNS } from "api";
import { createErrorToast, createInfoToast } from "features/toast/ToastSlice";
import { RootState, AppDispatch, AppThunk } from "store";

export const addColumn = createAsyncThunk<IColumn, number>(
  "column/addColumnStatus",
  async (boardId) => {
    const response = await api.post(`${API_COLUMNS}`, {
      board: boardId,
      title: "new column",
      tasks: [],
    });
    return response.data;
  }
);

interface PatchFields {
  title: string;
}

export const patchColumn = createAsyncThunk<
  IColumn,
  { id: Id; fields: Partial<PatchFields> }
>("column/patchColumnStatus", async ({ id, fields }) => {
  const response = await api.patch(`${API_COLUMNS}${id}/`, fields);
  return response.data;
});

export const deleteColumn = createAsyncThunk<Id, Id>(
  "column/deleteColumnStatus",
  async (id, { dispatch }) => {
    await api.delete(`${API_COLUMNS}${id}/`);
    dispatch(createInfoToast("Column deleted"));
    return id;
  }
);

const columnAdapter = createEntityAdapter<IColumn>({});

export const initialState = columnAdapter.getInitialState();

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: columnAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      columnAdapter.setAll(
        state,
        action.payload.columns.map((column) => ({
          id: column.id,
          title: column.title,
          board: action.payload.id,
        }))
      );
    });
    builder.addCase(addColumn.fulfilled, (state, action) => {
      columnAdapter.addOne(state, action.payload);
    });
    builder.addCase(patchColumn.fulfilled, (state, action) => {
      columnAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { title: action.payload.title },
      });
    });
    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      columnAdapter.removeOne(state, action.payload);
    });
  },
});

export const { setColumns } = slice.actions;

export const columnSelectors = columnAdapter.getSelectors(
  (state: RootState) => state.column
);

export const {
  selectAll: selectAllColumns,
  selectEntities: selectColumnsEntities,
} = columnSelectors;

/**
 * Post the new order of columns.
 * If the request fails, restore the previous order of columns.
 */
export const updateColumns = (columns: IColumn[]): AppThunk => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const previousColumns = selectAllColumns(getState());
  try {
    dispatch(setColumns(columns));
    await api.post(API_SORT_COLUMNS, {
      order: columns.map((col) => col.id),
    });
  } catch (err) {
    dispatch(setColumns(previousColumns));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
