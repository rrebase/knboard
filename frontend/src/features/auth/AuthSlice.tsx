import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { API_LOGIN, API_LOGOUT } from "api";
import { User } from "types";
import { createErrorToast } from "features/toast/ToastSlice";
import { AxiosError } from "axios";

interface InitialState {
  user: User | null;
  loading: boolean;
  error?: ValidationErrors;
}

export const initialState: InitialState = {
  user: null,
  loading: false,
  error: undefined
};

interface LoginProps {
  username: string;
  password: string;
}

interface ValidationErrors {
  non_field_errors: string[];
}

export const login = createAsyncThunk<
  User,
  LoginProps,
  {
    rejectValue: ValidationErrors;
  }
>("auth/loginStatus", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(API_LOGIN, credentials);
    return response.data;
  } catch (err) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk(
  "auth/logoutStatus",
  async (_, { dispatch }) => {
    try {
      await api.post(API_LOGOUT);
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  }
);

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(logout.fulfilled, state => {
      state.user = null;
      state.error = undefined;
    });
  }
});

export default slice.reducer;
