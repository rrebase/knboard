import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getBoardDetailSuccess,
  BoardDetailResponse
} from "features/board/BoardSlice";
import { IColumn } from "types";

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

export default slice.reducer;
