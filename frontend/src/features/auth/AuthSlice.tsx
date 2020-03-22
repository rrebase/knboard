import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  user: null;
  loading: boolean;
  error: string | null;
}

export const initialState: InitialState = {
  user: null,
  loading: false,
  error: null
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: state => {
      state.user = null;
    }
  }
});

export const { loginStart, loginSuccess, loginError, logout } = slice.actions;

export default slice.reducer;
