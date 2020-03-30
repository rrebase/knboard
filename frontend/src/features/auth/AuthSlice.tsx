import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { API_LOGIN, API_LOGOUT, API_REGISTER } from "api";
import { User } from "types";
import { createErrorToast, createInfoToast } from "features/toast/ToastSlice";
import { AxiosError } from "axios";
import { updateUser, updateAvatar } from "features/profile/ProfileSlice";

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

interface ValidationErrors {
  non_field_errors?: string[];
}

interface RegisterProps {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export const register = createAsyncThunk<
  User,
  RegisterProps,
  {
    rejectValue: ValidationErrors;
  }
>("auth/registerStatus", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(API_REGISTER, credentials);
    return response.data;
  } catch (err) {
    const error: AxiosError<ValidationErrors> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

interface LoginProps {
  username: string;
  password: string;
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
      dispatch(createInfoToast("Logged out"));
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
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (state.user) {
        state.user.username = action.payload.username;
      }
    });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      if (state.user) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        state.user.photo_url = action.payload.photo;
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  }
});

export default slice.reducer;
