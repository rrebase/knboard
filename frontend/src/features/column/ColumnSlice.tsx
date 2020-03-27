import {
  createSlice,
  PayloadAction,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { BoardDetailResponse, fetchBoardById } from "features/board/BoardSlice";
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
  extraReducers: {
    [fetchBoardById.fulfilled.type]: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      columnAdapter.setAll(
        state,
        action.payload.columns.map(column => ({
          id: column.id,
          title: column.title
        }))
      );
    }
  }
});

export const { setColumns } = slice.actions;

export const columnSelectors = columnAdapter.getSelectors(
  (state: RootState) => state.column
);

/**
 * Post the new order of columns.
 * If the request fails, restore the previous order of columns.
 */
export const updateColumns = (columns: IColumn[]): AppThunk => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const previousColumns = columnSelectors.selectAll(getState());
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
