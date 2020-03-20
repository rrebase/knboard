import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Color } from "@material-ui/lab/Alert";

interface InitialState {
  open: boolean;
  message: string | null;
  severity: Color;
}

export const initialState: InitialState = {
  open: false,
  message: null,
  severity: "success"
};

export const slice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    createSuccessToast: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "success";
    },
    createErrorToast: (state, action: PayloadAction<string>) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "error";
    },
    clearToast: state => {
      state.open = false;
    }
  }
});

export const {
  createSuccessToast,
  createErrorToast,
  clearToast
} = slice.actions;

export default slice.reducer;
