import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppDispatch } from "store";
import api, { API_LOGIN } from "api";
import { User } from "types";

interface InitialState {
  user: User | null;
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
    loginSuccess: (state, action: PayloadAction<User>) => {
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

export const login = (username: string, password: string): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(loginStart());
  try {
    const response = await api.post(API_LOGIN, { username, password });
    dispatch(loginSuccess(response.data));
  } catch (err) {
    let errorMsg = err.toString();
    if (err.response.status === 400) {
      errorMsg = err.response.data.non_field_errors;
    }
    dispatch(loginError(errorMsg));
  }
};

export default slice.reducer;
