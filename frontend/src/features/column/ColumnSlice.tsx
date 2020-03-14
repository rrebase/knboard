import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskMap } from "data";

interface InitialState {
  all: string[];
}

export const initialState: InitialState = {
  all: Object.keys(taskMap)
};

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.all = action.payload;
    }
  }
});

export const { setColumns } = slice.actions;

export default slice.reducer;
