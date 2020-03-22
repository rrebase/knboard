import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, AppDispatch } from "store";
import api, { API_LOGIN, API_LOGOUT } from "api";
import { User } from "types";
import { createErrorToast } from "features/toast/ToastSlice";

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
      state.error = null;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutSuccess: state => {
      state.user = null;
      state.error = null;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginError,
  logoutSuccess
} = slice.actions;

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

export const logout = (): AppThunk => async (dispatch: AppDispatch) => {
  try {
    dispatch(logoutSuccess());
    await api.post(API_LOGOUT);
  } catch (err) {
    dispatch(createErrorToast(err.toString()));
  }
};

export default slice.reducer;
