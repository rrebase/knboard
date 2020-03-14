import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskMap } from "data";

interface InitialState {
  entities: string[];
}

export const initialState: InitialState = {
  entities: Object.keys(taskMap)
};

export const slice = createSlice({
  name: "column",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<string[]>) => {
      state.entities = action.payload;
    }
  }
});

export const { setColumns } = slice.actions;

export default slice.reducer;
