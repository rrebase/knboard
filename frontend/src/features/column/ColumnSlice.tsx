import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { fetchBoardById } from "features/board/BoardSlice";
import { IColumn } from "types";
import api, { API_SORT_COLUMNS } from "api";
import {
  createSuccessToast,
  createErrorToast
} from "features/toast/ToastSlice";
import { RootState, AppDispatch, AppThunk } from "store";

const columnAdapter = createEntityAdapter<IColumn>({});

export const initialState = columnAdapter.getInitialState();

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: columnAdapter.setAll
  },
  extraReducers: builder => {
    builder.addCase(fetchBoardById.fulfilled, (state, action) => {
      columnAdapter.setAll(
        state,
        action.payload.columns.map(column => ({
          id: column.id,
          title: column.title,
          board: action.payload.id
        }))
      );
    });
  }
});

export const { setColumns } = slice.actions;

export const columnSelectors = columnAdapter.getSelectors(
  (state: RootState) => state.column
);

const { selectAll } = columnSelectors;
export const selectAllColumns = selectAll;

/**
 * Post the new order of columns.
 * If the request fails, restore the previous order of columns.
 */
export const updateColumns = (columns: IColumn[]): AppThunk => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const previousColumns = selectAll(getState());
  try {
    dispatch(setColumns(columns));
    await api.post(API_SORT_COLUMNS, {
      order: columns.map(col => col.id)
    });
    dispatch(createSuccessToast("Columns ordered"));
  } catch (err) {
    dispatch(setColumns(previousColumns));
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
