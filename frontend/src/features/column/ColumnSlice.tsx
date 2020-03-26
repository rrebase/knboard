import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardDetailResponse, fetchBoardById } from "features/board/BoardSlice";
import { IColumn } from "types";
import { AppThunk, AppDispatch, RootState } from "store";
import api, { API_SORT_COLUMNS } from "api";
import {
  createSuccessToast,
  createErrorToast
} from "features/toast/ToastSlice";

interface InitialState {
  entities: IColumn[];
}

export const initialState: InitialState = {
  entities: []
};

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<IColumn[]>) => {
      state.entities = action.payload;
    }
  },
  extraReducers: {
    [fetchBoardById.fulfilled.type]: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      state.entities = action.payload.columns.map(column => ({
        id: column.id,
        title: column.title
      }));
    }
  }
});

export const { setColumns } = slice.actions;

export const updateColumns = (columns: IColumn[]): AppThunk => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const previousColumns = getState().column.entities;
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
