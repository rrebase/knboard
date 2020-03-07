import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  value: number;
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  value: 0,
  loading: false,
  error: null
};

export const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    fetchValueStart: state => {
      state.loading = true;
    },
    fetchValueSuccess: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
      state.loading = false;
    },
    fetchValueError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    }
  }
});

export const {
  fetchValueStart,
  fetchValueSuccess,
  fetchValueError,
  increment,
  decrement
} = slice.actions;

export default slice.reducer;
