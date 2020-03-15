import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { taskMap } from "data";
import {
  getBoardDetailSuccess,
  BoardDetailResponse
} from "features/board/BoardSlice";

interface InitialState {
  entities: string[];
}

export const initialState: InitialState = {
  // entities: Object.keys(taskMap)
  entities: []
};

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.entities = action.payload;
    }
  },
  extraReducers: {
    [getBoardDetailSuccess.type]: (
      state,
      action: PayloadAction<BoardDetailResponse>
    ) => {
      state.entities = action.payload.columns.map(c => c.title);
    }
  }
});

export const { setColumns } = slice.actions;

export default slice.reducer;
