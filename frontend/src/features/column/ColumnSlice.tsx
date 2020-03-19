import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getBoardDetailSuccess,
  BoardDetailResponse
} from "features/board/BoardSlice";
import { IColumn } from "types";
import { AppThunk, AppDispatch, RootState } from "store";
import api, { API_SORT_COLUMNS } from "api";

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
    [getBoardDetailSuccess.type]: (
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
  } catch (err) {
    dispatch(setColumns(previousColumns));
    // TODO: NOTISTACK ERROR
  }
};

export default slice.reducer;
